"use client";

import { useEffect, Suspense } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import Script from "next/script";

const GTM_ID = "GTM-KHZLV9JM";

declare global {
  interface Window {
    dataLayer: any[];
    gtag?: (...args: any[]) => void;
  }
}

function GTMRouteTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Track page views on SPA route changes
  useEffect(() => {
    if (typeof window !== "undefined" && window.dataLayer) {
      const url = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : "");
      window.dataLayer.push({
        event: "page_view",
        page_location: window.location.href,
        page_path: url,
        page_title: document.title,
      });
    }
  }, [pathname, searchParams]);

  // Track every click interaction across the app
  useEffect(() => {
    const handleGlobalClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      const clickable = target.closest("a, button, [role='button'], input[type='submit']");
      if (clickable && window.dataLayer) {
        const tag = clickable.tagName.toLowerCase();
        const text = (clickable.textContent || clickable.getAttribute("aria-label") || "").trim().slice(0, 100);
        const href = clickable.getAttribute("href") || "";
        const id = clickable.id || "";
        const className = typeof clickable.className === "string" ? clickable.className.slice(0, 100) : "";

        window.dataLayer.push({
          event: "user_click",
          click_element: tag,
          click_text: text,
          click_url: href,
          click_id: id,
          click_class: className,
        });
      }
    };

    document.addEventListener("click", handleGlobalClick, { passive: true });
    return () => {
      document.removeEventListener("click", handleGlobalClick);
    };
  }, []);

  return null;
}

export default function GoogleTagManager() {
  return (
    <>
      {/* Google Tag Manager (Official Async Loader + gtag initializer) */}
      <Script
        id="google-tag-manager"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','${GTM_ID}');

            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
          `,
        }}
      />

      <Suspense fallback={null}>
        <GTMRouteTracker />
      </Suspense>
    </>
  );
}
