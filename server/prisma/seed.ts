import { PrismaClient, RoleScope, PublishStatus, Prisma, SectionTemplateScope } from '@prisma/client';
import * as argon2 from 'argon2';

const prisma = new PrismaClient();

const MASTER_EMAIL = 'master@webcrm.com';
const MASTER_PASSWORD = 'Master@123456';
const ADMIN_EMAIL = 'admin@webcrm.com';
const ADMIN_PASSWORD = 'Admin@123456';
const SITE_USER_PASSWORD = 'Site@123456';

// Demo website CMS account for the Being Sevak site (shown on the web-user login page).
const DEMO_USER_EMAIL = 'rahul@beingsevak.org';
const DEMO_USER_PASSWORD = 'Rahul@123456';
const DEMO_ORG_SLUG = 'being-sevak';

// Web-user emails that don't follow the derived admin@<slug-without-dashes>.org
// convention. The mann site reuses the pre-existing admin@manncare.org account
// instead of a freshly created admin@mann.org.
const SITE_USER_EMAIL_OVERRIDES: Record<string, string> = {
  mann: 'admin@manncare.org',
};

type Settings = Record<string, unknown>;

const orgSettings: Record<string, Settings> = {
  'being-sevak': {
    'site.siteName': 'Being Sevak Foundation',
    'site.tagline': 'Being the Change, Serving Humanity',
    'contact.email': 'being.sevak@gmail.com',
    'contact.phone': '+91 8879035035',
    'contact.address': 'Mumbai, India',
    'contact.regNumber': 'NGO Reg. Mumbai',
    'social.facebook': '',
    'social.instagram': '',
    'social.youtube': '',
    'social.linkedin': '',
    'whatsapp.number': '+91 8879035035',
    'map.embedUrl': 'https://www.google.com/maps?q=Mumbai&output=embed',
    'bank.accountName': 'Being Sevak Foundation',
    'bank.accountNumber': '',
    'bank.ifsc': '',
    'bank.branch': 'Mumbai',
    'bank.upi': '',
    'payment.razorpayKeyId': 'rzp_live_StUN8QoR2STezo',
    'payment.razorpayKeySecret': '',
    'payment.name': 'Being Sevak Foundation',
    'payment.description': 'Donation to Being Sevak Foundation',
    'payment.currency': 'INR',
    'payment.receiptPrefix': 'BSV',
    'footer.copyright': '© 2026 Being Sevak Foundation. All rights reserved.',
    'footer.tagline': 'Being the Change, Serving Humanity.',
  },
  ashray: {
    'site.siteName': 'Ashray Foundation',
    'site.tagline': 'Ashray for Life — Shelter, Care & Empowerment',
    'contact.email': 'ashrayforlifefoundation@gmail.com',
    'contact.phone': '+91 9930028300',
    'contact.address': 'Mumbai, Maharashtra, India',
    'contact.regNumber': 'Reg. No. E-37237, Mumbai',
    'social.facebook':
      'https://www.facebook.com/share/1DvP7Ne98A/?mibextid=wwXIfr',
    'social.instagram':
      'https://www.instagram.com/aflf_official?igsh=ZWxjb284a2Jjem12',
    'social.youtube':
      'https://youtube.com/@ashrayforlifefoundation?si=Ys1DRMk-bzcjt-Or',
    'social.linkedin': '',
    'footer.columns': JSON.stringify([
      {
        title: 'Organization',
        links: [
          { label: 'Our Story', url: '/about' },
          { label: 'Our Mission', url: '/about' },
          { label: 'Team & Careers', url: '/about/management-team' },
        ],
      },
      {
        title: 'Quick Links',
        links: [
          { label: 'Donate', url: '/donate' },
          { label: 'Volunteer', url: '/volunteer' },
          { label: 'Events & Gallery', url: '/gallery' },
        ],
      },
      {
        title: 'Legal',
        links: [
          { label: 'Audited Financials', url: '/about/legal-documents' },
          { label: 'Privacy Policy', url: '#' },
          { label: 'Terms of Service', url: '#' },
        ],
      },
    ]),
    'whatsapp.number': '+91 9930028300',
    'map.embedUrl': 'https://www.google.com/maps?q=Mumbai&output=embed',
    'bank.accountName': 'Ashray Foundation',
    'bank.accountNumber': '',
    'bank.ifsc': '',
    'bank.branch': 'Mumbai',
    'bank.upi': '',
    'payment.razorpayKeyId': 'rzp_live_T1vEMMkRqw3jrw',
    'payment.razorpayKeySecret': '',
    'payment.name': 'Ashray Foundation',
    'payment.description': 'Donation to Ashray Foundation',
    'payment.currency': 'INR',
    'payment.receiptPrefix': 'ASR',
    'footer.copyright': '© 2026 Ashray Foundation. All rights reserved.',
    'footer.tagline': 'Just, equitable and humane society through holistic interventions.',
  },
  mann: {
    'site.siteName': 'Mann Care Foundation',
    'site.tagline': 'Creating opportunities, restoring dignity.',
    'contact.email': 'manncarefoundation@gmail.com',
    'contact.phone': '+91 7039006300',
    'contact.address':
      '1708, One World, S.V. Road, Near N.M. High School, Malad West, Mumbai - 400064',
    'contact.regNumber': 'Mann Care Foundation Reg.',
    'social.facebook': 'Mann Care Foundation',
    'social.instagram': '@Mann.Care.Foundation',
    'social.youtube': '',
    'social.linkedin': 'Mann Care Foundation',
    'whatsapp.number': '+91 7039006300',
    'map.embedUrl': 'https://www.google.com/maps?q=Malad%20West%20Mumbai&output=embed',
    'bank.accountName': 'Mann Care Foundation',
    'bank.accountNumber': '',
    'bank.ifsc': '',
    'bank.branch': 'Malad West, Mumbai',
    'bank.upi': '',
    'payment.razorpayKeyId': 'rzp_test_xxxxxxxxxxxxxxxx',
    'payment.razorpayKeySecret': '',
    'payment.name': 'Mann Care Foundation',
    'payment.description': 'Donation to Mann Care Foundation',
    'payment.currency': 'INR',
    'payment.receiptPrefix': 'MNC',
    'footer.copyright': '© 2026 Mann Care Foundation. All rights reserved.',
    'footer.tagline': 'Empowering underprivileged and marginalized individuals.',
  },
};

const PERMISSION_RESOURCES: { resource: string; actions: string[] }[] = [
  { resource: 'organization', actions: ['view', 'create', 'update', 'delete', 'settings', 'assign', 'import'] },
  { resource: 'user', actions: ['view', 'create', 'update', 'delete', 'assign'] },
  { resource: 'role', actions: ['view', 'create', 'update', 'delete'] },
  { resource: 'audit', actions: ['view'] },
  { resource: 'notification', actions: ['view', 'create', 'update'] },
  { resource: 'dashboard', actions: ['view'] },
  { resource: 'media', actions: ['view', 'create', 'delete'] },
  { resource: 'donation', actions: ['view', 'create', 'update', 'delete'] },
  { resource: 'page', actions: ['view', 'create', 'update', 'delete'] },
  { resource: 'section', actions: ['view', 'create', 'update', 'delete'] },
  { resource: 'menu', actions: ['view', 'create', 'update', 'delete'] },
  { resource: 'banner', actions: ['view', 'create', 'update', 'delete'] },
  { resource: 'slider', actions: ['view', 'create', 'update', 'delete'] },
  { resource: 'site', actions: ['view'] },
  { resource: 'project', actions: ['view', 'create', 'update', 'delete'] },
  { resource: 'team', actions: ['view', 'create', 'update', 'delete'] },
  { resource: 'event', actions: ['view', 'create', 'update', 'delete'] },
  { resource: 'blog', actions: ['view', 'create', 'update', 'delete'] },
  { resource: 'gallery', actions: ['view', 'create', 'update', 'delete'] },
  { resource: 'document', actions: ['view', 'create', 'update', 'delete'] },
  { resource: 'testimonial', actions: ['view', 'create', 'update', 'delete'] },
  { resource: 'partner', actions: ['view', 'create', 'update', 'delete'] },
  { resource: 'faq', actions: ['view', 'create', 'update', 'delete'] },
  { resource: 'campaign', actions: ['view', 'create', 'update', 'delete'] },
  { resource: 'donor', actions: ['view', 'create', 'update', 'delete'] },
  { resource: 'volunteer', actions: ['view', 'create', 'update', 'delete'] },
  { resource: 'beneficiary', actions: ['view', 'create', 'update', 'delete'] },
  { resource: 'employee', actions: ['view', 'create', 'update', 'delete'] },
  { resource: 'department', actions: ['view', 'create', 'update', 'delete'] },
  { resource: 'account', actions: ['view', 'create', 'update', 'delete'] },
  { resource: 'transaction', actions: ['view', 'create', 'update', 'delete'] },
  { resource: 'settings', actions: ['view', 'update'] },
];

const ALL_ACTIONS = new Set(['view', 'create', 'update', 'delete', 'settings', 'assign', 'import']);

function permissionCodes(
  resources: { resource: string; actions: string[] }[],
  filter?: (action: string, resource: string) => boolean,
): string[] {
  const codes: string[] = [];
  for (const { resource, actions } of resources) {
    for (const action of actions) {
      if (filter && !filter(action, resource)) continue;
      codes.push(`${resource}:${action}`);
    }
  }
  return codes;
}

const MASTER_PERMISSIONS = permissionCodes(PERMISSION_RESOURCES);
const ADMIN_PERMISSIONS = permissionCodes(PERMISSION_RESOURCES, (action, resource) => {
  if (resource === 'organization') {
    return (
      action === 'view' ||
      action === 'create' ||
      action === 'update' ||
      action === 'settings' ||
      action === 'import'
    );
  }
  if (resource === 'role') return action === 'view';
  if (resource === 'user') return action !== 'delete';
  if (resource === 'audit') return action === 'view';
  if (resource === 'notification') return true;
  if (resource === 'dashboard') return action === 'view';
  return false;
});
const WEBSITE_CMS_RESOURCES = ['media', 'page', 'section', 'menu', 'banner', 'slider', 'site', 'settings'];
const WEBSITE_ENTITY_RESOURCES = [
  'project',
  'team',
  'event',
  'blog',
  'gallery',
  'document',
  'testimonial',
  'partner',
  'faq',
  'award',
  'campaign',
];
const WEBSITE_USER_PERMISSIONS = permissionCodes(PERMISSION_RESOURCES, (action, resource) => {
  if (resource === 'dashboard') return action === 'view';
  if (action === 'delete') {
    return WEBSITE_CMS_RESOURCES.includes(resource) || WEBSITE_ENTITY_RESOURCES.includes(resource);
  }
  if (WEBSITE_CMS_RESOURCES.includes(resource) || WEBSITE_ENTITY_RESOURCES.includes(resource)) {
    return true;
  }
  return false;
});

type SectionSpec = {
  type: string;
  name: string;
  sortOrder: number;
  content: Record<string, unknown>;
};

function homeSections(): SectionSpec[] {
  return [
    {
      type: 'hero',
      name: 'Hero',
      sortOrder: 1,
      content: {
        badge: 'Welcome',
        heading: 'Making a Difference, Together',
        subheading:
          'Working across education, healthcare, livelihood and community welfare to empower those in need.',
        primaryCta: { label: 'Donate Now', url: '/donate' },
        secondaryCta: { label: 'Our Work', url: '/projects' },
        imageUrl: '',
        mobileImageUrl: '',
        altText: 'Hero banner',
      },
    },
    {
      type: 'about',
      name: 'About Intro',
      sortOrder: 2,
      content: {
        tag: 'Who We Are',
        heading: 'A foundation for the community',
        paragraphs: [
          'We are a non-profit committed to bringing meaningful change across all sections of society, from children to the elderly.',
        ],
        imageUrl: '',
        imageAlt: 'About us',
        cta: { label: 'Learn More', url: '/about' },
      },
    },
    {
      type: 'stats',
      name: 'Impact Stats',
      sortOrder: 3,
      content: {
        heading: 'Our Impact',
        items: [
          { value: '15k+', label: 'Lives Impacted' },
          { value: '7', label: 'Sectors of Work' },
          { value: '10+', label: 'Years of Service' },
        ],
      },
    },
    {
      type: 'projects-grid',
      name: 'Our Projects',
      sortOrder: 4,
      content: {
        heading: 'Our Projects',
        subheading: 'Explore how we are transforming lives.',
        showAll: true,
        cta: { label: 'View All Projects', url: '/projects' },
      },
    },
    {
      type: 'campaigns',
      name: 'Campaigns',
      sortOrder: 5,
      content: {
        heading: 'Support a Cause',
        showAll: true,
      },
    },
    {
      type: 'testimonials',
      name: 'Testimonials',
      sortOrder: 6,
      content: {
        heading: 'What People Say',
        items: [
          {
            quote: 'Their support changed our lives. Truly compassionate people.',
            name: 'A Beneficiary',
            role: 'Community Member',
          },
        ],
      },
    },
    {
      type: 'partners',
      name: 'Partners',
      sortOrder: 7,
      content: {
        heading: 'Our Partners',
        showAll: true,
      },
    },
    {
      type: 'cta',
      name: 'Join Us CTA',
      sortOrder: 8,
      content: {
        heading: 'Want to make a difference?',
        paragraph: 'Volunteer with us or contribute to our causes today.',
        buttonLabel: 'Get Involved',
        buttonUrl: '/contact',
      },
    },
    {
      type: 'newsletter',
      name: 'Newsletter',
      sortOrder: 9,
      content: {
        heading: 'Stay Updated',
        subheading: 'Get our latest news and impact stories.',
        placeholder: 'Your email address',
        buttonLabel: 'Subscribe',
      },
    },
  ];
}

function innerPageSections(kind: string): SectionSpec[] {
  const pageHero = {
    type: 'page-hero',
    name: 'Page Hero',
    sortOrder: 1,
    content: {
      heading: '',
      subheading: '',
      imageUrl: '',
      mobileImageUrl: '',
      altText: '',
    },
  };

  switch (kind) {
    case 'about':
      return [
        pageHero,
        { type: 'story', name: 'Our Story', sortOrder: 2, content: { tag: 'Our Story', heading: 'How we started', paragraphs: ['We began with a small team and a big dream.'] } },
        { type: 'mission-vision', name: 'Mission & Vision', sortOrder: 3, content: { mission: { title: 'Our Mission', description: 'To create a just, equitable and humane society through holistic interventions.' }, vision: { title: 'Our Vision', description: 'To build a self-reliant society where every individual has access to basic necessities and opportunities.' } } },
        { type: 'values', name: 'Our Values', sortOrder: 4, content: { heading: 'Our Values', items: [{ icon: '', title: 'Compassion', description: '' }, { icon: '', title: 'Integrity', description: '' }, { icon: '', title: 'Impact', description: '' }] } },
        { type: 'team', name: 'Our Team', sortOrder: 5, content: { heading: 'Our Team', showAll: true } },
        { type: 'awards', name: 'Awards', sortOrder: 6, content: { heading: 'Recognition', showAll: true } },
      ];
    case 'projects':
      return [
        pageHero,
        { type: 'projects-grid', name: 'Projects Grid', sortOrder: 2, content: { heading: 'Our Projects', subheading: 'Every project is a step toward lasting change.', showAll: true } },
      ];
    case 'project-detail':
      return [
        { type: 'program-detail', name: 'Program Detail', sortOrder: 1, content: { tag: '', heading: '', paragraphs: [], mission: '', whyItMatters: '', services: [], beneficiaries: [], impact: [], stats: [], cta: { label: 'Donate', url: '/donate' } } },
      ];
    case 'gallery':
      return [
        pageHero,
        { type: 'gallery', name: 'Gallery', sortOrder: 2, content: { heading: 'Moments That Matter', layout: 'grid' } },
      ];
    case 'contact':
      return [
        pageHero,
        { type: 'contact-info', name: 'Contact Info', sortOrder: 2, content: { heading: 'Get in Touch', items: [{ icon: 'map-marker-alt', label: 'Address', value: '', type: 'address' }, { icon: 'phone', label: 'Phone', value: '', type: 'phone' }, { icon: 'envelope', label: 'Email', value: '', type: 'email' }] } },
        { type: 'form', name: 'Contact Form', sortOrder: 3, content: { heading: 'Send us a message', formType: 'contact', submitLabel: 'Send Message', successMessage: 'Thank you! We will get back to you soon.' } },
        { type: 'map', name: 'Map', sortOrder: 4, content: { heading: 'Find Us' } },
      ];
    case 'donate':
      return [
        pageHero,
        { type: 'donate', name: 'Donate', sortOrder: 2, content: { heading: 'Make a Donation', subheading: 'Your support makes our work possible.', causes: [], amounts: [100, 500, 1000, 5000], payment: {} } },
      ];
    case 'documents':
      return [
        pageHero,
        { type: 'documents', name: 'Documents', sortOrder: 2, content: { heading: 'Reports & Documents' } },
      ];
    case 'faq':
      return [
        pageHero,
        { type: 'faq', name: 'FAQ', sortOrder: 2, content: { heading: 'Frequently Asked Questions', showAll: true } },
      ];
    case 'legal':
      return [
        { type: 'legal', name: 'Legal Text', sortOrder: 1, content: { title: '', blocks: [{ title: '', text: '' }] } },
      ];
    default:
      return [pageHero];
  }
}

// ============================================================
// ASHRAY-SPECIFIC CONTENT
// Mirrors the copy/images currently hardcoded in the Ashray
// React site (Web-Crm/ashray) so the CMS starts out identical.
// ============================================================

const ASHRAY_PROJECTS = [
  {
    slug: 'old-age-home',
    title: 'Nutritious Meals',
    tag: 'Nutrition',
    summary:
      'Providing healthy daily meals to elderly citizens in need, ensuring they receive the sustenance and care they deserve.',
    cardImageUrl: '/images/oldage/img1.jpg',
    heroImageUrl: '/images/oldage/img1.jpg',
    sortOrder: 1,
    featured: true,
  },
  {
    slug: 'medical',
    title: 'Healthcare Support',
    tag: 'Healthcare',
    summary:
      'Specialized checkups and medical aid for disabled individuals, improving their quality of life and well-being.',
    cardImageUrl: '/images/medical/img4.jpg',
    heroImageUrl: '/images/medical/img4.jpg',
    sortOrder: 2,
    featured: true,
  },
  {
    slug: 'education',
    title: 'Empowering Education',
    tag: 'Education',
    summary:
      'Supporting the dreams of underprivileged children with resources, tuition, and essential school supplies.',
    cardImageUrl: '/images/education/Educationhome.jpg',
    heroImageUrl: '/images/education/Educationhome.jpg',
    sortOrder: 3,
    featured: true,
  },
] as const;

const ASHRAY_GALLERY_IMAGES = [
  '/images/Ashray/img2.jpg',
  '/images/Sahara/Sahara.jpg',
  '/images/education/Educationhome.jpg',
  '/images/medical/img4.jpg',
  '/images/oldage/img1.jpg',
  '/images/Ashray/img1.jpg',
  '/images/gallery/vidhyalay1.jpg',
  '/images/gallery/nari1.jpg',
  '/images/gallery/hunger1.jpg',
  '/images/gallery/jal1.jpg',
  '/images/gallery/pashu1.jpg',
  '/images/gallery/img5.jpg',
] as const;

function ashrayHomeSections(): SectionSpec[] {
  return [
    {
      type: 'hero-slider',
      name: 'Hero Slider',
      sortOrder: 1,
      content: {
        heading: 'Ashray for Life Foundation',
        subheading: 'Empowering Lives Since 2022',
        slides: [
          {
            id: 'dignity',
            eyebrow: 'Empowering Lives Since 2022',
            title: 'Restoring Dignity,',
            accent: 'One Life at a Time.',
            subtitle:
              'Ashray for Life Foundation is dedicated to providing compassionate care, nutritious meals, and essential support to elderly citizens, disabled individuals, and underprivileged children in our community.',
            imageUrl: '/images/Ashray/img2.jpg',
            subjectImageUrl: '/images/Ashray/img1.jpg',
            subjectAlt: 'Ashray for Life community',
            subjectPosition: 'center 45%',
            ctaLabel: 'Donate Now',
            ctaUrl: '/donate',
            cta2Label: 'See Our Impact',
            cta2Url: '/gallery',
            panelLabel: 'Ashray for Life',
            panelTitle: 'NOURISH. CARE. PROTECT.',
          },
          {
            id: 'sahara',
            eyebrow: 'Sahara · Elderly Care',
            title: 'Caring For Our Elders,',
            accent: 'With Love & Dignity.',
            subtitle:
              'Supporting elderly individuals with care, dignity, and companionship for a better quality of life.',
            imageUrl: '/images/Sahara/Sahara.jpg',
            subjectImageUrl: '/images/Sahara/img1.jpg',
            subjectAlt: 'Sahara elderly care program',
            subjectPosition: 'center 30%',
            ctaLabel: 'Explore Sahara',
            ctaUrl: '/programs/old-age-home',
            cta2Label: 'Donate Now',
            cta2Url: '/donate',
            panelLabel: 'Project Sahara',
            panelTitle: 'CARE. LOVE. DIGNITY.',
          },
          {
            id: 'vidhyalay',
            eyebrow: 'Project Vidhyalay · Education',
            title: 'Educating Every Child,',
            accent: 'Building Tomorrow Today.',
            subtitle:
              'Breaking the cycle of illiteracy by ensuring every underprivileged child has access to quality education.',
            imageUrl: '/images/education/Educationhome.jpg',
            subjectImageUrl: '/images/education/img2.JPG',
            subjectAlt: 'Project Vidhyalay education program',
            subjectPosition: 'center 32%',
            ctaLabel: 'Explore Vidhyalay',
            ctaUrl: '/programs/education',
            cta2Label: 'See Our Impact',
            cta2Url: '/gallery',
            panelLabel: 'Project Vidhyalay',
            panelTitle: 'EDUCATE. EMPOWER. ELEVATE.',
          },
        ],
      },
    },
    {
      type: 'stats',
      name: 'Impact Stats',
      sortOrder: 2,
      content: {
        heading: 'Our Impact',
        items: [
          { icon: 'group', value: '10,000+', label: 'Lives Impacted' },
          { icon: 'volunteer_activism', value: '15+', label: 'Active Projects' },
          { icon: 'currency_rupee', value: '₹50L+', label: 'Funds Raised' },
          { icon: 'event_available', value: '2+ Years', label: 'of Service' },
        ],
      },
    },
    {
      type: 'projects-grid',
      name: 'Our Projects',
      sortOrder: 3,
      content: {
        heading: 'Our Projects',
        subheading: 'Our Initiatives',
        showAll: true,
        layout: 'cards',
        projects: [
          {
            title: 'Nutritious Meals',
            tag: 'Nutrition',
            description:
              'Providing healthy daily meals to elderly citizens in need, ensuring they receive the sustenance and care they deserve.',
            image: '/images/oldage/img1.jpg',
            url: '/programs/old-age-home',
            position: '0% 50%',
          },
          {
            title: 'Healthcare Support',
            tag: 'Healthcare',
            description:
              'Specialized checkups and medical aid for disabled individuals, improving their quality of life and well-being.',
            image: '/images/medical/img4.jpg',
            url: '/programs/medical',
            position: '50% 50%',
          },
          {
            title: 'Empowering Education',
            tag: 'Education',
            description:
              'Supporting the dreams of underprivileged children with resources, tuition, and essential school supplies.',
            image: '/images/education/Educationhome.jpg',
            url: '/programs/education',
            position: '100% 50%',
          },
        ],
      },
    },
    {
      type: 'gallery',
      name: 'Impact in Action',
      sortOrder: 4,
      content: {
        heading: 'Our Impact',
        layout: 'marquee',
        images: [
          '/images/Ashray/img2.jpg',
          '/images/Sahara/Sahara.jpg',
          '/images/education/Educationhome.jpg',
          '/images/medical/img4.jpg',
          '/images/oldage/img1.jpg',
          '/images/Ashray/img1.jpg',
          '/images/gallery/vidhyalay1.jpg',
          '/images/gallery/nari1.jpg',
          '/images/gallery/hunger1.jpg',
          '/images/gallery/jal1.jpg',
          '/images/gallery/pashu1.jpg',
          '/images/gallery/img5.jpg',
        ],
      },
    },
    {
      type: 'cta',
      name: 'Join Us CTA',
      sortOrder: 5,
      content: {
        heading:
          'Your contribution provides meals, shelter, and care. Join us in making a difference today.',
        paragraph: '',
        buttonLabel: 'Donate Now',
        buttonUrl: '/donate',
        align: 'center',
      },
    },
  ];
}

async function seedAshraySite(orgId: string): Promise<void> {
  const homePage = await prisma.page.findFirst({
    where: { organizationId: orgId, isHome: true },
  });
  if (!homePage) return;

  const projectIds: string[] = [];
  for (const def of ASHRAY_PROJECTS) {
    const project = await prisma.project.upsert({
      where: { organizationId_slug: { organizationId: orgId, slug: def.slug } },
      update: {
        title: def.title,
        tag: def.tag,
        summary: def.summary,
        cardImageUrl: def.cardImageUrl,
        heroImageUrl: def.heroImageUrl,
        sortOrder: def.sortOrder,
        featured: def.featured,
        status: PublishStatus.PUBLISHED,
      },
      create: {
        organizationId: orgId,
        slug: def.slug,
        title: def.title,
        tag: def.tag,
        summary: def.summary,
        cardImageUrl: def.cardImageUrl,
        heroImageUrl: def.heroImageUrl,
        sortOrder: def.sortOrder,
        featured: def.featured,
        status: PublishStatus.PUBLISHED,
      },
    });
    projectIds.push(project.id);
  }

  const gallery = await prisma.gallery.upsert({
    where: { organizationId_slug: { organizationId: orgId, slug: 'ashray-gallery' } },
    update: { title: 'Ashray Gallery', description: 'Moments that matter.', status: PublishStatus.PUBLISHED },
    create: {
      organizationId: orgId,
      slug: 'ashray-gallery',
      title: 'Ashray Gallery',
      description: 'Moments that matter.',
      status: PublishStatus.PUBLISHED,
    },
  });
  await prisma.galleryItem.deleteMany({ where: { galleryId: gallery.id } });
  await prisma.galleryItem.createMany({
    data: ASHRAY_GALLERY_IMAGES.map((imageUrl, i) => ({
      galleryId: gallery.id,
      organizationId: orgId,
      imageUrl,
      altText: '',
      sortOrder: i + 1,
    })),
  });

  await prisma.pageSection.deleteMany({
    where: { pageId: homePage.id, organizationId: orgId },
  });

  for (const def of ashrayHomeSections()) {
    await prisma.pageSection.create({
      data: {
        pageId: homePage.id,
        organizationId: orgId,
        type: def.type,
        name: def.name,
        sortOrder: def.sortOrder,
        isActive: true,
        content: def.content as Prisma.InputJsonValue,
      },
    });
  }

  const aboutPage = await prisma.page.findFirst({
    where: { organizationId: orgId, slug: 'about' },
  });
  if (aboutPage) {
    const aboutUpdates: { type: string; content: Record<string, unknown> }[] = [
      {
        type: 'story',
        content: {
          tag: 'Who We Are',
          heading: 'Welcome to Ashray for Life Foundation (AFLF)',
          paragraphs: [
            'We are a non-profit organization dedicated to supporting underprivileged children, orphans, and the families of daily wage workers, Divyang, visually impaired, Senior Citizens, Empowering poor Women and Child Health Development. Our mission is to provide essential resources and opportunities to improve their lives. Ashray for Life Foundation (AFLF) also creats awareness on various social, road safety, health and current issue among the citizens.',
            'At Ashray for Life Foundation, we are committed to making a positive impact on the lives of those who need it most. Join us in our journey towards a better tomorrow. Together, we can create a world where every child has the opportunity to thrive. Join our cause and make a difference today!',
          ],
        },
      },
      {
        type: 'mission-vision',
        content: {
          mission: {
            title: 'Our Mission',
            description:
              'To empower underprivileged children, orphans, and the children of daily wage workers by providing them with access to quality education, instilling hope for a brighter future. We are dedicated to creating awareness about health and hygiene in slum communities, addressing education and health issues, and ensuring that every family has access to fresh, clean drinking water.',
          },
          vision: {
            title: 'Our Vision',
            description:
              'A world where every child, regardless of their background, has the opportunity to receive a proper education, live a healthy life, and break free from the cycle of poverty. We aim to be a beacon of hope, fostering positive change in the lives of these children and their families, ultimately building stronger, more vibrant communities.',
          },
        },
      },
    ];
    for (const update of aboutUpdates) {
      const section = await prisma.pageSection.findFirst({
        where: { pageId: aboutPage.id, organizationId: orgId, type: update.type },
      });
      if (section) {
        await prisma.pageSection.update({
          where: { id: section.id },
          data: { content: update.content as Prisma.InputJsonValue },
        });
      }
    }
  }

  const mainNav = await prisma.menu.upsert({
    where: {
      organizationId_location: { organizationId: orgId, location: 'main-nav' },
    },
    update: { name: 'Main Navigation' },
    create: { organizationId: orgId, name: 'Main Navigation', location: 'main-nav' },
  });
  await prisma.menuItem.deleteMany({ where: { menuId: mainNav.id } });

  const createMenuItem = async (
    label: string,
    url: string | null,
    parentId: string | null,
    sortOrder: number
  ) =>
    prisma.menuItem.create({
      data: {
        menuId: mainNav.id,
        organizationId: orgId,
        label,
        url,
        parentId,
        sortOrder,
        isActive: true,
      },
    });

  const about = await createMenuItem('About Us', null, null, 1);
  const projects = await createMenuItem('Our Projects', null, null, 2);
  await createMenuItem('Gallery', '/gallery', null, 3);
  await createMenuItem('Get Involved', '/volunteer', null, 4);
  await createMenuItem('Contact Us', '/ContactUs', null, 5);

  const aboutChildren = [
    { label: 'Management Team', url: '/about/management-team' },
    { label: 'Legal Documents', url: '/about/legal-documents' },
  ];
  for (const [i, child] of aboutChildren.entries()) {
    await createMenuItem(child.label, child.url, about.id, i + 1);
  }

  const projectChildren = [
    { label: 'Vidhyalaya', url: '/programs/education' },
    { label: 'Nari Tarang', url: '/programs/women-empowerment' },
    { label: 'Zero Hunger Drive', url: '/programs/zero-hunger-drive' },
    { label: 'Project JAL', url: '/programs/jal-project' },
    { label: 'Ashray Ka Aashra', url: '/programs/orphanage' },
    { label: 'Sahara', url: '/programs/medical' },
    { label: 'Ashray Ka Aashram', url: '/programs/old-age-home' },
    { label: 'Pashu Premi', url: '/programs/pashu-premi' },
  ];
  for (const [i, child] of projectChildren.entries()) {
    await createMenuItem(child.label, child.url, projects.id, i + 1);
  }

  console.log(`Ashray site content seeded for org ${orgId}.`);
}

// ============================================================
// MANN-SPECIFIC CONTENT
// Mirrors the copy/images currently hardcoded in the Mann React
// site (Web-Crm/mann). Image paths are Mann's own Vite asset
// paths (/images, /projects, /media) so the API-mode frontend
// resolves them through its img() helper, while absolute URLs
// uploaded from the editor pass straight through.
// ============================================================

const MANN_PROJECTS = [
  {
    slug: 'poshan',
    title: 'Project Poshan',
    tag: 'Nutrition Support Initiative',
    summary:
      'Addressing hunger, malnutrition and food insecurity through Dry Ration Kits, Nutritious Cooked Meals, Healthy Snack Kits, and Refreshment Support for all needy individuals.',
    cardImageUrl: '/projects/hero1.jpeg',
    heroImageUrl: '/projects/hero1.jpeg',
    sortOrder: 1,
  },
  {
    slug: 'gyaan',
    title: 'Project Gyaan',
    tag: 'Education Support Initiative',
    summary:
      'Ensuring inclusive, continuous, quality education for children from marginalized communities through academic and digital learning support.',
    cardImageUrl: '/projects/hero2.jpeg',
    heroImageUrl: '/projects/hero2.jpeg',
    sortOrder: 2,
  },
  {
    slug: 'sakhi',
    title: 'Project Sakhi',
    tag: 'Women Empowerment Initiative',
    summary:
      'Empowering women holistically through skill development, livelihood training, hygiene support, and confidence-building at the grassroots level.',
    cardImageUrl: '/projects/hero3.jpeg',
    heroImageUrl: '/projects/hero3.jpeg',
    sortOrder: 3,
  },
  {
    slug: 'swasth',
    title: 'Project Swasth',
    tag: 'Health & Hygiene Initiative',
    summary:
      'Promoting preventive healthcare, hygiene awareness, and access to essential health support — including oral health, menstrual hygiene, and medical assistance.',
    cardImageUrl: '/projects/hero4.jpeg',
    heroImageUrl: '/projects/hero4.jpeg',
    sortOrder: 4,
  },
  {
    slug: 'pashu',
    title: 'Project Pashu',
    tag: 'Animal Support Initiative',
    summary:
      'Dedicated to the care, protection, and well-being of animals — stray dogs, abandoned cattle, injured animals — with feeding drives, medical support, and community awareness.',
    cardImageUrl: '/projects/hero5.jpeg',
    heroImageUrl: '/projects/hero5.jpeg',
    sortOrder: 5,
  },
  {
    slug: 'paryavaran',
    title: 'Project Paryavaran',
    tag: 'Environment & Sustainability Initiative',
    summary:
      'Promoting environmental protection through tree plantation, cleanliness drives, and awareness programs to build a greener and healthier future for all.',
    cardImageUrl: '/projects/hero6.jpeg',
    heroImageUrl: '/projects/hero6.jpeg',
    sortOrder: 6,
  },
];

const MANN_GALLERY_IMAGES = [
  '/media/b1.JPG',
  '/media/b2.JPG',
  '/media/b3.JPG',
  '/media/b4.JPG',
  '/media/b5.JPG',
  '/media/b6.JPG',
  '/media/w1.jpg',
  '/media/w2.jpg',
  '/media/w3.jpg',
  '/media/w4.jpg',
  '/media/w5.jpg',
  '/media/l1.jpg',
  '/media/l2.jpg',
  '/media/l3.jpg',
  '/media/l4.jpg',
  '/media/snack1.jpeg',
  '/media/snack2.jpeg',
  '/media/snack3.jpeg',
  '/media/snack4.jpeg',
  '/media/snack5.jpeg',
];

const MANN_MARQUEE_IMAGES = [
  '/media/b1.JPG',
  '/media/w1.jpg',
  '/media/l1.jpg',
  '/media/snack1.jpeg',
  '/media/b2.JPG',
  '/media/w2.jpg',
  '/media/l2.jpg',
  '/media/snack2.jpeg',
  '/media/b3.JPG',
  '/media/w3.jpg',
  '/media/l3.jpg',
  '/media/snack3.jpeg',
];

function mannHomeSections(): SectionSpec[] {
  return [
    {
      type: 'hero-slider',
      name: 'Hero Slider',
      sortOrder: 1,
      content: {
        heading: 'Mann Care Foundation',
        subheading: 'Creating opportunities, restoring dignity.',
        slides: [
          {
            id: 'welcome',
            eyebrow: 'Welcome to Mann',
            title: 'Empowering Women',
            accent: '& Children.',
            subtitle:
              'Mann Care Foundation works to create opportunities and restore dignity for underprivileged and marginalized individuals across Mumbai.',
            imageUrl: '/images/heroslide1.jpeg',
            mobileImageUrl: '/images/mobile-slide1.jpeg',
            altText: 'Empowering Women & Children',
            ctaLabel: 'Donate Now',
            ctaUrl: '/get-involved/donate-online',
            panelLabel: 'Mann Care Foundation',
            panelTitle: 'CREATE OPPORTUNITIES. RESTORE DIGNITY.',
          },
          {
            id: 'poshan',
            eyebrow: 'Project Poshan',
            title: 'Nourishing Lives,',
            accent: 'Restoring Hope.',
            subtitle:
              'Eradicating hunger with radical distribution networks across rural belts.',
            imageUrl: '/images/heroslide2.jpeg',
            mobileImageUrl: '/images/mobile-slide2.jpeg',
            altText: 'Project Poshan',
            ctaLabel: 'Support Poshan',
            ctaUrl: '/projects/poshan',
            panelLabel: 'Project Poshan',
            panelTitle: 'NUTRITION. HOPE. HEALTH.',
          },
          {
            id: 'gyaan',
            eyebrow: 'Project Gyaan',
            title: 'Educating Every Child,',
            accent: 'Building Tomorrow Today.',
            subtitle:
              'Digital literacy as a fundamental human right — opening doors to global knowledge.',
            imageUrl: '/images/heroslide3.jpeg',
            mobileImageUrl: '/images/mobile-slide3.jpeg',
            altText: 'Project Gyaan',
            ctaLabel: 'Support Gyaan',
            ctaUrl: '/projects/gyaan',
            panelLabel: 'Project Gyaan',
            panelTitle: 'EDUCATE. EMPOWER. ELEVATE.',
          },
        ],
      },
    },
    {
      type: 'stats',
      name: 'Impact Stats',
      sortOrder: 2,
      content: {
        heading: 'Our Impact',
        items: [
          { value: '12K+', label: 'Meals Distributed' },
          { value: '5K+', label: 'Students Taught' },
          { value: '850+', label: 'Women Skilled' },
        ],
      },
    },
    {
      type: 'projects-grid',
      name: 'Our Initiatives',
      sortOrder: 3,
      content: {
        heading: 'Our Initiatives',
        subheading: 'From nutrition to education, every project transforms lives.',
        layout: 'cards',
        projects: [
          {
            title: 'Project Poshan',
            tag: 'Nutrition Support Initiative',
            description:
              'Addressing hunger, malnutrition and food insecurity through Dry Ration Kits, Nutritious Cooked Meals, Healthy Snack Kits, and Refreshment Support.',
            image: '/projects/hero1.jpeg',
            url: '/projects/poshan',
          },
          {
            title: 'Project Gyaan',
            tag: 'Education Support Initiative',
            description:
              'Ensuring inclusive, continuous, quality education for children from marginalized communities through academic and digital learning support.',
            image: '/projects/hero2.jpeg',
            url: '/projects/gyaan',
          },
          {
            title: 'Project Sakhi',
            tag: 'Women Empowerment Initiative',
            description:
              'Empowering women holistically through skill development, livelihood training, hygiene support, and confidence-building at the grassroots level.',
            image: '/projects/hero3.jpeg',
            url: '/projects/sakhi',
          },
          {
            title: 'Project Swasth',
            tag: 'Health & Hygiene Initiative',
            description:
              'Promoting preventive healthcare, hygiene awareness, and access to essential health support — including oral health, menstrual hygiene, and medical assistance.',
            image: '/projects/hero4.jpeg',
            url: '/projects/swasth',
          },
          {
            title: 'Project Pashu',
            tag: 'Animal Support Initiative',
            description:
              'Dedicated to the care, protection, and well-being of animals — stray dogs, abandoned cattle, injured animals — with feeding drives, medical support, and community awareness.',
            image: '/projects/hero5.jpeg',
            url: '/projects/pashu',
          },
          {
            title: 'Project Paryavaran',
            tag: 'Environment & Sustainability Initiative',
            description:
              'Promoting environmental protection through tree plantation, cleanliness drives, and awareness programs to build a greener and healthier future for all.',
            image: '/projects/hero6.jpeg',
            url: '/projects/paryavaran',
          },
        ],
      },
    },
    {
      type: 'gallery',
      name: 'Impact in Action',
      sortOrder: 4,
      content: {
        heading: 'Impact in Action',
        layout: 'marquee',
        images: MANN_MARQUEE_IMAGES,
      },
    },
    {
      type: 'cta',
      name: 'Your Turn to Lead',
      sortOrder: 5,
      content: {
        heading: 'Your Turn to Lead',
        paragraph:
          'Your support creates opportunities and restores dignity — one life at a time.',
        buttonLabel: 'Donate Now',
        buttonUrl: '/get-involved/donate-online',
        align: 'center',
      },
    },
  ];
}

async function seedMannSite(orgId: string): Promise<void> {
  const homePage = await prisma.page.findFirst({
    where: { organizationId: orgId, isHome: true },
  });
  if (!homePage) return;

  for (const def of MANN_PROJECTS) {
    await prisma.project.upsert({
      where: { organizationId_slug: { organizationId: orgId, slug: def.slug } },
      update: {
        title: def.title,
        tag: def.tag,
        summary: def.summary,
        cardImageUrl: def.cardImageUrl,
        heroImageUrl: def.heroImageUrl,
        sortOrder: def.sortOrder,
        featured: true,
        status: PublishStatus.PUBLISHED,
      },
      create: {
        organizationId: orgId,
        slug: def.slug,
        title: def.title,
        tag: def.tag,
        summary: def.summary,
        cardImageUrl: def.cardImageUrl,
        heroImageUrl: def.heroImageUrl,
        sortOrder: def.sortOrder,
        featured: true,
        status: PublishStatus.PUBLISHED,
      },
    });
  }

  const gallery = await prisma.gallery.upsert({
    where: { organizationId_slug: { organizationId: orgId, slug: 'mann-gallery' } },
    update: {
      title: 'Mann Gallery',
      description: 'Impact in action.',
      status: PublishStatus.PUBLISHED,
    },
    create: {
      organizationId: orgId,
      slug: 'mann-gallery',
      title: 'Mann Gallery',
      description: 'Impact in action.',
      status: PublishStatus.PUBLISHED,
    },
  });
  await prisma.galleryItem.deleteMany({ where: { galleryId: gallery.id } });
  await prisma.galleryItem.createMany({
    data: MANN_GALLERY_IMAGES.map((imageUrl, i) => ({
      galleryId: gallery.id,
      organizationId: orgId,
      imageUrl,
      altText: '',
      sortOrder: i + 1,
    })),
  });

  await prisma.pageSection.deleteMany({
    where: { pageId: homePage.id, organizationId: orgId },
  });

  for (const def of mannHomeSections()) {
    await prisma.pageSection.create({
      data: {
        pageId: homePage.id,
        organizationId: orgId,
        type: def.type,
        name: def.name,
        sortOrder: def.sortOrder,
        isActive: true,
        content: def.content as Prisma.InputJsonValue,
      },
    });
  }

  console.log(`Mann site content seeded for org ${orgId}.`);
}

type BuiltinTemplateDef = {
  type: string;
  name: string;
  label: string;
  description: string;
  fields: Record<string, unknown>[];
};

const t = (type: string, maxLength = 300) => ({ type, maxLength });

const BUILTIN_SECTION_TEMPLATES: BuiltinTemplateDef[] = [
  {
    type: 'hero',
    name: 'Hero',
    label: 'Hero',
    description: 'Full-width hero with badge, heading, CTAs and images.',
    fields: [
      { name: 'badge', label: 'Badge', ...t('text', 200) },
      { name: 'heading', label: 'Heading', ...t('text', 300), required: true },
      { name: 'subheading', label: 'Subheading', ...t('textarea', 1000) },
      { name: 'primaryCta', label: 'Primary CTA', type: 'link' },
      { name: 'secondaryCta', label: 'Secondary CTA', type: 'link' },
      { name: 'imageUrl', label: 'Image', type: 'image' },
      { name: 'mobileImageUrl', label: 'Mobile Image', type: 'image' },
      { name: 'altText', label: 'Alt Text', ...t('text', 300) },
    ],
  },
  {
    type: 'hero-slider',
    name: 'Hero Slider',
    label: 'Hero Slider',
    description: 'Rotating hero slides with images and CTAs.',
    fields: [
      { name: 'heading', label: 'Heading', ...t('text', 300) },
      { name: 'subheading', label: 'Subheading', ...t('textarea', 1000) },
      {
        name: 'slides',
        label: 'Slides',
        type: 'repeater',
        maxItems: 20,
        fields: [
          { name: 'eyebrow', label: 'Eyebrow', ...t('text', 200) },
          { name: 'title', label: 'Title', ...t('text', 300), required: true },
          { name: 'accent', label: 'Accent (highlight)', ...t('text', 300) },
          { name: 'subtitle', label: 'Subtitle', ...t('textarea', 1000) },
          { name: 'imageUrl', label: 'Image', type: 'image', required: true },
          { name: 'subjectImageUrl', label: 'Subject Image', type: 'image' },
          { name: 'subjectAlt', label: 'Subject Alt Text', ...t('text', 300) },
          { name: 'subjectPosition', label: 'Subject Position', ...t('text', 120) },
          { name: 'ctaLabel', label: 'CTA Label', ...t('text', 120) },
          { name: 'ctaUrl', label: 'CTA URL', ...t('url', 500) },
          { name: 'cta2Label', label: 'Secondary CTA Label', ...t('text', 120) },
          { name: 'cta2Url', label: 'Secondary CTA URL', ...t('url', 500) },
          { name: 'panelLabel', label: 'Panel Label', ...t('text', 200) },
          { name: 'panelTitle', label: 'Panel Tagline', ...t('text', 200) },
          { name: 'altText', label: 'Alt Text', ...t('text', 300) },
        ],
      },
    ],
  },
  {
    type: 'page-hero',
    name: 'Page Hero',
    label: 'Page Hero',
    description: 'Banner strip shown at the top of inner pages.',
    fields: [
      { name: 'heading', label: 'Heading', ...t('text', 300), required: true },
      { name: 'subheading', label: 'Subheading', ...t('textarea', 1000) },
      { name: 'imageUrl', label: 'Image', type: 'image' },
      { name: 'mobileImageUrl', label: 'Mobile Image', type: 'image' },
      { name: 'altText', label: 'Alt Text', ...t('text', 300) },
    ],
  },
  {
    type: 'banner-strip',
    name: 'Banner Strip',
    label: 'Banner Strip',
    description: 'Simple announcement banner.',
    fields: [
      { name: 'title', label: 'Title', ...t('text', 300), required: true },
      { name: 'subtitle', label: 'Subtitle', ...t('textarea', 1000) },
      { name: 'ctaLabel', label: 'CTA Label', ...t('text', 120) },
      { name: 'ctaUrl', label: 'CTA URL', ...t('url', 500) },
      { name: 'imageUrl', label: 'Image', type: 'image' },
    ],
  },
  {
    type: 'about',
    name: 'About Intro',
    label: 'About Intro',
    description: 'Tag, heading, paragraphs and side image.',
    fields: [
      { name: 'tag', label: 'Tag', ...t('text', 200) },
      { name: 'heading', label: 'Heading', ...t('text', 300), required: true },
      { name: 'paragraphs', label: 'Paragraphs', type: 'list', itemType: 'string', maxItems: 50 },
      { name: 'imageUrl', label: 'Image', type: 'image' },
      { name: 'imageAlt', label: 'Image Alt', ...t('text', 300) },
      { name: 'cta', label: 'CTA', type: 'link' },
    ],
  },
  {
    type: 'story',
    name: 'Our Story',
    label: 'Our Story',
    description: 'Narrative block with optional quote and image.',
    fields: [
      { name: 'tag', label: 'Tag', ...t('text', 200) },
      { name: 'heading', label: 'Heading', ...t('text', 300), required: true },
      { name: 'paragraphs', label: 'Paragraphs', type: 'list', itemType: 'string', maxItems: 50 },
      { name: 'quote', label: 'Quote', ...t('textarea', 1000) },
      { name: 'imageUrl', label: 'Image', type: 'image' },
      { name: 'imageAlt', label: 'Image Alt', ...t('text', 300) },
    ],
  },
  {
    type: 'stats',
    name: 'Stats',
    label: 'Stats',
    description: 'Impact numbers with value and label.',
    fields: [
      { name: 'heading', label: 'Heading', ...t('text', 300) },
      {
        name: 'items',
        label: 'Stats',
        type: 'repeater',
        minItems: 1,
        maxItems: 12,
        fields: [
          { name: 'icon', label: 'Icon', ...t('text', 120) },
          { name: 'value', label: 'Value', ...t('text', 60), required: true },
          { name: 'label', label: 'Label', ...t('text', 200), required: true },
        ],
      },
    ],
  },
  {
    type: 'cards',
    name: 'Cards Grid',
    label: 'Cards Grid',
    description: 'Grid of icon + title + description cards.',
    fields: [
      { name: 'heading', label: 'Heading', ...t('text', 300) },
      { name: 'subheading', label: 'Subheading', ...t('textarea', 1000) },
      {
        name: 'items',
        label: 'Cards',
        type: 'repeater',
        minItems: 1,
        maxItems: 30,
        fields: [
          { name: 'icon', label: 'Icon', ...t('text', 120) },
          { name: 'title', label: 'Title', ...t('text', 200), required: true },
          { name: 'description', label: 'Description', ...t('textarea', 2000) },
        ],
      },
    ],
  },
  {
    type: 'values',
    name: 'Values',
    label: 'Values',
    description: 'Organization values grid.',
    fields: [
      { name: 'heading', label: 'Heading', ...t('text', 300) },
      { name: 'subheading', label: 'Subheading', ...t('textarea', 1000) },
      {
        name: 'items',
        label: 'Values',
        type: 'repeater',
        minItems: 1,
        maxItems: 30,
        fields: [
          { name: 'icon', label: 'Icon', ...t('text', 120) },
          { name: 'title', label: 'Title', ...t('text', 200), required: true },
          { name: 'description', label: 'Description', ...t('textarea', 2000) },
        ],
      },
    ],
  },
  {
    type: 'sectors',
    name: 'Sectors',
    label: 'Sectors',
    description: 'Focus sectors grid.',
    fields: [
      { name: 'heading', label: 'Heading', ...t('text', 300) },
      {
        name: 'items',
        label: 'Sectors',
        type: 'repeater',
        minItems: 1,
        maxItems: 30,
        fields: [
          { name: 'icon', label: 'Icon', ...t('text', 120) },
          { name: 'title', label: 'Title', ...t('text', 200), required: true },
          { name: 'description', label: 'Description', ...t('textarea', 2000) },
        ],
      },
    ],
  },
  {
    type: 'projects-grid',
    name: 'Projects Grid',
    label: 'Projects Grid',
    description: 'List of projects, by selection or all.',
    fields: [
      { name: 'heading', label: 'Heading', ...t('text', 300) },
      { name: 'subheading', label: 'Subheading', ...t('textarea', 1000) },
      { name: 'entityIds', label: 'Projects', type: 'entityRef', entityType: 'project', multiple: true },
      { name: 'showAll', label: 'Show all projects', type: 'boolean' },
      { name: 'layout', label: 'Layout', ...t('text', 60) },
      { name: 'cta', label: 'CTA', type: 'link' },
      {
        name: 'projects',
        label: 'Featured Projects',
        type: 'repeater',
        maxItems: 30,
        fields: [
          { name: 'title', label: 'Title', ...t('text', 300), required: true },
          { name: 'tag', label: 'Tag', ...t('text', 120) },
          { name: 'description', label: 'Description', ...t('textarea', 2000) },
          { name: 'image', label: 'Image', type: 'image' },
          { name: 'url', label: 'URL', ...t('url', 500) },
          { name: 'position', label: 'Object Position', ...t('text', 60) },
        ],
      },
    ],
  },
  {
    type: 'program-detail',
    name: 'Program Detail',
    label: 'Program Detail',
    description: 'Full project/program page body.',
    fields: [
      { name: 'tag', label: 'Tag', ...t('text', 200) },
      { name: 'heading', label: 'Heading', ...t('text', 300), required: true },
      { name: 'paragraphs', label: 'Paragraphs', type: 'list', itemType: 'string', maxItems: 50 },
      { name: 'mission', label: 'Mission', ...t('textarea', 2000) },
      { name: 'whyItMatters', label: 'Why It Matters', ...t('textarea', 2000) },
      {
        name: 'services',
        label: 'Services',
        type: 'repeater',
        maxItems: 30,
        fields: [
          { name: 'icon', label: 'Icon', ...t('text', 120) },
          { name: 'title', label: 'Title', ...t('text', 200), required: true },
          { name: 'description', label: 'Description', ...t('textarea', 2000) },
        ],
      },
      {
        name: 'beneficiaries',
        label: 'Beneficiaries',
        type: 'repeater',
        maxItems: 30,
        fields: [
          { name: 'icon', label: 'Icon', ...t('text', 120) },
          { name: 'title', label: 'Title', ...t('text', 200), required: true },
          { name: 'description', label: 'Description', ...t('textarea', 2000) },
        ],
      },
      {
        name: 'impact',
        label: 'Impact',
        type: 'repeater',
        maxItems: 30,
        fields: [
          { name: 'icon', label: 'Icon', ...t('text', 120) },
          { name: 'title', label: 'Title', ...t('text', 200), required: true },
          { name: 'description', label: 'Description', ...t('textarea', 2000) },
        ],
      },
      {
        name: 'stats',
        label: 'Stats',
        type: 'repeater',
        maxItems: 12,
        fields: [
          { name: 'value', label: 'Value', ...t('text', 60), required: true },
          { name: 'label', label: 'Label', ...t('text', 200), required: true },
        ],
      },
      { name: 'cta', label: 'CTA', type: 'link' },
      { name: 'imageUrl', label: 'Image', type: 'image' },
      { name: 'imageAlt', label: 'Image Alt', ...t('text', 300) },
    ],
  },
  {
    type: 'mission-vision',
    name: 'Mission & Vision',
    label: 'Mission & Vision',
    description: 'Two-column mission and vision.',
    fields: [
      {
        name: 'mission',
        label: 'Mission',
        type: 'group',
        fields: [
          { name: 'title', label: 'Title', ...t('text', 300), required: true },
          { name: 'description', label: 'Description', ...t('textarea', 3000), required: true },
        ],
      },
      {
        name: 'vision',
        label: 'Vision',
        type: 'group',
        fields: [
          { name: 'title', label: 'Title', ...t('text', 300), required: true },
          { name: 'description', label: 'Description', ...t('textarea', 3000), required: true },
        ],
      },
    ],
  },
  {
    type: 'cta',
    name: 'Call to Action',
    label: 'Call to Action',
    description: 'Banner with heading, text and button.',
    fields: [
      { name: 'heading', label: 'Heading', ...t('text', 300), required: true },
      { name: 'paragraph', label: 'Paragraph', ...t('textarea', 1000) },
      { name: 'buttonLabel', label: 'Button Label', ...t('text', 120) },
      { name: 'buttonUrl', label: 'Button URL', ...t('url', 500) },
      { name: 'backgroundImageUrl', label: 'Background Image', type: 'image' },
      {
        name: 'align',
        label: 'Alignment',
        type: 'select',
        options: ['left', 'center', 'right'],
      },
    ],
  },
  {
    type: 'team',
    name: 'Team',
    label: 'Team',
    description: 'Team members grid.',
    fields: [
      { name: 'heading', label: 'Heading', ...t('text', 300) },
      { name: 'subheading', label: 'Subheading', ...t('textarea', 1000) },
      { name: 'entityIds', label: 'Team Members', type: 'entityRef', entityType: 'team', multiple: true },
      { name: 'showAll', label: 'Show all members', type: 'boolean' },
      { name: 'layout', label: 'Layout', ...t('text', 60) },
    ],
  },
  {
    type: 'testimonials',
    name: 'Testimonials',
    label: 'Testimonials',
    description: 'Quotes grid.',
    fields: [
      { name: 'heading', label: 'Heading', ...t('text', 300) },
      {
        name: 'items',
        label: 'Testimonials',
        type: 'repeater',
        minItems: 1,
        maxItems: 50,
        fields: [
          { name: 'quote', label: 'Quote', ...t('textarea', 3000), required: true },
          { name: 'name', label: 'Name', ...t('text', 200), required: true },
          { name: 'role', label: 'Role', ...t('text', 300) },
          { name: 'avatarUrl', label: 'Avatar', type: 'image' },
          { name: 'color', label: 'Color', ...t('text', 30) },
        ],
      },
    ],
  },
  {
    type: 'stories',
    name: 'Stories / Blog',
    label: 'Stories / Blog',
    description: 'Stories or blog posts by selection.',
    fields: [
      { name: 'heading', label: 'Heading', ...t('text', 300) },
      { name: 'entityIds', label: 'Stories', type: 'entityRef', entityType: 'blog', multiple: true },
      { name: 'categoryId', label: 'Category', type: 'entityRef', entityType: 'blogCategory' },
    ],
  },
  {
    type: 'gallery',
    name: 'Gallery',
    label: 'Gallery',
    description: 'Image gallery by album.',
    fields: [
      { name: 'heading', label: 'Heading', ...t('text', 300) },
      { name: 'galleryId', label: 'Gallery', type: 'entityRef', entityType: 'gallery' },
      { name: 'layout', label: 'Layout', ...t('text', 60) },
      { name: 'images', label: 'Image URLs', type: 'gallery', maxItems: 200 },
    ],
  },
  {
    type: 'partners',
    name: 'Partners',
    label: 'Partners',
    description: 'Partner logos strip.',
    fields: [
      { name: 'heading', label: 'Heading', ...t('text', 300) },
      { name: 'entityIds', label: 'Partners', type: 'entityRef', entityType: 'partner', multiple: true },
      { name: 'showAll', label: 'Show all partners', type: 'boolean' },
    ],
  },
  {
    type: 'documents',
    name: 'Documents',
    label: 'Documents',
    description: 'Reports and legal documents.',
    fields: [
      { name: 'heading', label: 'Heading', ...t('text', 300) },
      { name: 'categoryId', label: 'Category', type: 'entityRef', entityType: 'documentCategory' },
    ],
  },
  {
    type: 'campaigns',
    name: 'Campaigns',
    label: 'Campaigns',
    description: 'Appeals and fundraising campaigns.',
    fields: [
      { name: 'heading', label: 'Heading', ...t('text', 300) },
      { name: 'entityIds', label: 'Campaigns', type: 'entityRef', entityType: 'campaign', multiple: true },
      { name: 'showAll', label: 'Show all campaigns', type: 'boolean' },
    ],
  },
  {
    type: 'donate',
    name: 'Donate',
    label: 'Donate',
    description: 'Donation widget with causes and amounts.',
    fields: [
      { name: 'heading', label: 'Heading', ...t('text', 300) },
      { name: 'subheading', label: 'Subheading', ...t('textarea', 1000) },
      {
        name: 'causes',
        label: 'Causes',
        type: 'repeater',
        maxItems: 50,
        fields: [
          { name: 'title', label: 'Title', ...t('text', 300), required: true },
          { name: 'description', label: 'Description', ...t('textarea', 2000) },
        ],
      },
      { name: 'amounts', label: 'Amount presets', type: 'list', itemType: 'number', maxItems: 20 },
    ],
  },
  {
    type: 'contact-info',
    name: 'Contact Info',
    label: 'Contact Info',
    description: 'Contact details cards.',
    fields: [
      { name: 'heading', label: 'Heading', ...t('text', 300) },
      {
        name: 'items',
        label: 'Contact Items',
        type: 'repeater',
        minItems: 1,
        maxItems: 20,
        fields: [
          { name: 'icon', label: 'Icon', ...t('text', 120) },
          { name: 'label', label: 'Label', ...t('text', 200), required: true },
          { name: 'value', label: 'Value', ...t('text', 1000), required: true },
          {
            name: 'type',
            label: 'Type',
            type: 'select',
            options: ['address', 'phone', 'email', 'other'],
          },
        ],
      },
    ],
  },
  {
    type: 'map',
    name: 'Map',
    label: 'Map',
    description: 'Embedded map.',
    fields: [
      { name: 'heading', label: 'Heading', ...t('text', 300) },
      { name: 'url', label: 'URL', ...t('url', 1000) },
      { name: 'embedUrl', label: 'Embed URL', ...t('url', 1000) },
    ],
  },
  {
    type: 'form',
    name: 'Form',
    label: 'Form',
    description: 'Contact / volunteer / career form.',
    fields: [
      { name: 'heading', label: 'Heading', ...t('text', 300) },
      { name: 'subheading', label: 'Subheading', ...t('textarea', 1000) },
      {
        name: 'formType',
        label: 'Form Type',
        type: 'select',
        options: ['contact', 'volunteer', 'career', 'custom'],
      },
      {
        name: 'fields',
        label: 'Form Fields',
        type: 'repeater',
        maxItems: 50,
        fields: [
          { name: 'name', label: 'Field Name', ...t('text', 120), required: true },
          { name: 'label', label: 'Label', ...t('text', 200), required: true },
          {
            name: 'type',
            label: 'Input Type',
            type: 'select',
            options: ['text', 'email', 'tel', 'textarea', 'select', 'number'],
          },
          { name: 'placeholder', label: 'Placeholder', ...t('text', 300) },
          { name: 'required', label: 'Required', type: 'boolean' },
          { name: 'options', label: 'Options', type: 'list', itemType: 'string', maxItems: 50 },
        ],
      },
      { name: 'submitLabel', label: 'Submit Label', ...t('text', 120) },
      { name: 'successMessage', label: 'Success Message', ...t('textarea', 1000) },
    ],
  },
  {
    type: 'legal',
    name: 'Legal Text',
    label: 'Legal Text',
    description: 'Privacy policy / terms content blocks.',
    fields: [
      { name: 'title', label: 'Title', ...t('text', 300) },
      {
        name: 'blocks',
        label: 'Blocks',
        type: 'repeater',
        minItems: 1,
        maxItems: 200,
        fields: [
          { name: 'title', label: 'Title', ...t('text', 300), required: true },
          { name: 'text', label: 'Text', ...t('textarea', 20000), required: true },
        ],
      },
    ],
  },
  {
    type: 'awards',
    name: 'Awards',
    label: 'Awards',
    description: 'Awards and recognition grid.',
    fields: [
      { name: 'heading', label: 'Heading', ...t('text', 300) },
      { name: 'entityIds', label: 'Awards', type: 'entityRef', entityType: 'award', multiple: true },
      { name: 'showAll', label: 'Show all awards', type: 'boolean' },
    ],
  },
  {
    type: 'newsletter',
    name: 'Newsletter',
    label: 'Newsletter',
    description: 'Email subscribe block.',
    fields: [
      { name: 'heading', label: 'Heading', ...t('text', 300) },
      { name: 'subheading', label: 'Subheading', ...t('textarea', 1000) },
      { name: 'placeholder', label: 'Placeholder', ...t('text', 200) },
      { name: 'buttonLabel', label: 'Button Label', ...t('text', 120) },
    ],
  },
  {
    type: 'faq',
    name: 'FAQ',
    label: 'FAQ',
    description: 'Frequently asked questions.',
    fields: [
      { name: 'heading', label: 'Heading', ...t('text', 300) },
      { name: 'entityIds', label: 'FAQ Items', type: 'entityRef', entityType: 'faq', multiple: true },
      { name: 'showAll', label: 'Show all FAQs', type: 'boolean' },
    ],
  },
  {
    type: 'location',
    name: 'Location',
    label: 'Location',
    description: 'Office location block.',
    fields: [
      { name: 'heading', label: 'Heading', ...t('text', 300) },
      { name: 'locationId', label: 'Location', type: 'entityRef', entityType: 'location' },
    ],
  },
];

async function seedSiteTemplate(
  orgId: string,
): Promise<void> {
  const homePage = await prisma.page.create({
    data: {
      organizationId: orgId,
      slug: 'home',
      title: 'Home',
      metaTitle: 'Home',
      status: PublishStatus.PUBLISHED,
      template: 'home',
      sortOrder: 0,
      isHome: true,
    },
  });

  const pageDefs: { slug: string; title: string; template: string; sortOrder: number; kind: string }[] = [
    { slug: 'about', title: 'About Us', template: 'inner', sortOrder: 1, kind: 'about' },
    { slug: 'projects', title: 'Projects', template: 'inner', sortOrder: 2, kind: 'projects' },
    { slug: 'gallery', title: 'Gallery', template: 'inner', sortOrder: 3, kind: 'gallery' },
    { slug: 'contact', title: 'Contact', template: 'inner', sortOrder: 4, kind: 'contact' },
    { slug: 'donate', title: 'Donate', template: 'inner', sortOrder: 5, kind: 'donate' },
    { slug: 'documents', title: 'Documents', template: 'inner', sortOrder: 6, kind: 'documents' },
    { slug: 'faq', title: 'FAQ', template: 'inner', sortOrder: 7, kind: 'faq' },
    { slug: 'privacy-policy', title: 'Privacy Policy', template: 'inner', sortOrder: 8, kind: 'legal' },
    { slug: 'terms', title: 'Terms & Conditions', template: 'inner', sortOrder: 9, kind: 'legal' },
  ];

  const pages = await Promise.all(
    pageDefs.map((p) =>
      prisma.page.create({
        data: {
          organizationId: orgId,
          slug: p.slug,
          title: p.title,
          metaTitle: p.title,
          status: PublishStatus.PUBLISHED,
          template: p.template,
          sortOrder: p.sortOrder,
        },
      }),
    ),
  );

  const pageWithSections = [
    { pageId: homePage.id, sections: homeSections() },
    ...pages.map((p) => {
      const def = pageDefs.find((d) => d.slug === p.slug)!;
      return { pageId: p.id, sections: innerPageSections(def.kind) };
    }),
  ];

  for (const { pageId, sections } of pageWithSections) {
    for (const s of sections) {
      await prisma.pageSection.create({
        data: {
          pageId,
          organizationId: orgId,
          type: s.type,
          name: s.name,
          sortOrder: s.sortOrder,
          isActive: true,
          content: s.content as unknown as Prisma.InputJsonValue,
        },
      });
    }
  }

  const mainMenu = await prisma.menu.create({
    data: { organizationId: orgId, name: 'Main Navigation', location: 'main-nav' },
  });
  const footerMenu = await prisma.menu.create({
    data: { organizationId: orgId, name: 'Footer Navigation', location: 'footer' },
  });

  const mainItems = [
    { label: 'Home', url: '/' },
    { label: 'About', url: '/about' },
    { label: 'Projects', url: '/projects' },
    { label: 'Gallery', url: '/gallery' },
    { label: 'Documents', url: '/documents' },
    { label: 'Contact', url: '/contact' },
  ];
  for (const [i, item] of mainItems.entries()) {
    await prisma.menuItem.create({
      data: {
        menuId: mainMenu.id,
        organizationId: orgId,
        label: item.label,
        url: item.url,
        sortOrder: i + 1,
        isActive: true,
      },
    });
  }
  const footerItems = [
    { label: 'About', url: '/about' },
    { label: 'Projects', url: '/projects' },
    { label: 'Donate', url: '/donate' },
    { label: 'Contact', url: '/contact' },
  ];
  for (const [i, item] of footerItems.entries()) {
    await prisma.menuItem.create({
      data: {
        menuId: footerMenu.id,
        organizationId: orgId,
        label: item.label,
        url: item.url,
        sortOrder: i + 1,
        isActive: true,
      },
    });
  }

  await prisma.slider.create({
    data: {
      organizationId: orgId,
      name: 'Hero Slider',
      isActive: true,
      slides: {
        create: [
          {
            organizationId: orgId,
            title: 'Slide 1',
            subtitle: 'Edit this slide from the admin panel.',
            imageUrl: '',
            altText: 'Slide 1',
            sortOrder: 1,
            isActive: true,
          },
        ],
      },
    },
  });
}

async function main(): Promise<void> {
  console.log('Seeding WebCrm database...');

  const permissionRows = PERMISSION_RESOURCES.flatMap(({ resource, actions }) =>
    actions.map((action) => ({
      code: `${resource}:${action}`,
      resource,
      action,
      description: `${action} ${resource}`,
    })),
  );
  for (const row of permissionRows) {
    await prisma.permission.upsert({
      where: { code: row.code },
      update: { resource: row.resource, action: row.action, description: row.description },
      create: { ...row },
    });
  }
  console.log(`Upserted ${permissionRows.length} permissions.`);

  const permissionByCode = new Map<string, string>();
  for (const p of await prisma.permission.findMany()) {
    permissionByCode.set(p.code, p.id);
  }

  async function upsertRole(
    key: string,
    name: string,
    scope: RoleScope,
    codes: string[],
    isSystem = true,
  ): Promise<string> {
    const role = await prisma.role.upsert({
      where: { key },
      update: { name, description: `${name} role` },
      create: { key, name, scope, isSystem, description: `${name} role` },
    });
    const pairs = codes
      .filter((code) => permissionByCode.has(code))
      .map((code) => ({ roleId: role.id, permissionId: permissionByCode.get(code)! }));
    if (pairs.length > 0) {
      await prisma.rolePermission.deleteMany({ where: { roleId: role.id } });
      await prisma.rolePermission.createMany({ data: pairs, skipDuplicates: true });
    }
    return role.id;
  }

  const masterRoleId = await upsertRole('master', 'Platform Master', RoleScope.PLATFORM, MASTER_PERMISSIONS);
  const adminsRoleId = await upsertRole('admins', 'Platform Admin', RoleScope.PLATFORM, ADMIN_PERMISSIONS);
  const websiteUserRoleId = await upsertRole(
    'website_user',
    'Website User',
    RoleScope.ORGANIZATION,
    WEBSITE_USER_PERMISSIONS,
  );

  const masterUser = await prisma.user.upsert({
    where: { email: MASTER_EMAIL },
    update: {},
    create: {
      email: MASTER_EMAIL,
      passwordHash: await argon2.hash(MASTER_PASSWORD),
      firstName: 'Platform',
      lastName: 'Master',
      isMaster: true,
    },
  });
  await prisma.userRole.upsert({
    where: { userId_roleId: { userId: masterUser.id, roleId: masterRoleId } },
    update: {},
    create: { userId: masterUser.id, roleId: masterRoleId },
  });
  console.log('Master admin ready:', MASTER_EMAIL);

  const adminsUser = await prisma.user.upsert({
    where: { email: ADMIN_EMAIL },
    update: {},
    create: {
      email: ADMIN_EMAIL,
      passwordHash: await argon2.hash(ADMIN_PASSWORD),
      firstName: 'Platform',
      lastName: 'Admin',
    },
  });
  await prisma.userRole.upsert({
    where: { userId_roleId: { userId: adminsUser.id, roleId: adminsRoleId } },
    update: {},
    create: { userId: adminsUser.id, roleId: adminsRoleId },
  });
  console.log('Platform admin ready:', ADMIN_EMAIL);

  for (const def of BUILTIN_SECTION_TEMPLATES) {
    const existing = await prisma.sectionTemplate.findFirst({
      where: { organizationId: null, type: def.type },
    });
    const data = {
      type: def.type,
      name: def.name,
      label: def.label,
      description: def.description,
      fields: def.fields as Prisma.InputJsonValue,
    };
    if (existing) {
      await prisma.sectionTemplate.update({ where: { id: existing.id }, data });
    } else {
      await prisma.sectionTemplate.create({
        data: { ...data, scope: SectionTemplateScope.PLATFORM, isSystem: true },
      });
    }
  }
  console.log(`Built-in section templates ready: ${BUILTIN_SECTION_TEMPLATES.length}`);

  for (const [slug, settings] of Object.entries(orgSettings)) {
    if (process.env.SEED_ORG && slug !== process.env.SEED_ORG) continue;
    const name = settings['site.siteName'] as string;
    const email = (settings['contact.email'] as string) || `${slug}@webcrm.com`;

    const org = await prisma.organization.upsert({
      where: { slug },
      update: { name, email, phone: (settings['contact.phone'] as string) ?? null },
      create: {
        name,
        slug,
        email,
        phone: (settings['contact.phone'] as string) ?? null,
        description: `${name} — managed by WebCrm`,
      },
    });

    for (const [key, value] of Object.entries(settings)) {
      await prisma.organizationSetting.upsert({
        where: { organizationId_key: { organizationId: org.id, key } },
        update: { value: value as unknown as Prisma.InputJsonValue },
        create: { organizationId: org.id, key, value: value as unknown as Prisma.InputJsonValue },
      });
    }

    const siteUserEmail =
      SITE_USER_EMAIL_OVERRIDES[slug] ?? `admin@${slug.replace('-', '')}.org`;
    const siteUser = await prisma.user.upsert({
      where: { email: siteUserEmail },
      update: {},
      create: {
        email: siteUserEmail,
        passwordHash: await argon2.hash(SITE_USER_PASSWORD),
        firstName: name.split(' ')[0] ?? slug,
        lastName: 'Website User',
      },
    });

    await prisma.organizationUser.upsert({
      where: { organizationId_userId: { organizationId: org.id, userId: siteUser.id } },
      update: { roleId: websiteUserRoleId, isCurrent: true, isActive: true },
      create: {
        organizationId: org.id,
        userId: siteUser.id,
        roleId: websiteUserRoleId,
        isCurrent: true,
        isActive: true,
      },
    });

    await prisma.organizationAssignment.upsert({
      where: { organizationId_userId: { organizationId: org.id, userId: adminsUser.id } },
      update: {},
      create: { organizationId: org.id, userId: adminsUser.id },
    });

    // Platform admin is granted an active Website User membership on every
    // organization so that admin@webcrm.com can see and switch between all
    // sites (being-sevak, ashray, mann) in the Web User CMS. Mirrors how the
    // per-site website user (siteUser) is linked to its own organization.
    await prisma.organizationUser.upsert({
      where: { organizationId_userId: { organizationId: org.id, userId: adminsUser.id } },
      update: { roleId: websiteUserRoleId, isActive: true },
      create: {
        organizationId: org.id,
        userId: adminsUser.id,
        roleId: websiteUserRoleId,
        isCurrent: false,
        isActive: true,
      },
    });

    await prisma.location.upsert({
      where: {
        organizationId_name: {
          organizationId: org.id,
          name: 'Main Office',
        },
      },
      update: {
        address: (settings['contact.address'] as string) ?? null,
        phone: (settings['contact.phone'] as string) ?? null,
        email: (settings['contact.email'] as string) ?? null,
        isMain: true,
      },
      create: {
        organizationId: org.id,
        name: 'Main Office',
        address: (settings['contact.address'] as string) ?? null,
        phone: (settings['contact.phone'] as string) ?? null,
        email: (settings['contact.email'] as string) ?? null,
        isMain: true,
        isActive: true,
      },
    });

    const sectionCount = await prisma.pageSection.count({ where: { organizationId: org.id } });
    if (sectionCount === 0) {
      await seedSiteTemplate(org.id);
      console.log(`Site template seeded for ${slug}.`);
    }

    if (slug === 'ashray') {
      await seedAshraySite(org.id);
    }

    if (slug === 'mann') {
      await seedMannSite(org.id);
    }

    console.log(`Organization ready: ${name} (website user: ${siteUserEmail})`);
  }

  const demoOrg = await prisma.organization.findUnique({ where: { slug: DEMO_ORG_SLUG } });
  if (demoOrg) {
    const demoUser = await prisma.user.upsert({
      where: { email: DEMO_USER_EMAIL },
      update: { firstName: 'Rahul', lastName: 'Mehta', isActive: true },
      create: {
        email: DEMO_USER_EMAIL,
        passwordHash: await argon2.hash(DEMO_USER_PASSWORD),
        firstName: 'Rahul',
        lastName: 'Mehta',
      },
    });
    await prisma.organizationUser.upsert({
      where: { organizationId_userId: { organizationId: demoOrg.id, userId: demoUser.id } },
      update: { roleId: websiteUserRoleId, isCurrent: true, isActive: true },
      create: {
        organizationId: demoOrg.id,
        userId: demoUser.id,
        roleId: websiteUserRoleId,
        isCurrent: true,
        isActive: true,
      },
    });
    console.log(`Demo website user ready: ${DEMO_USER_EMAIL}`);
  }

  console.log('Seeding complete.');
  console.log(
    `Roles available: master, admins, website_user (ids: ${masterRoleId}, ${adminsRoleId}, ${websiteUserRoleId})`,
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
