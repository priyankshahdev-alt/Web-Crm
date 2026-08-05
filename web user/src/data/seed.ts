import type {
  ActivityLog,
  ApprovalRequest,
  Blog,
  BlogCategory,
  CmsForm,
  CmsPage,
  DashboardStats,
  Event,
  Faq,
  Gallery,
  MediaAsset,
  MediaFolder,
  Menu,
  Notification,
  Partner,
  ProfileUser,
  Project,
  SeoMeta,
  TeamMember,
  Testimonial,
  Website,
  WebsiteSettings,
} from '../types'

export const CURRENT_WEBSITE: Website = {
  id: 'being-sevak',
  name: 'Being Sevak',
  url: 'beingsevak.org',
  description: 'Charitable trust website',
  logoUrl: null,
}

export function buildSeed(): {
  pages: CmsPage[]
  menus: Menu[]
  projects: Project[]
  events: Event[]
  blogs: Blog[]
  blogCategories: BlogCategory[]
  galleries: Gallery[]
  team: TeamMember[]
  testimonials: Testimonial[]
  partners: Partner[]
  faqs: Faq[]
  media: MediaAsset[]
  folders: MediaFolder[]
  forms: CmsForm[]
  seo: SeoMeta[]
  settings: WebsiteSettings[]
  activity: ActivityLog[]
  approvals: ApprovalRequest[]
  notifications: Notification[]
  stats: DashboardStats[]
  profile: ProfileUser[]
} {  const now = Date.now()
  const ago = (days: number) => new Date(now - days * 86_400_000).toISOString()
  const ahead = (days: number) => new Date(now + days * 86_400_000).toISOString()

  const projects: Project[] = [
    {
      id: 'p1',
      slug: 'education-for-all',
      title: 'Education for All',
      tag: 'Education',
      category: 'Education',
      summary:
        'Providing quality education and learning resources to underprivileged children across rural communities.',
      heroImageUrl: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=1200',
      cardImageUrl: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=800',
      status: 'PUBLISHED',
      featured: true,
      sortOrder: 1,
      createdAt: ago(120),
      updatedAt: ago(2),
      stats: [
        { id: 's1', label: 'Students enrolled', value: '2,400', sortOrder: 1 },
        { id: 's2', label: 'Schools supported', value: '38', sortOrder: 2 },
        { id: 's3', label: 'Volunteer teachers', value: '210', sortOrder: 3 },
      ],
    },
    {
      id: 'p2',
      slug: 'clean-water-initiative',
      title: 'Clean Water Initiative',
      tag: 'Water',
      category: 'Health',
      summary:
        'Building sustainable water systems and sanitation facilities for drought-prone villages.',
      heroImageUrl: 'https://images.unsplash.com/photo-1523362628745-0c100150b504?w=1200',
      cardImageUrl: 'https://images.unsplash.com/photo-1523362628745-0c100150b504?w=800',
      status: 'PUBLISHED',
      featured: true,
      sortOrder: 2,
      createdAt: ago(90),
      updatedAt: ago(4),
      stats: [
        { id: 's4', label: 'Wells built', value: '64', sortOrder: 1 },
        { id: 's5', label: 'Villages reached', value: '52', sortOrder: 2 },
        { id: 's6', label: 'Lives impacted', value: '48,000', sortOrder: 3 },
      ],
    },
    {
      id: 'p3',
      slug: 'womens-empowerment',
      title: 'Women Empowerment',
      tag: 'Empowerment',
      category: 'Livelihood',
      summary:
        'Skill training and micro-enterprise support for women in self-help groups.',
      heroImageUrl: 'https://images.unsplash.com/photo-1596526131083-e8c633c948d2?w=1200',
      cardImageUrl: 'https://images.unsplash.com/photo-1596526131083-e8c633c948d2?w=800',
      status: 'PUBLISHED',
      featured: false,
      sortOrder: 3,
      createdAt: ago(60),
      updatedAt: ago(1),
      stats: [
        { id: 's7', label: 'Women trained', value: '1,150', sortOrder: 1 },
        { id: 's8', label: 'SHGs formed', value: '86', sortOrder: 2 },
      ],
    },
    {
      id: 'p4',
      slug: 'elder-care-homes',
      title: 'Elder Care Homes',
      tag: 'Care',
      category: 'Healthcare',
      summary: 'Draft program page for senior citizen residential care.',
      heroImageUrl: null,
      cardImageUrl: null,
      status: 'DRAFT',
      featured: false,
      sortOrder: 4,
      createdAt: ago(12),
      updatedAt: ago(1),
      stats: [],
    },
  ]

  const events: Event[] = [
    {
      id: 'e1',
      slug: 'annual-fundraiser-gala',
      title: 'Annual Fundraiser Gala',
      description: null,
      imageUrl: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=800',
      startDate: ahead(6),
      endDate: ahead(6),
      location: 'Grand Hyatt, Mumbai',
      status: 'PUBLISHED',
      featured: true,
      createdAt: ago(20),
      updatedAt: ago(3),
      gallery: [],
    },
    {
      id: 'e2',
      slug: 'community-health-camp',
      title: 'Community Health Camp',
      description: null,
      imageUrl: 'https://images.unsplash.com/photo-1631815588090-d4bfec5b1ccb?w=800',
      startDate: ahead(14),
      endDate: ahead(14),
      location: 'Sangli District, Maharashtra',
      status: 'PUBLISHED',
      featured: false,
      createdAt: ago(15),
      updatedAt: ago(2),
      gallery: [],
    },
    {
      id: 'e3',
      slug: 'teachers-training-workshop',
      title: 'Teachers Training Workshop',
      description: null,
      imageUrl: 'https://images.unsplash.com/photo-1580894732444-8ecded7900cd?w=800',
      startDate: ahead(28),
      endDate: ahead(29),
      location: 'Being Sevak Learning Center, Pune',
      status: 'DRAFT',
      featured: false,
      createdAt: ago(8),
      updatedAt: ago(1),
      gallery: [],
    },
    {
      id: 'e4',
      slug: 'clean-water-drive-2025',
      title: 'Clean Water Drive 2025',
      description: null,
      imageUrl: 'https://images.unsplash.com/photo-1581244277943-fe4a9c777189?w=800',
      startDate: ago(32),
      endDate: ago(30),
      location: 'Drought districts, Maharashtra',
      status: 'PUBLISHED',
      featured: false,
      createdAt: ago(60),
      updatedAt: ago(31),
      gallery: [],
    },
  ]

  const blogCategories: BlogCategory[] = [
    { id: 'bc1', name: 'Stories', slug: 'stories', createdAt: ago(200), updatedAt: ago(200) },
    { id: 'bc2', name: 'News', slug: 'news', createdAt: ago(200), updatedAt: ago(200) },
    { id: 'bc3', name: 'Impact Reports', slug: 'impact-reports', createdAt: ago(200), updatedAt: ago(200) },
  ]

  const blogs: Blog[] = [
    {
      id: 'b1',
      slug: 'a-day-at-the-learning-center',
      title: 'A Day at the Learning Center',
      excerpt:
        'Inside our rural learning centers — the laughter, the lessons and the quiet victories.',
      coverImageUrl: 'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=800',
      authorName: 'Rahul Mehta',
      categoryId: 'bc1',
      category: { id: 'bc1', name: 'Stories', slug: 'stories' },
      publishedAt: ago(3),
      status: 'PUBLISHED',
      featured: true,
      tags: ['education', 'stories'],
      createdAt: ago(5),
      updatedAt: ago(3),
    },
    {
      id: 'b2',
      slug: 'quarterly-impact-report-q3',
      title: 'Quarterly Impact Report — Q3',
      excerpt:
        'A transparent look at how every rupee was used to drive measurable change.',
      coverImageUrl: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800',
      authorName: 'Ananya Sharma',
      categoryId: 'bc3',
      category: { id: 'bc3', name: 'Impact Reports', slug: 'impact-reports' },
      publishedAt: ago(9),
      status: 'PUBLISHED',
      featured: false,
      tags: ['impact', 'report'],
      createdAt: ago(12),
      updatedAt: ago(9),
    },
    {
      id: 'b3',
      slug: 'volunteer-spotlight-priya',
      title: 'Volunteer Spotlight: Priya',
      excerpt: 'Why a city professional drives 80 km every weekend to teach.',
      coverImageUrl: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=800',
      authorName: 'Kavita Rao',
      categoryId: 'bc1',
      category: { id: 'bc1', name: 'Stories', slug: 'stories' },
      publishedAt: null,
      status: 'DRAFT',
      featured: false,
      tags: ['volunteers'],
      createdAt: ago(2),
      updatedAt: ago(1),
    },
  ]

  const galleries: Gallery[] = [
    {
      id: 'g1',
      slug: 'campus-visits-2025',
      title: 'Campus Visits 2025',
      description: 'Moments from school and campus visits across the year.',
      coverImageUrl: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800',
      status: 'PUBLISHED',
      createdAt: ago(40),
      updatedAt: ago(6),
      items: [
        { id: 'gi1', imageUrl: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800', altText: 'Students in class', sortOrder: 1 },
        { id: 'gi2', imageUrl: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800', altText: 'Classroom learning', sortOrder: 2 },
        { id: 'gi3', imageUrl: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800', altText: 'Library reading', sortOrder: 3 },
        { id: 'gi4', imageUrl: 'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=800', altText: 'Kids with books', sortOrder: 4 },
      ],
    },
    {
      id: 'g2',
      slug: 'field-trips',
      title: 'Field Trips',
      description: 'Documenting our on-ground initiatives.',
      coverImageUrl: 'https://images.unsplash.com/photo-1523995462485-6d2b3baa4c16?w=800',
      status: 'DRAFT',
      createdAt: ago(18),
      updatedAt: ago(1),
      items: [
        { id: 'gi5', imageUrl: 'https://images.unsplash.com/photo-1523995462485-6d2b3baa4c16?w=800', altText: 'Field work', sortOrder: 1 },
      ],
    },
  ]

  const team: TeamMember[] = [
    {
      id: 't1',
      name: 'Rahul Mehta',
      role: 'Founder & Director',
      photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
      bio: 'Social entrepreneur with 15 years in rural development.',
      socials: { linkedin: 'rahulmehta' },
      sortOrder: 1,
      isActive: true,
      createdAt: ago(300),
      updatedAt: ago(10),
    },
    {
      id: 't2',
      name: 'Ananya Sharma',
      role: 'Program Lead — Education',
      photoUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
      bio: 'Ex-teacher leading our education portfolio.',
      socials: { twitter: 'ananyas' },
      sortOrder: 2,
      isActive: true,
      createdAt: ago(240),
      updatedAt: ago(5),
    },
    {
      id: 't3',
      name: 'Kavita Rao',
      role: 'Head of Communications',
      photoUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400',
      bio: 'Storyteller connecting donors to impact.',
      socials: { linkedin: 'kavita-rao', instagram: 'kavitarao' },
      sortOrder: 3,
      isActive: true,
      createdAt: ago(180),
      updatedAt: ago(3),
    },
    {
      id: 't4',
      name: 'Vikram Singh',
      role: 'Field Coordinator',
      photoUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400',
      bio: 'On the ground, every day, in every village.',
      socials: { facebook: 'vikram.singh' },
      sortOrder: 4,
      isActive: false,
      createdAt: ago(150),
      updatedAt: ago(20),
    },
  ]

  const testimonials: Testimonial[] = [
    {
      id: 'ts1',
      quote:
        'Being Sevak changed my daughter\'s future. She is the first girl in our village to go to college.',
      name: 'Sunita Devi',
      role: 'Parent, Sangli',
      avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400',
      rating: 5,
      isActive: true,
      sortOrder: 1,
      createdAt: ago(60),
      updatedAt: ago(5),
    },
    {
      id: 'ts2',
      quote:
        'The clean water project ended years of walking 4 km every morning. We cannot thank them enough.',
      name: 'Ram Jadhav',
      role: 'Village Head, Ambegaon',
      avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400',
      rating: 5,
      isActive: true,
      sortOrder: 2,
      createdAt: ago(50),
      updatedAt: ago(6),
    },
    {
      id: 'ts3',
      quote:
        'Volunteering here gave me purpose. Their transparency is rare in the sector.',
      name: 'Meera Iyer',
      role: 'Volunteer, Mumbai',
      avatarUrl: null,
      rating: 4,
      isActive: true,
      sortOrder: 3,
      createdAt: ago(30),
      updatedAt: ago(2),
    },
  ]

  const partners: Partner[] = [
    { id: 'pt1', name: 'Infosys Foundation', website: 'infosys.com', logoUrl: null, description: 'Education partner', sortOrder: 1, isActive: true, createdAt: ago(200), updatedAt: ago(10) },
    { id: 'pt2', name: 'Tata Trusts', website: 'tatatrusts.org', logoUrl: null, description: 'Water & sanitation', sortOrder: 2, isActive: true, createdAt: ago(180), updatedAt: ago(10) },
    { id: 'pt3', name: 'Google.org', website: 'google.org', logoUrl: null, description: 'Digital literacy', sortOrder: 3, isActive: true, createdAt: ago(120), updatedAt: ago(10) },
  ]

  const faqs: Faq[] = [
    { id: 'f1', question: 'How is my donation used?', answer: '85% of every donation goes directly to program delivery. The rest covers essential operations and audits.', category: 'Donations', sortOrder: 1, isActive: true, createdAt: ago(100), updatedAt: ago(5) },
    { id: 'f2', question: 'Can I volunteer remotely?', answer: 'Yes! We have remote roles in content, design, research and fundraising.', category: 'Volunteering', sortOrder: 2, isActive: true, createdAt: ago(90), updatedAt: ago(5) },
    { id: 'f3', question: 'Do you issue 80G tax certificates?', answer: 'We are registered under 12A & 80G. Certificates are issued for every donation above ₹500.', category: 'Donations', sortOrder: 3, isActive: true, createdAt: ago(80), updatedAt: ago(5) },
  ]

  const media: MediaAsset[] = [
    { id: 'm1', fileName: 'hero-banner.png', mimeType: 'image/png', size: 2_400_000, url: 'https://images.unsplash.com/photo-1559028012-481c04fa702d?w=1200', thumbnailUrl: 'https://images.unsplash.com/photo-1559028012-481c04fa702d?w=300', folder: 'banners', altText: 'Hero banner', width: 1600, height: 900, createdAt: ago(30), updatedAt: ago(30) },
    { id: 'm2', fileName: 'team-photo.jpg', mimeType: 'image/jpeg', size: 1_800_000, url: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200', thumbnailUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=300', folder: 'team', altText: 'Team photo', width: 1280, height: 853, createdAt: ago(25), updatedAt: ago(25) },
    { id: 'm3', fileName: 'fundraiser-flyer.pdf', mimeType: 'application/pdf', size: 640_000, url: '#', thumbnailUrl: null, folder: 'documents', altText: null, createdAt: ago(12), updatedAt: ago(12) },
    { id: 'm4', fileName: 'impact-2025.png', mimeType: 'image/png', size: 3_100_000, url: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1200', thumbnailUrl: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=300', folder: 'reports', altText: 'Impact report cover', width: 1400, height: 900, createdAt: ago(8), updatedAt: ago(8) },
    { id: 'm5', fileName: 'school-visit-01.jpg', mimeType: 'image/jpeg', size: 1_200_000, url: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1200', thumbnailUrl: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=300', folder: 'gallery', altText: 'School visit', width: 1200, height: 800, createdAt: ago(5), updatedAt: ago(5) },
    { id: 'm6', fileName: 'donation-receipt-template.pdf', mimeType: 'application/pdf', size: 210_000, url: '#', thumbnailUrl: null, folder: 'documents', altText: null, createdAt: ago(3), updatedAt: ago(3) },
    { id: 'm7', fileName: 'water-well-project.jpg', mimeType: 'image/jpeg', size: 2_200_000, url: 'https://images.unsplash.com/photo-1581244277943-fe4a9c777189?w=1200', thumbnailUrl: 'https://images.unsplash.com/photo-1581244277943-fe4a9c777189?w=300', folder: 'gallery', altText: 'Water well', width: 1280, height: 854, createdAt: ago(2), updatedAt: ago(2) },
    { id: 'm8', fileName: 'logo-192.png', mimeType: 'image/png', size: 42_000, url: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=400', thumbnailUrl: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=300', folder: 'branding', altText: 'Logo mark', width: 512, height: 512, createdAt: ago(60), updatedAt: ago(60) },
  ]

  const folders: MediaFolder[] = [
    { id: 'fl1', name: 'banners', count: 1 },
    { id: 'fl2', name: 'team', count: 1 },
    { id: 'fl3', name: 'gallery', count: 2 },
    { id: 'fl4', name: 'documents', count: 2 },
    { id: 'fl5', name: 'reports', count: 1 },
    { id: 'fl6', name: 'branding', count: 1 },
  ]

  const forms: CmsForm[] = [
    {
      id: 'fm1',
      name: 'Contact Us',
      description: 'General enquiries from the website contact form.',
      fields: [
        { id: 'ff1', type: 'text', label: 'Full name', placeholder: 'Your name', required: true },
        { id: 'ff2', type: 'email', label: 'Email address', placeholder: 'you@example.com', required: true },
        { id: 'ff3', type: 'textarea', label: 'Message', placeholder: 'How can we help?', required: true },
      ],
      submissions: 128,
      status: 'ACTIVE',
      createdAt: ago(90),
      updatedAt: ago(1),
      entries: [
        { id: 'fe1', createdAt: ago(1), updatedAt: ago(1), data: { name: 'Amit Kumar', email: 'amit@example.com', message: 'Interested in volunteering for the education program.' } },
        { id: 'fe2', createdAt: ago(3), updatedAt: ago(3), data: { name: 'Sneha Patil', email: 'sneha@example.com', message: 'Can you share your annual report?' } },
      ],
    },
    {
      id: 'fm2',
      name: 'Volunteer Signup',
      description: 'Volunteer applications captured from the website.',
      fields: [
        { id: 'ff4', type: 'text', label: 'Full name', required: true },
        { id: 'ff5', type: 'email', label: 'Email', required: true },
        { id: 'ff6', type: 'phone', label: 'Phone', required: true },
        { id: 'ff7', type: 'select', label: 'Area of interest', options: ['Education', 'Water', 'Events', 'Fundraising'], required: true },
      ],
      submissions: 64,
      status: 'ACTIVE',
      createdAt: ago(70),
      updatedAt: ago(2),
      entries: [
        { id: 'fe3', createdAt: ago(2), updatedAt: ago(2), data: { name: 'Rohit Nair', email: 'rohit@example.com', phone: '9822001122', area: 'Education' } },
      ],
    },
    {
      id: 'fm3',
      name: 'Donation Interest',
      description: 'Draft donation enquiry form.',
      fields: [
        { id: 'ff8', type: 'text', label: 'Company name', required: true },
        { id: 'ff9', type: 'email', label: 'Work email', required: true },
      ],
      submissions: 0,
      status: 'DRAFT',
      createdAt: ago(6),
      updatedAt: ago(6),
      entries: [],
    },
  ]

  const activity: ActivityLog[] = [
    { id: 'a1', userId: 'u1', userName: 'Rahul Mehta', action: 'PUBLISH', resource: 'page', resourceId: 'p1', message: 'Published page "Homepage"', ipAddress: '103.66.12.1', device: 'Chrome / Windows', status: 'success', createdAt: ago(0.01), updatedAt: ago(0.01) },
    { id: 'a2', userName: 'Ananya Sharma', action: 'UPDATE', resource: 'blog', resourceId: 'b1', message: 'Updated blog "A Day at the Learning Center"', ipAddress: '103.66.12.1', device: 'Chrome / Windows', status: 'success', createdAt: ago(0.1), updatedAt: ago(0.1) },
    { id: 'a3', userName: 'Kavita Rao', action: 'CREATE', resource: 'event', resourceId: 'e3', message: 'Created event "Teachers Training Workshop"', ipAddress: '49.207.44.88', device: 'Safari / macOS', status: 'warning', createdAt: ago(0.4), updatedAt: ago(0.4) },
    { id: 'a4', userName: 'Rahul Mehta', action: 'DELETE', resource: 'testimonial', resourceId: 'ts3', message: 'Deleted a testimonial draft', ipAddress: '103.66.12.1', device: 'Chrome / Windows', status: 'danger', createdAt: ago(1.2), updatedAt: ago(1.2) },
    { id: 'a5', userName: 'Ananya Sharma', action: 'LOGIN', resource: 'auth', message: 'Signed in to Website CMS', ipAddress: '103.66.12.1', device: 'Chrome / Windows', status: 'success', createdAt: ago(2), updatedAt: ago(2) },
    { id: 'a6', userName: 'System', action: 'UPDATE', resource: 'settings', message: 'Updated website footer', ipAddress: null, device: 'System', status: 'success', createdAt: ago(3), updatedAt: ago(3) },
  ]

  const approvals: ApprovalRequest[] = [
    {
      id: 'ap1',
      type: 'publish',
      resource: 'page',
      title: 'Publish "Women Empowerment" program page',
      submittedBy: 'Kavita Rao',
      submittedAt: ago(0.3),
      status: 'PENDING',
      comment: 'Content has been reviewed internally, please publish.',
      createdAt: ago(0.3),
      updatedAt: ago(0.3),
      timeline: [
        { id: 'at1', actor: 'Kavita Rao', action: 'Submitted for review', note: 'Moved program page to pending.', at: ago(0.3) },
      ],
    },
    {
      id: 'ap2',
      type: 'publish',
      resource: 'blog',
      title: 'Publish blog "Volunteer Spotlight: Priya"',
      submittedBy: 'Ananya Sharma',
      submittedAt: ago(1.1),
      status: 'PENDING',
      createdAt: ago(1.1),
      updatedAt: ago(1.1),
      timeline: [
        { id: 'at2', actor: 'Ananya Sharma', action: 'Submitted for review', note: null, at: ago(1.1) },
      ],
    },
    {
      id: 'ap3',
      type: 'edit',
      resource: 'settings',
      title: 'Update website primary color to #5B4CF0',
      submittedBy: 'Kavita Rao',
      submittedAt: ago(2.4),
      status: 'APPROVED',
      reviewedBy: 'Rahul Mehta',
      reviewedAt: ago(1.8),
      comment: 'LGTM, applied.',
      createdAt: ago(2.4),
      updatedAt: ago(1.8),
      timeline: [
        { id: 'at3', actor: 'Kavita Rao', action: 'Submitted change', note: null, at: ago(2.4) },
        { id: 'at4', actor: 'Rahul Mehta', action: 'Approved', note: 'LGTM, applied.', at: ago(1.8) },
      ],
    },
  ]

  const notifications: Notification[] = [
    { id: 'n1', title: '2 approval requests awaiting review', body: 'Kavita submitted a page publish request.', type: 'warning', link: '/approvals', isRead: false, createdAt: ago(0.2) },
    { id: 'n2', title: 'Storage at 68%', body: 'You have used 1.7 GB of 2.5 GB.', type: 'info', link: '/media', isRead: false, createdAt: ago(1) },
    { id: 'n3', title: 'Blog published successfully', body: 'A Day at the Learning Center is live.', type: 'success', link: '/blogs', isRead: true, createdAt: ago(3) },
  ]

  const stats: DashboardStats = {
    visitors: 48210,
    visitorsChange: 12.4,
    pageViews: 124830,
    pageViewsChange: 8.2,
    publishedPages: 9,
    draftPages: 3,
    pendingApprovals: 2,
    formsSubmitted: 192,
    storageUsed: 1_750_000_000,
    storageLimit: 2_500_000_000,
    visitsSeries: [
      { label: 'Feb', visitors: 32000, pageViews: 88000 },
      { label: 'Mar', visitors: 36000, pageViews: 96000 },
      { label: 'Apr', visitors: 31000, pageViews: 84000 },
      { label: 'May', visitors: 38000, pageViews: 104000 },
      { label: 'Jun', visitors: 42000, pageViews: 112000 },
      { label: 'Jul', visitors: 45600, pageViews: 119000 },
      { label: 'Aug', visitors: 48210, pageViews: 124830 },
    ],
    publishedSeries: [
      { label: 'Pages', value: 9 },
      { label: 'Programs', value: 3 },
      { label: 'Events', value: 3 },
      { label: 'Blogs', value: 2 },
    ],
    trafficByDevice: [
      { name: 'Mobile', value: 54, color: '#4f46e5' },
      { name: 'Desktop', value: 33, color: '#8b5cf6' },
      { name: 'Tablet', value: 13, color: '#c7d2fe' },
    ],
    topPages: [
      { title: 'Homepage', views: 48600, change: 14 },
      { title: 'Programs', views: 21300, change: 9 },
      { title: 'Donate', views: 18400, change: -3 },
      { title: 'About Us', views: 12900, change: 6 },
      { title: 'Blog', views: 11200, change: 22 },
    ],
  }

  const settings: WebsiteSettings = {
    id: 'ws1',
    websiteName: 'Being Sevak',
    tagline: 'Serving with compassion, building with dignity',
    logoUrl: null,
    faviconUrl: null,
    primaryColor: '#4f46e5',
    footerText: '© 2025 Being Sevak Charitable Trust. All rights reserved.',
    socialLinks: { facebook: 'facebook.com/beingsevak', twitter: 'twitter.com/beingsevak', linkedin: 'linkedin.com/company/being-sevak', instagram: 'instagram.com/beingsevak', youtube: 'youtube.com/@beingsevak' },
    contact: { email: 'hello@beingsevak.org', phone: '+91 98200 00000', address: '12 Sevak Bhavan, MG Road', city: 'Pune', state: 'Maharashtra' },
    analytics: { gaId: 'G-XXXXXXXX', tagManagerId: 'GTM-XXXXXXX' },
    createdAt: ago(300),
    updatedAt: ago(2),
  }

  const seo: SeoMeta = {
    metaTitle: 'Being Sevak | Charitable Trust for Education & Water',
    metaDescription:
      'Being Sevak is a charitable trust working on education, clean water and women empowerment across Maharashtra. Join us.',
    keywords: ['ngo', 'charity', 'education', 'clean water', 'non profit india', 'donate'],
    ogImageUrl: 'https://images.unsplash.com/photo-1559028012-481c04fa702d?w=1200',
    canonicalUrl: 'https://beingsevak.org',
    robots: 'index, follow',
    schema: {
      '@context': 'https://schema.org',
      '@type': 'NGO',
      name: 'Being Sevak',
      url: 'https://beingsevak.org',
    },
  }

  const profile: ProfileUser = {
    id: 'u1',
    firstName: 'Rahul',
    lastName: 'Mehta',
    email: 'rahul@beingsevak.org',
    phone: '+91 98200 00000',
    role: 'admin',
    roleName: 'Website Administrator',
    avatarUrl: null,
    lastLoginAt: ago(0.01),
    createdAt: ago(400),
    twoFactorEnabled: true,
    sessions: [
      { id: 'sd1', device: 'Windows 11', browser: 'Chrome 128', ip: '103.66.12.1', location: 'Mumbai, IN', current: true, lastActive: ago(0.01) },
      { id: 'sd2', device: 'iPhone 15 Pro', browser: 'Safari', ip: '49.207.44.88', location: 'Pune, IN', current: false, lastActive: ago(2) },
    ],
  }

  return {
    pages: [
      {
        id: 'pg-home',
        slug: 'home',
        title: 'Homepage',
        metaTitle: 'Being Sevak — Home',
        metaDescription: 'Welcome to Being Sevak.',
        status: 'PUBLISHED',
        template: 'home',
        sortOrder: 0,
        isHome: true,
        author: 'Rahul Mehta',
        createdAt: ago(280),
        updatedAt: ago(0.2),
        sections: [
          { id: 'sec1', pageId: 'pg-home', type: 'hero', name: 'Hero', sortOrder: 1, isActive: true, createdAt: ago(280), updatedAt: ago(2), settings: { background: '#0f172a', overlay: 0.65, layout: 'center' }, content: { heading: 'Empowering communities, one life at a time', description: 'We work across education, clean water and livelihoods to create lasting change.', buttonLabel: 'Donate Now', buttonUrl: '/donate', image: 'https://images.unsplash.com/photo-1559028012-481c04fa702d?w=1600' } },
          { id: 'sec2', pageId: 'pg-home', type: 'about', name: 'About', sortOrder: 2, isActive: true, createdAt: ago(280), updatedAt: ago(2), settings: { columns: 2, background: '#ffffff' }, content: { heading: 'Who we are', description: 'A charitable trust registered in 2008, serving rural Maharashtra with transparency and heart.', image: null } },
          { id: 'sec3', pageId: 'pg-home', type: 'programs', name: 'Programs', sortOrder: 3, isActive: true, createdAt: ago(280), updatedAt: ago(2), settings: { layout: 'grid', maxItems: 6, background: '#f8fafc' }, content: { heading: 'Our Programs', description: 'Explore how we deliver impact.' } },
          { id: 'sec4', pageId: 'pg-home', type: 'gallery', name: 'Gallery', sortOrder: 4, isActive: true, createdAt: ago(280), updatedAt: ago(2), settings: { columns: 3, background: '#ffffff' }, content: { heading: 'Moments', description: null } },
          { id: 'sec5', pageId: 'pg-home', type: 'testimonials', name: 'Testimonials', sortOrder: 5, isActive: true, createdAt: ago(280), updatedAt: ago(2), settings: { autoplay: true, background: '#eef2ff' }, content: { heading: 'Voices of impact' } },
          { id: 'sec6', pageId: 'pg-home', type: 'partners', name: 'Partners', sortOrder: 6, isActive: true, createdAt: ago(280), updatedAt: ago(2), settings: { layout: 'logo-row', background: '#ffffff' }, content: { heading: 'Supported by' } },
          { id: 'sec7', pageId: 'pg-home', type: 'faq', name: 'FAQ', sortOrder: 7, isActive: true, createdAt: ago(280), updatedAt: ago(2), settings: { twoColumn: false, background: '#f8fafc' }, content: { heading: 'Frequently asked questions' } },
          { id: 'sec8', pageId: 'pg-home', type: 'footer', name: 'Footer', sortOrder: 8, isActive: true, createdAt: ago(280), updatedAt: ago(2), settings: { showNewsletter: true, background: '#0f172a' }, content: { heading: 'Stay in the loop', description: 'Subscribe for quarterly impact letters.' } },
        ],
      },
      {
        id: 'pg-about',
        slug: 'about',
        title: 'About Us',
        metaTitle: 'About — Being Sevak',
        metaDescription: 'Our mission, vision and history.',
        status: 'PUBLISHED',
        template: 'page',
        sortOrder: 1,
        isHome: false,
        author: 'Ananya Sharma',
        createdAt: ago(200),
        updatedAt: ago(4),
        sections: [],
      },
      {
        id: 'pg-programs',
        slug: 'programs',
        title: 'Programs',
        metaTitle: 'Programs — Being Sevak',
        metaDescription: null,
        status: 'PUBLISHED',
        template: 'page',
        sortOrder: 2,
        isHome: false,
        author: 'Kavita Rao',
        createdAt: ago(150),
        updatedAt: ago(6),
        sections: [],
      },
      {
        id: 'pg-events',
        slug: 'events',
        title: 'Events',
        metaTitle: 'Events — Being Sevak',
        metaDescription: null,
        status: 'PUBLISHED',
        template: 'page',
        sortOrder: 3,
        isHome: false,
        author: 'Ananya Sharma',
        createdAt: ago(120),
        updatedAt: ago(3),
        sections: [],
      },
      {
        id: 'pg-gallery',
        slug: 'gallery',
        title: 'Gallery',
        metaTitle: null,
        metaDescription: null,
        status: 'DRAFT',
        template: 'page',
        sortOrder: 4,
        isHome: false,
        author: 'Kavita Rao',
        createdAt: ago(30),
        updatedAt: ago(1),
        sections: [],
      },
      {
        id: 'pg-blog',
        slug: 'blog',
        title: 'Blog',
        metaTitle: null,
        metaDescription: null,
        status: 'PUBLISHED',
        template: 'blog',
        sortOrder: 5,
        isHome: false,
        author: 'Ananya Sharma',
        createdAt: ago(90),
        updatedAt: ago(5),
        sections: [],
      },
      {
        id: 'pg-archived',
        slug: 'donate-old',
        title: 'Donate (old)',
        metaTitle: null,
        metaDescription: null,
        status: 'ARCHIVED',
        template: 'page',
        sortOrder: 6,
        isHome: false,
        author: 'Vikram Singh',
        createdAt: ago(200),
        updatedAt: ago(40),
        sections: [],
      },
    ],
    menus: [
      {
        id: 'mn1',
        name: 'Main Navigation',
        location: 'main-nav',
        createdAt: ago(280),
        updatedAt: ago(2),
        items: [
          { id: 'mi1', label: 'Home', url: '/', sortOrder: 1, isActive: true, children: [] },
          { id: 'mi2', label: 'About Us', url: '/about', sortOrder: 2, isActive: true, children: [
            { id: 'mi21', label: 'Our Story', url: '/about/story', sortOrder: 1, isActive: true, children: [] },
            { id: 'mi22', label: 'Team', url: '/team', sortOrder: 2, isActive: true, children: [] },
          ]},
          { id: 'mi3', label: 'Programs', url: '/programs', sortOrder: 3, isActive: true, children: [
            { id: 'mi31', label: 'Education for All', url: '/programs/education-for-all', sortOrder: 1, isActive: true, children: [] },
            { id: 'mi32', label: 'Clean Water', url: '/programs/clean-water-initiative', sortOrder: 2, isActive: true, children: [] },
          ]},
          { id: 'mi4', label: 'Events', url: '/events', sortOrder: 4, isActive: true, children: [] },
          { id: 'mi5', label: 'Gallery', url: '/gallery', sortOrder: 5, isActive: true, children: [] },
          { id: 'mi6', label: 'Blog', url: '/blog', sortOrder: 6, isActive: true, children: [] },
          { id: 'mi7', label: 'Contact', url: '/contact', sortOrder: 7, isActive: true, children: [] },
        ],
      },
      {
        id: 'mn2',
        name: 'Footer Navigation',
        location: 'footer-nav',
        createdAt: ago(240),
        updatedAt: ago(8),
        items: [
          { id: 'mi8', label: 'Privacy Policy', url: '/privacy', sortOrder: 1, isActive: true, children: [] },
          { id: 'mi9', label: 'Terms', url: '/terms', sortOrder: 2, isActive: true, children: [] },
          { id: 'mi10', label: 'Refund Policy', url: '/refunds', sortOrder: 3, isActive: true, children: [] },
        ],
      },
    ],
    projects,
    events,
    blogs,
    blogCategories,
    galleries,
    team,
    testimonials,
    partners,
    faqs,
    media,
    folders,
    forms,
    seo: [seo],
    settings: [settings],
    activity,
    approvals,
    notifications,
    stats: [stats],
    profile: [profile],
  }
}
