// Seed script for Katiadi Government College.
// With DATABASE_URL set, creates tables (lib/db.ts DB_SCHEMA_SQL) and loads
// data/seed.json into Postgres. Without it, just prints the seed summary.
// Usage: npm run seed   (requires DATABASE_URL for DB mode)
const fs = require('fs'); const path = require('path');
const seed = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'data', 'seed.json'), 'utf8'));
console.log(`Katiadi College seed: ${seed.notices.length} notices, ${seed.news_events.length} news/events, ${seed.departments.length} departments, ${seed.teachers.length} teachers, ${seed.routines.length} routines, ${seed.results.length} results.`);
console.log('All seed rows are labelled SAMPLE / PLACEHOLDER — verify with the college office before publishing real data.');
if (!process.env.DATABASE_URL) { console.log('DATABASE_URL not set — JSON seed fallback is active; nothing to load into Postgres. Set DATABASE_URL and re-run to seed the database.'); process.exit(0); }
(async () => {
  const { Client } = require('pg'); const bcrypt = require('bcryptjs');
  const schema = fs.readFileSync(path.join(__dirname, '..', 'lib', 'db.ts'), 'utf8').match(/DB_SCHEMA_SQL = `([\s\S]*?)`/)?.[1];
  const client = new Client({ connectionString: process.env.DATABASE_URL, ssl: /neon\.tech|sslmode=require/i.test(process.env.DATABASE_URL) ? { rejectUnauthorized: false } : undefined });
  await client.connect(); await client.query(schema);
  const cols = {
    notices: ['id','title','title_bn','body','body_bn','date','category','is_sample'],
    news_events: ['id','title','title_bn','slug','excerpt','content','image','date','category','is_sample'],
    teachers: ['id','name','name_bn','designation','department','email','phone','photo','bio','is_sample'],
    departments: ['id','name','name_bn','slug','description','head','is_sample'],
    programs: ['id','name','name_bn','level','duration','department','description','is_sample'],
    students: ['id','student_id','name','name_bn','class_name','section','roll','department','session_year','email','phone'],
    admissions: ['id','applicant_name','email','phone','program','class_name','ssc_roll','ssc_gpa','status'],
    routines: ['id','title','class_name','type','day','subject','time','room','teacher','is_sample'],
    results: ['id','student_id','exam_name','subject','grade','gpa','year','published','is_sample'],
    gallery: ['id','title','title_bn','image','category','is_sample'],
    documents: ['id','title','file_url','category'],
    contacts: ['id','name','email','subject','message','read'],
  };
  for (const [table, columns] of Object.entries(cols)) {
    for (const row of seed[table] || []) {
      const vals = columns.map(c => row[c] ?? null);
      await client.query(`INSERT INTO ${table} (${columns.join(',')}) VALUES (${columns.map((_, i) => '$' + (i + 1)).join(',')}) ON CONFLICT (id) DO NOTHING`, vals);
    }
  }
  const demoHash = await bcrypt.hash('demo123', 10);
  for (const u of seed.users || []) {
    await client.query('INSERT INTO users (id,name,email,role,student_id,password_hash) VALUES ($1,$2,$3,$4,$5,$6) ON CONFLICT (id) DO NOTHING',
      [u.id, u.name, u.email, u.role, u.student_id || null, u.student_id === 'DEMO-001' ? demoHash : null]);
  }
  await client.query('INSERT INTO settings (key,value) VALUES ($1,$2) ON CONFLICT (key) DO NOTHING', ['site', JSON.stringify(seed.settings)]);
  console.log('Seeded PostgreSQL successfully.'); await client.end();
})().catch(e => { console.error('Seed failed:', e.message); process.exit(1); });
