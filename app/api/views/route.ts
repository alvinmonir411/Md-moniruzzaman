import { NextRequest, NextResponse } from "next/server";
import sql from "@/app/lib/db";

// Country code to friendly name mapper
const COUNTRY_MAP: Record<string, string> = {
  BD: "Bangladesh",
  US: "United States",
  USA: "United States",
  GB: "United Kingdom",
  UK: "United Kingdom",
  IN: "India",
  DE: "Germany",
  CA: "Canada",
  AU: "Australia",
  FR: "France",
  NL: "Netherlands",
  SG: "Singapore",
  AE: "United Arab Emirates",
  SA: "Saudi Arabia",
  PK: "Pakistan",
  MY: "Malaysia",
  PH: "Philippines",
  JP: "Japan",
  BR: "Brazil",
};

function formatCountry(raw?: string | null): string {
  if (!raw || raw === "Unknown") return "Bangladesh";
  const upper = raw.trim().toUpperCase();
  if (COUNTRY_MAP[upper]) return COUNTRY_MAP[upper];
  return raw;
}

// Helper to categorize traffic source accurately
function parseTrafficSource(referrerUrl: string, searchStr?: string): string {
  if (searchStr) {
    try {
      const params = new URLSearchParams(searchStr.startsWith("?") ? searchStr : `?${searchStr}`);
      const utm = (params.get("utm_source") || params.get("ref"))?.toLowerCase();
      if (utm) {
        if (utm.includes("facebook") || utm.includes("fb")) return "Facebook";
        if (utm.includes("linkedin")) return "LinkedIn";
        if (utm.includes("google")) return "Google";
        if (utm.includes("github")) return "GitHub";
        if (utm.includes("whatsapp")) return "WhatsApp";
        if (utm.includes("twitter") || utm === "x") return "Twitter / X";
        if (utm.includes("instagram")) return "Instagram";
        if (utm.includes("youtube")) return "YouTube";
        return utm.charAt(0).toUpperCase() + utm.slice(1);
      }
    } catch {}
  }

  if (!referrerUrl || !referrerUrl.trim()) {
    return "Direct";
  }

  const lower = referrerUrl.toLowerCase();

  // Self domain / preview domains / internal navigation count as Direct
  if (
    lower.includes("moniruzzaman") ||
    lower.includes("pexelneststudio") ||
    lower.includes("localhost") ||
    lower.includes("127.0.0.1") ||
    lower.includes("alvinmonir411s-projects.vercel.app")
  ) {
    return "Direct";
  }

  if (lower.includes("facebook.com") || lower.includes("fb.com") || lower.includes("m.facebook.com") || lower.includes("l.facebook.com")) {
    return "Facebook";
  }
  if (lower.includes("linkedin.com") || lower.includes("lnkd.in")) {
    return "LinkedIn";
  }
  if (lower.includes("google.com") || lower.includes("google.")) {
    return "Google";
  }
  if (lower.includes("github.com")) {
    return "GitHub";
  }
  if (lower.includes("whatsapp.com") || lower.includes("wa.me")) {
    return "WhatsApp";
  }
  if (lower.includes("t.co") || lower.includes("twitter.com") || lower.includes("x.com")) {
    return "Twitter / X";
  }
  if (lower.includes("instagram.com") || lower.includes("l.instagram.com")) {
    return "Instagram";
  }
  if (lower.includes("bing.com")) return "Bing";
  if (lower.includes("yahoo.com")) return "Yahoo";
  if (lower.includes("youtube.com")) return "YouTube";

  try {
    const parsed = new URL(referrerUrl);
    const host = parsed.hostname.replace(/^www\./, "");
    if (host.includes("moniruzzaman") || host.includes("vercel.app") && host.includes("alvinmonir")) {
      return "Direct";
    }
    return host;
  } catch {
    return "Direct";
  }
}

// Helper to determine device type
function parseDevice(ua: string): string {
  if (!ua) return "Desktop";
  const lower = ua.toLowerCase();
  if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(lower)) {
    return "Tablet";
  }
  if (/mobile|android|iphone|ipod|blackberry|opera mini|iemobile/i.test(lower)) {
    return "Mobile";
  }
  return "Desktop";
}

// Helper to determine browser
function parseBrowser(ua: string): string {
  if (!ua) return "Unknown";
  const lower = ua.toLowerCase();
  if (lower.includes("edg/")) return "Edge";
  if (lower.includes("opr/") || lower.includes("opera")) return "Opera";
  if (lower.includes("chrome") && !lower.includes("edg/")) return "Chrome";
  if (lower.includes("safari") && !lower.includes("chrome")) return "Safari";
  if (lower.includes("firefox")) return "Firefox";
  return "Browser";
}

async function ensureTables() {
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS page_views (
        id INT PRIMARY KEY DEFAULT 1,
        view_count INT DEFAULT 1,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;
    await sql`
      CREATE TABLE IF NOT EXISTS site_visits (
        id SERIAL PRIMARY KEY,
        source VARCHAR(100) NOT NULL,
        referrer_url TEXT,
        path VARCHAR(255) DEFAULT '/',
        country VARCHAR(50) DEFAULT 'Unknown',
        city VARCHAR(100),
        device VARCHAR(50) DEFAULT 'Desktop',
        browser VARCHAR(50),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;
  } catch (e) {
    console.warn("Table ensure check:", e);
  }
}

export async function GET() {
  try {
    await ensureTables();

    // 1. Total page views count
    const viewRows = await sql`
      SELECT view_count FROM page_views WHERE id = 1 LIMIT 1;
    `;
    const views = viewRows.length > 0 ? Number(viewRows[0].view_count) : 1;

    // 2. Total logged visits
    const totalRow = await sql`SELECT count(*) as total FROM site_visits;`;
    const totalVisits = Number(totalRow[0]?.total || 0);

    // 3. Traffic sources breakdown
    const sourceRows = await sql`
      SELECT source, count(*) as count
      FROM site_visits
      GROUP BY source
      ORDER BY count DESC;
    `;

    // 4. Device breakdown
    const deviceRows = await sql`
      SELECT device, count(*) as count
      FROM site_visits
      GROUP BY device
      ORDER BY count DESC;
    `;

    // 5. Country breakdown
    const countryRows = await sql`
      SELECT country, count(*) as count
      FROM site_visits
      WHERE country IS NOT NULL AND country != 'Unknown'
      GROUP BY country
      ORDER BY count DESC
      LIMIT 5;
    `;

    // 6. Recent 10 visits log
    const recentRows = await sql`
      SELECT id, source, country, city, device, browser, path, created_at
      FROM site_visits
      ORDER BY id DESC
      LIMIT 10;
    `;

    const totalDenominator = totalVisits > 0 ? totalVisits : 1;

    const sources = sourceRows.map((r: any) => ({
      source: r.source,
      count: Number(r.count),
      percentage: Math.round((Number(r.count) / totalDenominator) * 100),
    }));

    const devices = deviceRows.map((r: any) => ({
      device: r.device,
      count: Number(r.count),
      percentage: Math.round((Number(r.count) / totalDenominator) * 100),
    }));

    const countries = countryRows.map((r: any) => ({
      country: r.country,
      count: Number(r.count),
      percentage: Math.round((Number(r.count) / totalDenominator) * 100),
    }));

    return NextResponse.json({
      views,
      totalVisits,
      sources,
      devices,
      countries,
      recentVisits: recentRows,
    });
  } catch (error: any) {
    console.error("Failed to fetch views analytics:", error);
    return NextResponse.json({
      views: 1,
      totalVisits: 0,
      sources: [],
      devices: [],
      countries: [],
      recentVisits: [],
      error: error.message,
    });
  }
}

export async function POST(request: NextRequest) {
  try {
    await ensureTables();

    // 1. Increment total page views counter
    const result = await sql`
      INSERT INTO page_views (id, view_count, updated_at)
      VALUES (1, 1, CURRENT_TIMESTAMP)
      ON CONFLICT (id) 
      DO UPDATE SET 
        view_count = page_views.view_count + 1,
        updated_at = CURRENT_TIMESTAMP
      RETURNING view_count;
    `;
    const views = result.length > 0 ? Number(result[0].view_count) : 1;

    // 2. Parse client data from body (if provided)
    let bodyReferrer = "";
    let bodyPath = "/";
    let bodySearch = "";

    try {
      const body = await request.json();
      if (body) {
        bodyReferrer = body.referrer || "";
        bodyPath = body.path || "/";
        bodySearch = body.search || "";
      }
    } catch {}

    // 3. Fallback to HTTP headers
    const headerReferrer = request.headers.get("referer") || "";
    const userAgent = request.headers.get("user-agent") || "";
    const rawCountry =
      request.headers.get("x-vercel-ip-country") ||
      request.headers.get("cf-ipcountry") ||
      "Bangladesh";
    const country = formatCountry(rawCountry);
    const rawCity = request.headers.get("x-vercel-ip-city") || "";
    const city = rawCity ? decodeURIComponent(rawCity) : "";

    const finalReferrer = bodyReferrer || headerReferrer;
    const source = parseTrafficSource(finalReferrer, bodySearch);
    const device = parseDevice(userAgent);
    const browser = parseBrowser(userAgent);

    // 4. Log visit in site_visits table
    await sql`
      INSERT INTO site_visits (
        source,
        referrer_url,
        path,
        country,
        city,
        device,
        browser
      ) VALUES (
        ${source},
        ${finalReferrer},
        ${bodyPath},
        ${country},
        ${city},
        ${device},
        ${browser}
      );
    `;

    return NextResponse.json({
      success: true,
      views,
      source,
      country,
      device,
    });
  } catch (error: any) {
    console.error("Failed to log visit:", error);
    return NextResponse.json({ success: false, views: 1 }, { status: 500 });
  }
}
