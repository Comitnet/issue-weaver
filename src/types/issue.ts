/**
 * Issue metadata and file structure types for repo-backed multi-issue model
 */

import { Magazine } from './magazine';

/**
 * Metadata for a magazine issue (stored in index.json)
 */
export interface MagazineIssueMeta {
  id: string;           // stable UUID
  title: string;        // display title
  slug: string;         // kebab-case, used in file names and URLs
  createdAt: string;    // ISO timestamp
  updatedAt: string;    // ISO timestamp
}

/**
 * Full issue file structure (stored in data/issues/<slug>.json)
 */
export interface MagazineIssueFile {
  meta: MagazineIssueMeta;
  magazine: Magazine;
}

/**
 * Index file structure (stored in data/issues/index.json)
 */
export interface IssuesIndex {
  issues: MagazineIssueMeta[];
  lastOpenedId?: string;
}

/**
 * Generate a kebab-case slug from a title
 */
export function generateSlug(title: string, existingSlugs: string[] = []): string {
  let baseSlug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .substring(0, 50) || 'untitled';
  
  let slug = baseSlug;
  let counter = 1;
  
  while (existingSlugs.includes(slug)) {
    slug = `${baseSlug}-${counter}`;
    counter++;
  }
  
  return slug;
}

/**
 * Create issue metadata
 */
export function createIssueMeta(title: string, existingSlugs: string[] = []): MagazineIssueMeta {
  const now = new Date().toISOString();
  return {
    id: crypto.randomUUID(),
    title,
    slug: generateSlug(title, existingSlugs),
    createdAt: now,
    updatedAt: now,
  };
}
