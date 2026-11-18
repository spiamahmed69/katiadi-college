// Katiadi Government College — shared types. Every record is a plain
// object with an `id` (TEXT PK in Postgres). `isSample` marks placeholder /
// sample rows that the college office has not yet confirmed.
export type Row = Record<string, any>;
export interface SiteSettings {
  siteName: string; siteNameBn: string; tagline: string; description: string;
  logoText: string; contactEmail: string; contactPhone: string; address: string;
  facebook: string; youtube: string; eiin: string; established: string;
  principalName: string; seoTitle: string; seoDescription: string;
}
export interface ContactMessage { id: string; name: string; email: string; subject?: string; message: string; createdAt: string; read: boolean; }
export interface SeedData {
  settings: SiteSettings;
  notices: Row[]; news_events: Row[]; teachers: Row[]; departments: Row[];
  programs: Row[]; students: Row[]; admissions: Row[]; routines: Row[];
  results: Row[]; gallery: Row[]; documents: Row[];
  users: { id: string; name: string; email: string; role: string; student_id?: string; createdAt: string }[];
  contacts: ContactMessage[];
}
