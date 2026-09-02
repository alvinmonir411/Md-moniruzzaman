import { NextRequest, NextResponse } from "next/server";

const ADMIN_SECRET =
  process.env.ADMIN_SECRET ||
  process.env.NEXT_PUBLIC_ADMIN_SECRET ||
  process.env.ADMIN_PASSWORD ||
  "13663";

export async function POST(request: NextRequest) {
  try {
    const { passcode } = await request.json();

    if (!passcode) {
      return NextResponse.json(
        { success: false, error: "Passcode is required" },
        { status: 400 }
      );
    }

    if (passcode.trim() === ADMIN_SECRET.trim()) {
      const response = NextResponse.json({
        success: true,
        message: "Authentication successful",
      });

      // Set auth cookie valid for 7 days
      response.cookies.set("pixelnest_admin_auth", "authorized", {
        httpOnly: false, // Accessible to client-side auth guard check
        secure: process.env.NODE_ENV === "production",
        maxAge: 7 * 24 * 60 * 60, // 7 days
        path: "/",
        sameSite: "lax",
      });

      return response;
    }

    return NextResponse.json(
      { success: false, error: "Invalid Admin Passcode. Access denied." },
      { status: 401 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Auth error" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  const cookie = request.cookies.get("pixelnest_admin_auth");
  const isAuthenticated = cookie?.value === "authorized";

  return NextResponse.json({
    authenticated: isAuthenticated,
  });
}

export async function DELETE() {
  const response = NextResponse.json({
    success: true,
    message: "Logged out",
  });

  response.cookies.delete("pixelnest_admin_auth");
  return response;
}
