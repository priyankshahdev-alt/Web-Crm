import { useSite } from "../context/SiteContext";
import { img } from "../utils/images";

/**
 * Field-level access to CMS section content for a single page.
 *
 * Usage:
 *   const content = usePageContent('our-story');
 *   const heading = content('story', 'heading') ?? 'Fallback heading';
 *   const items   = content('values', 'items') ?? hardcodedItems;
 *   const heroImg = content('page-hero', 'imageUrl', '/about/hero1.jpeg');
 *
 * Falls back to the provided fallback while the site payload loads or when the
 * section/field is not present, so the UI is never blank and never structurally
 * changes. Image fields are resolved through the images util automatically.
 */
export function usePageContent(pageSlug) {
  const { getSection } = useSite();

  return (component, key, fallback = null) => {
    const section = getSection(pageSlug, component);
    if (!section) return fallback;
    const content = section.content ?? {};
    const value = content[key];
    if (value === undefined) return fallback;
    if (pageSlug === "home" && typeof value === "string" && /^\//.test(value)) {
      return img(value);
    }
    if (typeof value === "string" && /^(https?:|data:|blob:)/i.test(value)) {
      return value;
    }
    if (typeof value === "string" && key.toLowerCase().includes("img") || typeof value === "string" && key.toLowerCase().includes("image")) {
      return img(value);
    }
    return value;
  };
}
