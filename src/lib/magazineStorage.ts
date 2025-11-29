/**
 * Utilities for storing and retrieving magazines by ID
 * This allows the reader route to load magazines independently
 */

import { Magazine } from '@/types/magazine';

const STORAGE_PREFIX = 'magazine-builder-issue-';
const CURRENT_KEY = 'magazine-builder-current';

/**
 * Save a magazine to localStorage by its ID
 */
export const saveMagazineById = (magazine: Magazine): void => {
  localStorage.setItem(`${STORAGE_PREFIX}${magazine.id}`, JSON.stringify(magazine));
};

/**
 * Load a magazine from localStorage by its ID
 */
export const loadMagazineById = (issueId: string): Magazine | null => {
  // First try the specific issue storage
  const stored = localStorage.getItem(`${STORAGE_PREFIX}${issueId}`);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      return null;
    }
  }
  
  // Fallback: check if the current magazine matches this ID
  const current = localStorage.getItem(CURRENT_KEY);
  if (current) {
    try {
      const magazine = JSON.parse(current);
      if (magazine.id === issueId) {
        return magazine;
      }
    } catch {
      return null;
    }
  }
  
  return null;
};

/**
 * Get all saved magazine IDs
 */
export const getAllMagazineIds = (): string[] => {
  const ids: string[] = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key?.startsWith(STORAGE_PREFIX)) {
      ids.push(key.replace(STORAGE_PREFIX, ''));
    }
  }
  return ids;
};

/**
 * Delete a magazine by its ID
 */
export const deleteMagazineById = (issueId: string): void => {
  localStorage.removeItem(`${STORAGE_PREFIX}${issueId}`);
};
