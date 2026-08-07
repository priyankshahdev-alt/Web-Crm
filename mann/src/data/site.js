// =====================================================
// Site-level content data (Home + chrome)
// Backend ready hone par in sab ko API se replace karna hai.
// Images: img() absolute URL passthrough karta hai, to
// backend URLs yahan direct daale ja sakte hain.
// =====================================================
import { img } from "../utils/images";

// ---------- HERO CAROUSEL (3 slides) ----------
export const slides = [
  {
    desktop: img("/images/heroslide1.jpeg"),
    mobile: img("/images/mobile-slide1.jpeg"),
    alt: "Empowering Women & Children",
    cta: "/get-involved/donate-online",
  },
  {
    desktop: img("/images/heroslide2.jpeg"),
    mobile: img("/images/mobile-slide2.jpeg"),
    alt: "Project Poshan",
    cta: "/get-involved/donate-online",
  },
  {
    desktop: img("/images/heroslide3.jpeg"),
    mobile: img("/images/mobile-slide3.jpeg"),
    alt: "Project Gyaan",
    cta: "/get-involved/donate-online",
  },
];

// ---------- STATS ----------
export const stats = [
  { value: "12K+", label: "Meals Distributed" },
  { value: "5K+", label: "Students Taught" },
  { value: "850+", label: "Women Skilled" },
];

// ---------- INITIATIVES (6 projects, real photos) ----------
export const initiatives = [
  {
    num: "01", slug: "poshan", name: "PROJECT POSHAN",
    icon: "restaurant",
    image: img("/projects/hero1.jpeg"),
    text: "Eradicating hunger with radical distribution networks across rural belts.",
    bg: "bg-surface-container-low",
  },
  {
    num: "02", slug: "gyaan", name: "PROJECT GYAAN",
    icon: "school",
    image: img("/projects/hero2.jpeg"),
    text: "Digital literacy as a fundamental human right. Opening doors to global knowledge.",
    bg: "bg-surface-container-low",
  },
  {
    num: "03", slug: "sakhi", name: "PROJECT SAKHI",
    icon: "female",
    image: img("/projects/hero3.jpeg"),
    text: "Women empowerment through skills, health awareness, and economic independence.",
    bg: "bg-surface-container-low",
  },
  {
    num: "04", slug: "swasth", name: "PROJECT SWASTH",
    icon: "medical_services",
    image: img("/projects/hero4.jpeg"),
    text: "Preventive healthcare, hygiene awareness, and access to essential health support.",
    bg: "bg-surface-container-low",
  },
  {
    num: "05", slug: "pashu", name: "PROJECT PASHU",
    icon: "pets",
    image: img("/projects/hero5.jpeg"),
    text: "Care, protection, and humane action for stray, abandoned, and injured animals.",
    bg: "bg-surface-container-low",
  },
  {
    num: "06", slug: "paryavaran", name: "PROJECT PARYAVARAN",
    icon: "eco",
    image: img("/projects/hero6.jpeg"),
    text: "Protecting nature through tree plantation, waste management, and sustainability.",
    bg: "bg-surface-container-low",
  },
];

// ---------- IMPACT IN ACTION (marquee) ----------
export const activities = [
  { image: img("/media/b1.JPG"), caption: "Buttermilk Distribution" },
  { image: img("/media/w1.jpg"), caption: "Watermelon Distribution" },
  { image: img("/media/l1.jpg"), caption: "Litchi Distribution" },
  { image: img("/media/snack1.jpeg"), caption: "Snack Distribution" },
  { image: img("/media/b2.JPG"), caption: "Buttermilk Distribution" },
  { image: img("/media/w2.jpg"), caption: "Watermelon Distribution" },
  { image: img("/media/l2.jpg"), caption: "Litchi Distribution" },
  { image: img("/media/snack2.jpeg"), caption: "Snack Distribution" },
  { image: img("/media/b3.JPG"), caption: "Buttermilk Distribution" },
  { image: img("/media/w3.jpg"), caption: "Watermelon Distribution" },
  { image: img("/media/l3.jpg"), caption: "Litchi Distribution" },
  { image: img("/media/snack3.jpeg"), caption: "Snack Distribution" },
];

// ---------- GET INVOLVED ----------
export const getInvolved = [
  {
    icon: "volunteer_activism", title: "Donate", to: "/get-involved/donate-online",
    desc: "Directly support our nutrition and education initiatives to bring hope to marginalized families.",
    btn: "Donate Now",
  },
  {
    icon: "diversity_1", title: "Volunteer", to: "/get-involved/career",
    desc: "Join our grassroots activities and contribute your skills to create meaningful local impact.",
    btn: "Become a Volunteer",
  },
  {
    icon: "handshake", title: "Partner", to: "/get-involved/corporate-partnership",
    desc: "Collaborate via CSR initiatives to scale our community-first programs sustainably.",
    btn: "Partner With Us",
  },
];

// ---------- CAUSES ----------
export const causes = [
  { num: "01", icon: "school", label: "Education" },
  { num: "02", icon: "restaurant", label: "Nutrition" },
  { num: "03", icon: "female", label: "Empowerment" },
  { num: "04", icon: "medical_services", label: "Health Care" },
  { num: "05", icon: "emergency", label: "Disaster" },
];

// ---------- PARTNERS ----------
export const partners = [
  img("/images/11.png"), img("/images/12.png"), img("/images/13.png"), img("/images/14.png"),
];

// ---------- CONTACT ----------
export const contact = {
  address: "ONE WORLD, S. V. ROAD, MALAD (WEST), MUMBAI - 400064",
  phones: ["+91 70390 06300", "+91 70390 06400"],
  emails: ["manncarefoundation@gmail.com", "info.manncarefoundation@gmail.com"],
  gpayQr: img("/gpay-qr.jpeg"),
  whatsapp: "https://wa.me/917039006300",
  instagram: "https://www.instagram.com/mann.care.foundation?igsh=Z2h3aGUxNGxnbW1u",
};

// ---------- NAV ----------
export const navMenu = [
  {
    label: "Home", to: "/",
  },
  {
    label: "About us",
    children: [
      { label: "Our Story", to: "/about/our-story" },
      { label: "Our Team", to: "/about/our-team" },
      { label: "Legal Certificate", to: "/about/legal-certificate" },
    ],
  },
  {
    label: "Projects",
    children: [
      { label: "Project Poshan", to: "/projects/poshan" },
      { label: "Project Gyaan", to: "/projects/gyaan" },
      { label: "Project Sakhi", to: "/projects/sakhi" },
      { label: "Project Swasth", to: "/projects/swasth" },
      { label: "Project Pashu", to: "/projects/pashu" },
      { label: "Project Paryavaran", to: "/projects/paryavaran" },
    ],
  },
  {
    label: "Get Involved",
    children: [
      { label: "Individual Support", to: "/get-involved/individual-support" },
      { label: "Corporate Partnership", to: "/get-involved/corporate-partnership" },
      { label: "Donate Online", to: "/get-involved/donate-online" },
      { label: "Career", to: "/get-involved/career" },
    ],
  },
  { label: "Media", to: "/media" },
  {
    label: "Contact",
    children: [
      { label: "Get In Touch", to: "/contact/get-in-touch" },
      { label: "Privacy Policy", to: "/contact/privacy-policy" },
    ],
  },
];

// ---------- FOOTER ----------
export const footerTagline = "Compassion. Dignity. Action. Working since 2018 for a better tomorrow.";
export const footerCopyright = "© 2026 MANN CARE FOUNDATION. ALL RIGHTS RESERVED.";

export const footerPrograms = [
  { label: "POSHAN", to: "/projects/poshan" },
  { label: "GYAAN", to: "/projects/gyaan" },
  { label: "SAKHI", to: "/projects/sakhi" },
  { label: "SWASTH", to: "/projects/swasth" },
  { label: "PASHU", to: "/projects/pashu" },
  { label: "PARYAVARAN", to: "/projects/paryavaran" },
];

export const footerLegal = [
  { label: "Privacy Policy", to: "/contact/privacy-policy" },
  { label: "Terms of Service", to: "/contact/privacy-policy" },
];

export const footer = {
  tagline: footerTagline,
  copyright: footerCopyright,
  programs: footerPrograms,
  legal: footerLegal,
};
