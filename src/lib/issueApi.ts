/**
 * API client for issue storage
 * 
 * IMPORTANT: LOVABLE SANDBOX LIMITATIONS
 * ======================================
 * In Lovable's cloud sandbox, the browser CANNOT write to the Git repository.
 * 
 * - READ functions (loadIssuesIndex, loadIssue, loadDemoTemplate) WORK
 *   They fetch static JSON files from /data/issues/*.json
 * 
 * - WRITE functions (saveIssue, updateIssuesIndex, deleteIssue) DO NOT PERSIST
 *   They were designed for a local dev environment with a Vite plugin.
 *   In Lovable, these calls go nowhere useful.
 * 
 * To persist changes in Lovable:
 * 1. Use "Export for Git" in the UI to copy issue JSON
 * 2. Paste the JSON in the AI chat
 * 3. AI writes to data/issues/<slug>.json using Lovable file tools
 */

import { MagazineIssueFile, IssuesIndex } from '@/types/issue';

/**
 * Load the issues index from the repo
 * Fetches /data/issues/index.json
 */
export async function loadIssuesIndex(): Promise<IssuesIndex> {
  try {
    const response = await fetch('/data/issues/index.json');
    if (response.ok) {
      return await response.json();
    }
  } catch {
    // File doesn't exist or fetch failed
  }
  
  return { issues: [] };
}

/**
 * Load a specific issue by slug from the repo
 * Fetches /data/issues/<slug>.json
 */
export async function loadIssue(slug: string): Promise<MagazineIssueFile | null> {
  try {
    const response = await fetch(`/data/issues/${slug}.json`);
    if (response.ok) {
      return await response.json();
    }
  } catch {
    // File doesn't exist or fetch failed
  }
  
  return null;
}

/**
 * Load the demo template
 * Fetches /data/demo.json
 */
export async function loadDemoTemplate(): Promise<MagazineIssueFile | null> {
  try {
    const response = await fetch('/data/demo.json');
    if (response.ok) {
      const magazine = await response.json();
      // Wrap in issue file structure
      return {
        meta: {
          id: magazine.id || crypto.randomUUID(),
          title: magazine.title || 'Demo Issue',
          slug: 'demo-template',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        magazine,
      };
    }
  } catch {
    // Demo not available
  }
  return null;
}

// ============================================================================
// DEPRECATED: Write functions that don't work in Lovable
// These are kept for reference but should not be used.
// Use "Export for Git" workflow instead.
// ============================================================================

/**
 * @deprecated Does not persist in Lovable. Use "Export for Git" instead.
 */
export async function saveIssue(_issue: MagazineIssueFile): Promise<{ success: boolean; error?: string }> {
  return { 
    success: false, 
    error: 'Repo-backed saving is not available in Lovable. Use "Export for Git" to copy JSON, then paste it in the AI chat.' 
  };
}

/**
 * @deprecated Does not persist in Lovable. Use "Export for Git" instead.
 */
export async function updateIssuesIndex(_index: IssuesIndex): Promise<{ success: boolean; error?: string }> {
  return { 
    success: false, 
    error: 'Repo-backed saving is not available in Lovable. Use "Export for Git" to copy JSON, then paste it in the AI chat.' 
  };
}

/**
 * @deprecated Does not persist in Lovable.
 */
export async function deleteIssue(_slug: string): Promise<{ success: boolean; error?: string }> {
  return { 
    success: false, 
    error: 'Repo-backed deletion is not available in Lovable. Ask the AI to delete the file instead.' 
  };
}

/**
 * @deprecated No longer used. Always returns false in Lovable.
 */
export async function checkDevEnvironment(): Promise<boolean> {
  return false;
}
