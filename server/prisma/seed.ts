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
    'social.facebook': '',
    'social.instagram': '',
    'social.youtube': '',
    'social.linkedin': '',
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
  'mann-care': {
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
  if (action === 'delete') return false;
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
          { name: 'title', label: 'Title', ...t('text', 300), required: true },
          { name: 'subtitle', label: 'Subtitle', ...t('textarea', 1000) },
          { name: 'imageUrl', label: 'Image', type: 'image', required: true },
          { name: 'mobileImageUrl', label: 'Mobile Image', type: 'image' },
          { name: 'ctaLabel', label: 'CTA Label', ...t('text', 120) },
          { name: 'ctaUrl', label: 'CTA URL', ...t('url', 500) },
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

    const settingUpserts = Object.entries(settings).map(([key, value]) =>
      prisma.organizationSetting.upsert({
        where: { organizationId_key: { organizationId: org.id, key } },
        update: { value: value as unknown as Prisma.InputJsonValue },
        create: { organizationId: org.id, key, value: value as unknown as Prisma.InputJsonValue },
      }),
    );
    await Promise.all(settingUpserts);

    const siteUserEmail = `admin@${slug.replace('-', '')}.org`;
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
