import { Project } from "../types";

export interface NicheInfo {
  id: string;
  label: string;
  shortLabel?: string;
  icon?: string;
}

export const NICHE_LIST: NicheInfo[] = [
  { id: "all", label: "All Niches", shortLabel: "All" },
  { id: "home-services", label: "Home Services & Renovation", shortLabel: "Home Services" },
  { id: "ecommerce", label: "E-Commerce & Food", shortLabel: "E-Commerce" },
  { id: "salons", label: "Grooming & Studios", shortLabel: "Salons & Studios" },
  { id: "healthcare", label: "Healthcare & Medical", shortLabel: "Healthcare" },
  { id: "saas-tools", label: "Dev Tools & SaaS", shortLabel: "Dev Tools" },
  { id: "enterprise", label: "Enterprise & Legal", shortLabel: "Enterprise" },
  { id: "creative", label: "Creative & Media", shortLabel: "Creative" },
];

export const getProjectNicheId = (p: Project): string => {
  const id = Number((p as any).id || p._id);

  // 1. Explicit project ID mapping for 100% precision
  if (id === 19) return "home-services"; // Straight Flush Plumbing -> strictly Home Services & Renovation
  if (id === 18 || id === 16) return "home-services"; // Renovation Contractor SG -> Home Services & Renovation
  if (id === 5) return "home-services"; // Cleaning Business -> Home Services & Renovation

  if (id === 13) return "ecommerce"; // Bumblebee -> E-Commerce & Food
  if (id === 9) return "ecommerce"; // Orderflow Bd -> E-Commerce & Order Automation

  if (id === 12) return "salons"; // Mask Off Barbershop -> Grooming & Studios
  if (id === 11) return "salons"; // Iliayes Ink -> Grooming & Studios

  if (id === 14) return "healthcare"; // Dr. Dominik Rosenlechner -> Healthcare & Medical

  if (id === 17 || id === 15) return "saas-tools"; // OmniTools -> Dev Tools & SaaS

  if (id === 10) return "enterprise"; // Ava Law Practice -> Enterprise & Legal
  if (id === 7) return "enterprise"; // ERP -> Enterprise & Legal
  if (id === 4) return "enterprise"; // Murtec -> Enterprise & Legal

  if (id === 6) return "creative"; // Space Story Script -> Creative & Media

  // 2. Custom category/niche property check
  const customCat = `${p.category || ""} ${(p as any).niche || ""}`.toLowerCase();

  if (
    customCat.includes("plumb") ||
    customCat.includes("renov") ||
    customCat.includes("contractor") ||
    customCat.includes("clean")
  ) {
    return "home-services";
  }
  if (
    customCat.includes("barber") ||
    customCat.includes("tattoo") ||
    customCat.includes("salon") ||
    customCat.includes("ink")
  ) {
    return "salons";
  }
  if (
    customCat.includes("health") ||
    customCat.includes("med") ||
    customCat.includes("doctor") ||
    customCat.includes("urolog")
  ) {
    return "healthcare";
  }
  if (
    customCat.includes("tool") ||
    customCat.includes("saas") ||
    customCat.includes("dev")
  ) {
    return "saas-tools";
  }
  if (
    customCat.includes("ecom") ||
    customCat.includes("shop") ||
    customCat.includes("food") ||
    customCat.includes("order")
  ) {
    return "ecommerce";
  }
  if (
    customCat.includes("law") ||
    customCat.includes("legal") ||
    customCat.includes("erp") ||
    customCat.includes("enterprise")
  ) {
    return "enterprise";
  }

  // 3. Fallback semantic detection based on keywords
  const text = `${p.title || ""} ${p.description || ""} ${p.desc || ""}`.toLowerCase();

  if (
    /plumb|renovat|contractor|cleaning|interior|hdb|builder|construction|flooring|home/.test(
      text
    )
  ) {
    return "home-services";
  }
  if (/barber|barbershop|tattoo|piercing|hair|fade|salon|studio|ink|grooming/.test(text)) {
    return "salons";
  }
  if (/urolog|doctor|clinic|medical|patient|health|andrology|ordination|hospital/.test(text)) {
    return "healthcare";
  }
  if (/tool|developer|utility|crypto|hash|uuid|privacy-first|encoding|web crypto|vitest/.test(text)) {
    return "saas-tools";
  }
  if (/baby|food|e-commerce|ecommerce|shop|order|f-commerce|store|snack|cart|checkout/.test(text)) {
    return "ecommerce";
  }
  if (/story|script|creative|game|space story/.test(text)) {
    return "creative";
  }
  if (/erp|law|legal|corporate|enterprise|management|advocate|contract|traders|accounting/.test(text)) {
    return "enterprise";
  }

  return "enterprise";
};

export const getProjectNicheLabel = (p: Project): string => {
  const id = getProjectNicheId(p);
  const found = NICHE_LIST.find((n) => n.id === id);
  return found ? found.label : "Web Application";
};
