/**
 * API client for repo-backed issue storage
 * In dev mode, this calls the Vite dev server API
 * In production, file writing is not supported
 */

import { MagazineIssueFile, MagazineIssueMeta, IssuesIndex } from '@/types/issue';

const API_BASE = '/__api';

interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}

/**
 * Check if we're in a dev environment that supports file writing
 */
export async function checkDevEnvironment(): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE}/health`);
    return response.ok;
  } catch {
    return false;
  }
}

/**
 * Load the issues index
 */
export async function loadIssuesIndex(): Promise<IssuesIndex> {
  try {
    // First try the API (dev mode)
    const apiResponse = await fetch(`${API_BASE}/issues`);
    if (apiResponse.ok) {
      const result: ApiResponse<IssuesIndex> = await apiResponse.json();
      if (result.success && result.data) {
        return result.data;
      }
    }
  } catch {
    // API not available, fall back to static file
  }
  
  // Fall back to static file fetch
  try {
    const response = await fetch('/data/issues/index.json');
    if (response.ok) {
      return await response.json();
    }
  } catch {
    // File doesn't exist
  }
  
  return { issues: [] };
}

/**
 * Load a specific issue by slug
 */
export async function loadIssue(slug: string): Promise<MagazineIssueFile | null> {
  try {
    // First try the API (dev mode)
    const apiResponse = await fetch(`${API_BASE}/issues/${slug}`);
    if (apiResponse.ok) {
      const result: ApiResponse<MagazineIssueFile> = await apiResponse.json();
      if (result.success && result.data) {
        return result.data;
      }
    }
  } catch {
    // API not available, fall back to static file
  }
  
  // Fall back to static file fetch
  try {
    const response = await fetch(`/data/issues/${slug}.json`);
    if (response.ok) {
      return await response.json();
    }
  } catch {
    // File doesn't exist
  }
  
  return null;
}

/**
 * Save an issue (creates or updates)
 * Returns success status and any error message
 */
export async function saveIssue(issue: MagazineIssueFile): Promise<{ success: boolean; error?: string }> {
  try {
    const response = await fetch(`${API_BASE}/issues/${issue.meta.slug}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(issue),
    });
    
    const result: ApiResponse = await response.json();
    
    if (result.success) {
      return { success: true };
    }
    
    return { success: false, error: result.error || 'Unknown error' };
  } catch (error) {
    return { 
      success: false, 
      error: 'Repo-backed saving is only available in the dev environment. Use Export JSON instead.' 
    };
  }
}

/**
 * Update the issues index
 */
export async function updateIssuesIndex(index: IssuesIndex): Promise<{ success: boolean; error?: string }> {
  try {
    const response = await fetch(`${API_BASE}/issues`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(index),
    });
    
    const result: ApiResponse = await response.json();
    
    if (result.success) {
      return { success: true };
    }
    
    return { success: false, error: result.error || 'Unknown error' };
  } catch (error) {
    return { 
      success: false, 
      error: 'Repo-backed saving is only available in the dev environment.' 
    };
  }
}

/**
 * Delete an issue
 */
export async function deleteIssue(slug: string): Promise<{ success: boolean; error?: string }> {
  try {
    const response = await fetch(`${API_BASE}/issues/${slug}`, {
      method: 'DELETE',
    });
    
    const result: ApiResponse = await response.json();
    
    if (result.success) {
      return { success: true };
    }
    
    return { success: false, error: result.error || 'Unknown error' };
  } catch (error) {
    return { 
      success: false, 
      error: 'Repo-backed deletion is only available in the dev environment.' 
    };
  }
}

/**
 * Load the demo template
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
