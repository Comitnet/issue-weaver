/**
 * Hook for managing multiple magazine issues
 * 
 * IMPORTANT: PERSISTENCE MODEL
 * ============================
 * In Lovable's cloud sandbox, the browser CANNOT write to the Git repository.
 * 
 * - READ operations work: loadIssuesIndex() and loadIssue() fetch from /data/issues/*.json
 * - WRITE operations DO NOT persist: saveIssue(), updateIssuesIndex(), deleteIssue() 
 *   only work in a local dev environment with the Vite plugin running.
 * 
 * To persist changes in Lovable:
 * 1. Edit in the UI (changes stay in memory)
 * 2. Click "Export for Git" to copy JSON to clipboard
 * 3. Paste the JSON in the AI chat
 * 4. AI writes to data/issues/<slug>.json using Lovable file tools
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { Magazine, createDefaultMagazine } from '@/types/magazine';
import { MagazineIssueMeta, MagazineIssueFile, IssuesIndex, createIssueMeta } from '@/types/issue';
import {
  loadIssuesIndex,
  loadIssue,
  loadDemoTemplate,
} from '@/lib/issueApi';

const LAST_ISSUE_KEY = 'magazine-last-issue-id';

export type IssueTemplate = 'blank' | 'demo' | 'current';

interface UseIssuesReturn {
  // State
  issues: MagazineIssueMeta[];
  currentIssue: MagazineIssueFile | null;
  isLoading: boolean;
  isDirty: boolean;
  
  // Actions
  selectIssue: (id: string) => Promise<void>;
  createIssue: (title: string, template: IssueTemplate) => Promise<MagazineIssueFile | null>;
  updateMagazine: (updates: Partial<Magazine>) => void;
  refreshIssues: () => Promise<void>;
}

export function useIssues(): UseIssuesReturn {
  const [issues, setIssues] = useState<MagazineIssueMeta[]>([]);
  const [currentIssue, setCurrentIssue] = useState<MagazineIssueFile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDirty, setIsDirty] = useState(false);
  
  const currentIssueRef = useRef<MagazineIssueFile | null>(null);
  
  // Keep ref in sync with state
  useEffect(() => {
    currentIssueRef.current = currentIssue;
  }, [currentIssue]);

  /**
   * Load issues on mount
   * Reads from static JSON files in the repo (data/issues/)
   */
  useEffect(() => {
    async function initialize() {
      setIsLoading(true);
      
      // Load the issues index from repo
      const index = await loadIssuesIndex();
      setIssues(index.issues);
      
      if (index.issues.length === 0) {
        // No issues in repo - create a blank one in memory
        // User will need to export it to persist
        const meta = createIssueMeta('New Issue', []);
        const newIssue: MagazineIssueFile = {
          meta,
          magazine: {
            ...createDefaultMagazine(),
            id: meta.id,
          },
        };
        
        setIssues([meta]);
        setCurrentIssue(newIssue);
        setIsDirty(true); // Mark as dirty since it's not in the repo
        localStorage.setItem(LAST_ISSUE_KEY, meta.id);
      } else {
        // Load the last opened issue or first available
        const lastOpenedId = localStorage.getItem(LAST_ISSUE_KEY);
        const targetMeta = index.issues.find(i => i.id === lastOpenedId) || index.issues[0];
        
        const issueFile = await loadIssue(targetMeta.slug);
        if (issueFile) {
          setCurrentIssue(issueFile);
          localStorage.setItem(LAST_ISSUE_KEY, issueFile.meta.id);
        }
      }
      
      setIsLoading(false);
    }
    
    initialize();
  }, []);

  /**
   * Select and load a different issue from the repo
   */
  const selectIssue = useCallback(async (id: string) => {
    const meta = issues.find(i => i.id === id);
    if (!meta) return;
    
    setIsLoading(true);
    const issueFile = await loadIssue(meta.slug);
    
    if (issueFile) {
      setCurrentIssue(issueFile);
      setIsDirty(false);
      localStorage.setItem(LAST_ISSUE_KEY, id);
    }
    
    setIsLoading(false);
  }, [issues]);

  /**
   * Create a new issue in memory
   * NOTE: This does NOT persist to the repo. Use "Export for Git" to save.
   */
  const createIssue = useCallback(async (
    title: string,
    template: IssueTemplate
  ): Promise<MagazineIssueFile | null> => {
    const existingSlugs = issues.map(i => i.slug);
    const meta = createIssueMeta(title, existingSlugs);
    
    let magazine: Magazine;
    
    switch (template) {
      case 'demo': {
        const demoTemplate = await loadDemoTemplate();
        if (demoTemplate) {
          magazine = {
            ...demoTemplate.magazine,
            id: meta.id,
            title,
          };
        } else {
          magazine = {
            ...createDefaultMagazine(),
            id: meta.id,
            title,
          };
        }
        break;
      }
      case 'current': {
        if (currentIssue) {
          magazine = {
            ...JSON.parse(JSON.stringify(currentIssue.magazine)),
            id: meta.id,
            title,
          };
        } else {
          magazine = {
            ...createDefaultMagazine(),
            id: meta.id,
            title,
          };
        }
        break;
      }
      case 'blank':
      default: {
        magazine = {
          ...createDefaultMagazine(),
          id: meta.id,
          title,
        };
        break;
      }
    }
    
    const newIssue: MagazineIssueFile = { meta, magazine };
    
    // Update in-memory state only
    // The issue is NOT persisted to the repo until exported
    setIssues(prev => [...prev, meta]);
    setCurrentIssue(newIssue);
    setIsDirty(true); // Mark dirty because it's not in the repo yet
    localStorage.setItem(LAST_ISSUE_KEY, meta.id);
    
    return newIssue;
  }, [issues, currentIssue]);

  /**
   * Update the current magazine content (in memory only)
   * Changes are NOT persisted until exported via "Export for Git"
   */
  const updateMagazine = useCallback((updates: Partial<Magazine>) => {
    setCurrentIssue(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        magazine: { ...prev.magazine, ...updates },
      };
    });
    setIsDirty(true);
  }, []);

  /**
   * Refresh the issues list from the repo
   */
  const refreshIssues = useCallback(async () => {
    const index = await loadIssuesIndex();
    setIssues(index.issues);
  }, []);

  return {
    issues,
    currentIssue,
    isLoading,
    isDirty,
    selectIssue,
    createIssue,
    updateMagazine,
    refreshIssues,
  };
}
