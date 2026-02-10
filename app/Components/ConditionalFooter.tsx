"use client";

import { usePathname } from "next/navigation";
import Footer from "./Footer";

export default function ConditionalFooter() {
    const pathname = usePathname();

    // Don't show footer on admin pages
    if (pathname && pathname.startsWith("/admin")) {
        return null;
    }

    return <Footer />;
}
