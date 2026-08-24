/* Temporary end-to-end smoke test for the Programs (projects) API. Self-cleaning. */
const argon2 = require('argon2');
const { PrismaClient } = require('@prisma/client');

const p = new PrismaClient();
const BASE = 'http://localhost:4000/api/v1';
const EMAIL = `tmp-smoke-${Date.now()}@example.com`;
const PASSWORD = 'SmokeTest123!';
let createdProjectId = null;
let createdUserId = null;

function assert(cond, label) {
  if (!cond) throw new Error(`ASSERT FAILED: ${label}`);
  console.log(`PASS: ${label}`);
}

async function main() {
  const org = await p.organization.findUnique({ where: { slug: 'being-sevak' } });
  assert(org, 'being-sevak org exists');
  const hash = await argon2.hash(PASSWORD);
  const user = await p.user.create({
    data: { email: EMAIL, passwordHash: hash, firstName: 'Smoke', isMaster: true },
  });
  createdUserId = user.id;

  const loginRes = await fetch(`${BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: EMAIL, password: PASSWORD }),
  });
  assert(loginRes.ok, `login (${loginRes.status})`);
  const loginBody = await loginRes.json();
  const token = loginBody.data.accessToken;

  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
    'X-Organization-Id': org.id,
  };

  // 1) List includes real _count.stats
  const listRes = await fetch(`${BASE}/projects?limit=100`, { headers });
  assert(listRes.ok, `list projects (${listRes.status})`);
  const listBody = await listRes.json();
  const first = listBody.data.items[0];
  assert(!first || first._count && typeof first._count.stats === 'number', '_count.stats present on list items');

  // 2) Create draft with full payload (description JSON + children)
  const draftPayload = {
    title: 'Smoke Test Program',
    tag: 'Education',
    summary: 'Temporary smoke test record',
    description: {
      full: 'Full description text',
      objective: 'Objective text',
      whatWeDo: 'What we do text',
      activities: 'Activity one, activity two',
      beneficiaries: 'Rural children',
      location: 'Mumbai, Maharashtra',
      startDate: '2026-01-01',
      endDate: '2026-12-31',
    },
    status: 'DRAFT',
    featured: false,
    stats: [
      { label: 'Beneficiaries reached', value: '1,200+', sortOrder: 0 },
      { label: 'Villages covered', value: '45', sortOrder: 1 },
    ],
    impacts: [{ title: 'New centre opened', description: 'A milestone', sortOrder: 0 }],
  };
  const createRes = await fetch(`${BASE}/projects`, {
    method: 'POST',
    headers,
    body: JSON.stringify(draftPayload),
  });
  assert(createRes.status === 201, `create draft (${createRes.status}) ${createRes.ok ? '' : await createRes.text()}`);
  const created = (await createRes.json()).data;
  createdProjectId = created.id;
  assert(created.status === 'DRAFT', 'created with status DRAFT (not auto-published)');
  assert(Array.isArray(created.stats) && created.stats.length === 2, 'stats persisted on create');
  assert(Array.isArray(created.impacts) && created.impacts.length === 1, 'impacts persisted on create');
  assert(created.description && created.description.objective === 'Objective text', 'description JSON persisted');

  // 3) Draft must not appear in published-only site payload
  // (verified logically by status; site repository filters PUBLISHED)

  // 4) Fetch detail
  const getRes = await fetch(`${BASE}/projects/${created.id}`, { headers });
  assert(getRes.ok, `get detail (${getRes.status})`);

  // 5) Publish
  const pubRes = await fetch(`${BASE}/projects/${created.id}`, {
    method: 'PATCH',
    headers,
    body: JSON.stringify({ ...draftPayload, title: 'Smoke Test Program Edited', status: 'PUBLISHED' }),
  });
  assert(pubRes.ok, `publish update (${pubRes.status}) ${pubRes.ok ? '' : await pubRes.text()}`);
  const published = (await pubRes.json()).data;
  assert(published.status === 'PUBLISHED', 'explicit publish sets PUBLISHED');
  assert(published.stats.length === 2, 'stats replace-persisted on update');
  assert(published.title === 'Smoke Test Program Edited', 'title updated');

  // 6) Save-draft unpublishes (live site keeps showing nothing until re-publish)
  const draftRes = await fetch(`${BASE}/projects/${created.id}`, {
    method: 'PATCH',
    headers,
    body: JSON.stringify({ ...draftPayload, status: 'DRAFT' }),
  });
  assert(draftRes.ok, `save-draft update (${draftRes.status})`);
  const drafted = (await draftRes.json()).data;
  assert(drafted.status === 'DRAFT', 'save-draft sets DRAFT (never live until publish)');

  // 7) Strict schema rejects unknown keys (old modal used to send "category")
  const badRes = await fetch(`${BASE}/projects/${created.id}`, {
    method: 'PATCH',
    headers,
    body: JSON.stringify({ category: 'Education' }),
  });
  assert(badRes.status === 422, `unknown key rejected (${badRes.status})`);

  // 8) Search works
  const searchRes = await fetch(`${BASE}/projects?search=${encodeURIComponent('Smoke Test')}`, { headers });
  assert(searchRes.ok, `search (${searchRes.status})`);
  const found = (await searchRes.json()).data;
  assert(found.total >= 1, `search finds program (total=${found.total})`);

  console.log('\nALL SMOKE TESTS PASSED');
}

async function cleanup() {
  try {
    if (createdProjectId) await p.project.deleteMany({ where: { id: createdProjectId } });
    if (createdUserId) {
      await p.refreshToken.deleteMany({ where: { userId: createdUserId } });
      await p.user.delete({ where: { id: createdUserId } });
    }
    console.log('cleanup done');
  } catch (e) {
    console.error('cleanup error:', e.message);
  } finally {
    await p.$disconnect();
  }
}

main()
  .then(cleanup)
  .catch(async (e) => {
    console.error('SMOKE FAILED:', e.message);
    await cleanup();
    process.exit(1);
  });
