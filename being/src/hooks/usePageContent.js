import { useSite } from '../context/SiteContext';

/**
 * Field-level access to CMS section content for a single page.
 *
 * Usage:
 *   const content = usePageContent('about');
 *   const heading = content('about-intro', 'heading') ?? 'Fallback heading';
 *   const items   = content('impact-list', 'items') ?? hardcodedItems;
 *
 * Falls back to the provided fallback (usually the existing hardcoded value)
 * while the site payload loads or when the section/field is not present, so
 * the UI is never blank and never structurally changes.
 */
export function usePageContent(pageSlug) {
  const { getSection } = useSite();

  return (component, key, fallback = null) => {
    const section = getSection(pageSlug, component);
    if (!section) return fallback;
    const content = section.content ?? {};
    const value = content[key];
    return value === undefined ? fallback : value;
  };
}
