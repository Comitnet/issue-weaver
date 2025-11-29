/**
 * Utility functions for generating share URLs and embed code for magazines
 */

export interface IssueShareData {
  publicUrl: string;
  embedUrl: string;
  iframeSnippet: string;
}

/**
 * Get the base URL for the application
 * Uses environment variable if available, otherwise falls back to window.location.origin
 */
const getBaseUrl = (): string => {
  // Check for environment variable first
  if (typeof import.meta !== 'undefined' && import.meta.env?.VITE_BASE_URL) {
    return import.meta.env.VITE_BASE_URL;
  }
  // Fallback to current origin
  if (typeof window !== 'undefined') {
    return window.location.origin;
  }
  return 'http://localhost:5173';
};

/**
 * Generate share data for a magazine issue
 * @param issueId - The unique ID of the magazine issue
 * @returns Object containing publicUrl, embedUrl, and iframeSnippet
 */
export const getIssueShareData = (issueId: string): IssueShareData => {
  const baseUrl = getBaseUrl();
  
  // Public reader URL
  const publicUrl = `${baseUrl}/reader/${issueId}`;
  
  // Embed URL with embed=1 query parameter
  const embedUrl = `${publicUrl}?embed=1`;
  
  // A4 aspect ratio is 1:√2 ≈ 1:1.414
  // padding-bottom percentage = (height/width) * 100 = 141.4%
  const iframeSnippet = `<div style="position: relative; width: 100%; padding-bottom: 141.4%; overflow: hidden; border-radius: 8px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
  <iframe
    src="${embedUrl}"
    style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: 0;"
    loading="lazy"
    referrerpolicy="no-referrer-when-downgrade"
    allowfullscreen
  ></iframe>
</div>`;

  return {
    publicUrl,
    embedUrl,
    iframeSnippet,
  };
};
