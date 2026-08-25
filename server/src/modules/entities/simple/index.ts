import { z } from 'zod';
import { makeCrud } from '../factory';

const slugPattern = /^[a-z0-9][a-z0-9-_]*$/;
const optionalString = z.string().max(1000).optional().nullable();
const requiredString = (max: number) => z.string().min(1).max(max);

const bool = z.boolean().optional();
const order = z.coerce.number().int().min(0).optional();
export { slugPattern };

export const teamCrud = makeCrud({
  resource: 'team',
  model: 'teamMember',
  permissionBase: 'team',
  searchFields: ['name', 'role'],
  createSchema: z.object({
    name: requiredString(200),
    role: optionalString,
    photoUrl: z.string().max(1000).optional().nullable(),
    bio: z.string().max(2000).optional().nullable(),
    socials: z.object({
      linkedin: z.string().max(500).optional().nullable(),
      instagram: z.string().max(500).optional().nullable(),
      facebook: z.string().max(500).optional().nullable(),
      twitter: z.string().max(500).optional().nullable(),
    }).optional().nullable(),
    sortOrder: order,
    isActive: bool,
  }).strict(),
  updateSchema: z.object({
    name: requiredString(200).optional(),
    role: optionalString,
    photoUrl: z.string().max(1000).optional().nullable(),
    bio: z.string().max(2000).optional().nullable(),
    socials: z.object({
      linkedin: z.string().max(500).optional().nullable(),
      instagram: z.string().max(500).optional().nullable(),
      facebook: z.string().max(500).optional().nullable(),
      twitter: z.string().max(500).optional().nullable(),
    }).optional().nullable(),
    sortOrder: order,
    isActive: bool,
  }).strict().refine((d) => Object.keys(d).length > 0, { message: 'At least one field required' }),
});

export const testimonialCrud = makeCrud({
  resource: 'testimonial',
  model: 'testimonial',
  permissionBase: 'testimonial',
  searchFields: ['name', 'quote', 'personType', 'location'],
  createSchema: z.object({
    quote: requiredString(3000),
    name: requiredString(200),
    role: optionalString,
    avatarUrl: z.string().max(1000).optional().nullable(),
    color: z.string().max(30).optional().nullable(),
    rating: z.number().int().min(1).max(5).optional().nullable(),
    personType: z.string().max(100).optional().nullable(),
    location: z.string().max(200).optional().nullable(),
    programId: z.string().uuid().optional().nullable(),
    sortOrder: order,
    isActive: bool,
  }).strict(),
  updateSchema: z.object({
    quote: requiredString(3000).optional(),
    name: requiredString(200).optional(),
    role: optionalString,
    avatarUrl: z.string().max(1000).optional().nullable(),
    color: z.string().max(30).optional().nullable(),
    rating: z.number().int().min(1).max(5).optional().nullable(),
    personType: z.string().max(100).optional().nullable(),
    location: z.string().max(200).optional().nullable(),
    programId: z.string().uuid().optional().nullable(),
    sortOrder: order,
    isActive: bool,
  }).strict().refine((d) => Object.keys(d).length > 0, { message: 'At least one field required' }),
});

export const partnerCrud = makeCrud({
  resource: 'partner',
  model: 'partner',
  permissionBase: 'partner',
  searchFields: ['name'],
  createSchema: z.object({
    name: requiredString(200),
    website: z.string().max(500).optional().nullable(),
    logoUrl: z.string().max(1000).optional().nullable(),
    description: optionalString,
    sortOrder: order,
    isActive: bool,
  }).strict(),
  updateSchema: z.object({
    name: requiredString(200).optional(),
    website: z.string().max(500).optional().nullable(),
    logoUrl: z.string().max(1000).optional().nullable(),
    description: optionalString,
    sortOrder: order,
    isActive: bool,
  }).strict().refine((d) => Object.keys(d).length > 0, { message: 'At least one field required' }),
});

export const faqCrud = makeCrud({
  resource: 'faq',
  model: 'faq',
  permissionBase: 'faq',
  searchFields: ['question', 'answer'],
  createSchema: z.object({
    question: requiredString(500),
    answer: requiredString(5000),
    category: optionalString,
    sortOrder: order,
    isActive: bool,
  }).strict(),
  updateSchema: z.object({
    question: requiredString(500).optional(),
    answer: requiredString(5000).optional(),
    category: optionalString,
    sortOrder: order,
    isActive: bool,
  }).strict().refine((d) => Object.keys(d).length > 0, { message: 'At least one field required' }),
});

export const awardCrud = makeCrud({
  resource: 'award',
  model: 'award',
  permissionBase: 'testimonial',
  searchFields: ['title'],
  createSchema: z.object({
    title: requiredString(300),
    year: z.string().max(20).optional().nullable(),
    description: optionalString,
    imageUrl: z.string().max(1000).optional().nullable(),
    sortOrder: order,
    isActive: bool,
  }).strict(),
  updateSchema: z.object({
    title: requiredString(300).optional(),
    year: z.string().max(20).optional().nullable(),
    description: optionalString,
    imageUrl: z.string().max(1000).optional().nullable(),
    sortOrder: order,
    isActive: bool,
  }).strict().refine((d) => Object.keys(d).length > 0, { message: 'At least one field required' }),
});

export const locationCrud = makeCrud({
  resource: 'location',
  model: 'location',
  permissionBase: 'page',
  searchFields: ['name', 'city', 'state'],
  createSchema: z.object({
    name: requiredString(200),
    address: optionalString,
    city: z.string().max(200).optional().nullable(),
    state: z.string().max(200).optional().nullable(),
    country: z.string().max(200).optional().nullable(),
    phone: z.string().max(30).optional().nullable(),
    email: z.string().email().max(254).optional().nullable(),
    mapUrl: z.string().max(1000).optional().nullable(),
    isMain: z.boolean().optional(),
    isActive: bool,
    sortOrder: order,
  }).strict(),
  updateSchema: z.object({
    name: requiredString(200).optional(),
    address: optionalString,
    city: z.string().max(200).optional().nullable(),
    state: z.string().max(200).optional().nullable(),
    country: z.string().max(200).optional().nullable(),
    phone: z.string().max(30).optional().nullable(),
    email: z.string().email().max(254).optional().nullable(),
    mapUrl: z.string().max(1000).optional().nullable(),
    isMain: z.boolean().optional(),
    isActive: bool,
    sortOrder: order,
  }).strict().refine((d) => Object.keys(d).length > 0, { message: 'At least one field required' }),
});

export const donorCrud = makeCrud({
  resource: 'donor',
  model: 'donor',
  permissionBase: 'donor',
  searchFields: ['name', 'email', 'phone'],
  createSchema: z.object({
    email: z.string().email().max(254).optional().nullable(),
    name: z.string().max(300).optional().nullable(),
    phone: z.string().max(30).optional().nullable(),
    address: optionalString,
    panNumber: z.string().max(30).optional().nullable(),
    isActive: bool,
  }).strict(),
  updateSchema: z.object({
    email: z.string().email().max(254).optional().nullable(),
    name: z.string().max(300).optional().nullable(),
    phone: z.string().max(30).optional().nullable(),
    address: optionalString,
    panNumber: z.string().max(30).optional().nullable(),
    isActive: bool,
  }).strict().refine((d) => Object.keys(d).length > 0, { message: 'At least one field required' }),
});

export const volunteerCrud = makeCrud({
  resource: 'volunteer',
  model: 'volunteer',
  permissionBase: 'volunteer',
  searchFields: ['firstName', 'lastName', 'email', 'phone'],
  createSchema: z.object({
    firstName: requiredString(200),
    lastName: z.string().max(200).optional().nullable(),
    email: z.string().email().max(254).optional().nullable(),
    phone: z.string().max(30).optional().nullable(),
    city: z.string().max(200).optional().nullable(),
    skills: optionalString,
    availability: optionalString,
    status: z.string().max(60).optional(),
  }).strict(),
  updateSchema: z.object({
    firstName: requiredString(200).optional(),
    lastName: z.string().max(200).optional().nullable(),
    email: z.string().email().max(254).optional().nullable(),
    phone: z.string().max(30).optional().nullable(),
    city: z.string().max(200).optional().nullable(),
    skills: optionalString,
    availability: optionalString,
    status: z.string().max(60).optional(),
  }).strict().refine((d) => Object.keys(d).length > 0, { message: 'At least one field required' }),
});

export const beneficiaryCrud = makeCrud({
  resource: 'beneficiary',
  model: 'beneficiary',
  permissionBase: 'beneficiary',
  searchFields: ['firstName', 'lastName', 'email', 'phone'],
  extraFilters: { projectId: 'projectId' },
  createSchema: z.object({
    firstName: requiredString(200),
    lastName: z.string().max(200).optional().nullable(),
    email: z.string().email().max(254).optional().nullable(),
    phone: z.string().max(30).optional().nullable(),
    address: optionalString,
    notes: optionalString,
    status: z.string().max(60).optional(),
    projectId: z.string().uuid().optional().nullable(),
  }).strict(),
  updateSchema: z.object({
    firstName: requiredString(200).optional(),
    lastName: z.string().max(200).optional().nullable(),
    email: z.string().email().max(254).optional().nullable(),
    phone: z.string().max(30).optional().nullable(),
    address: optionalString,
    notes: optionalString,
    status: z.string().max(60).optional(),
    projectId: z.string().uuid().optional().nullable(),
  }).strict().refine((d) => Object.keys(d).length > 0, { message: 'At least one field required' }),
});

export const departmentCrud = makeCrud({
  resource: 'department',
  model: 'department',
  permissionBase: 'department',
  searchFields: ['name'],
  createSchema: z.object({
    name: requiredString(200),
    description: optionalString,
    managerId: z.string().uuid().optional().nullable(),
  }).strict(),
  updateSchema: z.object({
    name: requiredString(200).optional(),
    description: optionalString,
    managerId: z.string().uuid().optional().nullable(),
  }).strict().refine((d) => Object.keys(d).length > 0, { message: 'At least one field required' }),
});

export const accountCrud = makeCrud({
  resource: 'account',
  model: 'account',
  permissionBase: 'account',
  searchFields: ['name', 'bankName'],
  createSchema: z.object({
    name: requiredString(200),
    type: z.string().max(60).optional(),
    number: z.string().max(100).optional().nullable(),
    ifsc: z.string().max(50).optional().nullable(),
    bankName: z.string().max(200).optional().nullable(),
    branch: z.string().max(200).optional().nullable(),
    isActive: bool,
  }).strict(),
  updateSchema: z.object({
    name: requiredString(200).optional(),
    type: z.string().max(60).optional(),
    number: z.string().max(100).optional().nullable(),
    ifsc: z.string().max(50).optional().nullable(),
    bankName: z.string().max(200).optional().nullable(),
    branch: z.string().max(200).optional().nullable(),
    isActive: bool,
  }).strict().refine((d) => Object.keys(d).length > 0, { message: 'At least one field required' }),
});

export const transactionCrud = makeCrud({
  resource: 'transaction',
  model: 'transaction',
  permissionBase: 'transaction',
  searchFields: ['description', 'reference'],
  extraFilters: { accountId: 'accountId', type: 'type' },
  createSchema: z.object({
    accountId: z.string().uuid().optional().nullable(),
    type: z.enum(['INCOME', 'EXPENSE', 'TRANSFER']),
    amount: z.coerce.number().positive().multipleOf(0.01),
    description: optionalString,
    category: optionalString,
    transactionDate: z.string().datetime().optional(),
    reference: optionalString,
  }).strict(),
  updateSchema: z.object({
    accountId: z.string().uuid().optional().nullable(),
    type: z.enum(['INCOME', 'EXPENSE', 'TRANSFER']).optional(),
    amount: z.coerce.number().positive().multipleOf(0.01).optional(),
    description: optionalString,
    category: optionalString,
    transactionDate: z.string().datetime().optional(),
    reference: optionalString,
  }).strict().refine((d) => Object.keys(d).length > 0, { message: 'At least one field required' }),
});

export const employeeCrud = makeCrud({
  resource: 'employee',
  model: 'employee',
  permissionBase: 'employee',
  searchFields: ['firstName', 'lastName', 'email', 'designation'],
  extraFilters: { departmentId: 'departmentId' },
  createSchema: z.object({
    userId: z.string().uuid().optional().nullable(),
    departmentId: z.string().uuid().optional().nullable(),
    designation: optionalString,
    firstName: requiredString(200),
    lastName: z.string().max(200).optional().nullable(),
    email: z.string().email().max(254).optional().nullable(),
    phone: z.string().max(30).optional().nullable(),
    joinedAt: z.string().datetime().optional().nullable(),
    isActive: bool,
  }).strict(),
  updateSchema: z.object({
    userId: z.string().uuid().optional().nullable(),
    departmentId: z.string().uuid().optional().nullable(),
    designation: optionalString,
    firstName: requiredString(200).optional(),
    lastName: z.string().max(200).optional().nullable(),
    email: z.string().email().max(254).optional().nullable(),
    phone: z.string().max(30).optional().nullable(),
    joinedAt: z.string().datetime().optional().nullable(),
    isActive: bool,
  }).strict().refine((d) => Object.keys(d).length > 0, { message: 'At least one field required' }),
});
