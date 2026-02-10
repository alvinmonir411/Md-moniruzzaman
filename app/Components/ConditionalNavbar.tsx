"use client";

import { usePathname } from "next/navigation";
import NavBar from "./Navber";

export default function ConditionalNavbar() {
    const pathname = usePathname();
    console.log("Current pathname:", pathname);

    // Don't show public navbar on admin pages
    if (pathname && pathname.toLowerCase().startsWith("/admin")) {
        return null;
    }

    return <NavBar />;
}
