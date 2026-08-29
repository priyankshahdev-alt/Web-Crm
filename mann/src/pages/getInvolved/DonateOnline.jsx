import PageHero from "../../components/PageHero";
import DonateSection from "../../components/DonateSection";
import { img } from "../../utils/images";
import { usePageContent } from "../../hooks/usePageContent";

export default function DonateOnline() {
  const content = usePageContent("donate-online");
  const heroTitle = content("page-hero", "heading", "Donate Online");
  const hero = {
    desktop: img(content("page-hero", "imageUrl", "/get-involved/hero3.jpeg")),
    mobile: img(content("page-hero", "mobileImageUrl", "/get-involved/mobile-slide3.jpeg")),
  };
  return (
    <>
      <PageHero desktop={hero.desktop} mobile={hero.mobile} alt={heroTitle} title={heroTitle} className="h-[70vh] md:h-[85vh]" />
      <DonateSection heading={content("donate-section", "heading")} subheading={content("donate-section", "subheading")} />
    </>
  );
}
