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
    customCat.includes("ecom") ||
    customCat.includes("shop") ||
    customCat.includes("food") ||
    customCat.includes("order")
  ) {
    return "ecommerce";
  }
  if (
    customCat.includes("barber") ||
    customCat.includes("tattoo") ||
    customCat.includes("salon")
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
    customCat.includes("law") ||
    customCat.includes("legal") ||
    customCat.includes("erp") ||
    customCat.includes("enterprise")
  ) {
    return "enterprise";
  }

  // Automatic semantic detection based on project keywords
  const text = `${p.title || ""} ${p.description || ""} ${p.desc || ""}`.toLowerCase();

  if (
    /plumb|renovat|contractor|cleaning|interior|hdb|builder|construction|flooring|home/.test(
      text
    )
  ) {
    return "home-services";
  }
  if (
    /baby|food|e-commerce|ecommerce|shop|order|f-commerce|store|snack|cart|checkout/.test(
      text
    )
  ) {
    return "ecommerce";
  }
  if (
    /barber|barbershop|tattoo|piercing|hair|fade|salon|studio|ink|grooming/.test(
      text
    )
  ) {
    return "salons";
  }
  if (
    /urolog|doctor|clinic|medical|patient|health|andrology|ordination|hospital/.test(
      text
    )
  ) {
    return "healthcare";
  }
  if (
    /tool|developer|utility|crypto|hash|uuid|privacy-first|encoding|web crypto|vitest/.test(
      text
    )
  ) {
    return "saas-tools";
  }
  if (
    /erp|law|legal|corporate|enterprise|management|advocate|contract|traders|accounting/.test(
      text
    )
  ) {
    return "enterprise";
  }
  if (/story|script|creative|game|space story/.test(text)) {
    return "creative";
  }

  return "enterprise";
};

export const getProjectNicheLabel = (p: Project): string => {
  const id = getProjectNicheId(p);
  const found = NICHE_LIST.find((n) => n.id === id);
  return found ? found.label : "Web Application";
};

