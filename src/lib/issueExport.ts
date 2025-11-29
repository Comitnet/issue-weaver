/**
 * Export utilities for issue JSON
 * 
 * IMPORTANT: In Lovable's cloud sandbox, the browser CANNOT write to the Git repository.
 * The only way to persist changes to data/issues/*.json is:
 * 1. Export the issue JSON (copy to clipboard or download)
 * 2. Paste the JSON to the AI in chat
 * 3. The AI writes the file using Lovable's file tools
 */

import { MagazineIssueFile } from '@/types/issue';

/**
 * Serialize an issue to JSON string for export.
 * The format matches exactly what's stored in data/issues/<slug>.json files.
 */
export function serializeIssueForExport(issue: MagazineIssueFile): string {
  // Update the timestamp to now
  const exportIssue: MagazineIssueFile = {
    ...issue,
    meta: {
      ...issue.meta,
      updatedAt: new Date().toISOString(),
      // Sync title from magazine to meta
      title: issue.magazine.title,
    },
  };
  
  return JSON.stringify(exportIssue, null, 2);
}

/**
 * Copy issue JSON to clipboard
 */
export async function copyIssueToClipboard(issue: MagazineIssueFile): Promise<boolean> {
  try {
    const json = serializeIssueForExport(issue);
    await navigator.clipboard.writeText(json);
    return true;
  } catch (error) {
    console.error('Failed to copy to clipboard:', error);
    return false;
  }
}

/**
 * Download issue as a JSON file
 */
export function downloadIssueAsJson(issue: MagazineIssueFile): void {
  const json = serializeIssueForExport(issue);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  
  const a = document.createElement('a');
  a.href = url;
  a.download = `${issue.meta.slug}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  
  URL.revokeObjectURL(url);
}
