/**
 * Hook for managing multiple magazine issues with repo-backed storage
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { Magazine, createDefaultMagazine } from '@/types/magazine';
import { MagazineIssueMeta, MagazineIssueFile, IssuesIndex, createIssueMeta } from '@/types/issue';
import {
  loadIssuesIndex,
  loadIssue,
  saveIssue,
  updateIssuesIndex,
  deleteIssue,
  loadDemoTemplate,
  checkDevEnvironment,
} from '@/lib/issueApi';

const LAST_ISSUE_KEY = 'magazine-last-issue-id';
const AUTO_SAVE_INTERVAL = 30000; // 30 seconds

export type IssueTemplate = 'blank' | 'demo' | 'current';

interface UseIssuesReturn {
  // State
  issues: MagazineIssueMeta[];
  currentIssue: MagazineIssueFile | null;
  isLoading: boolean;
  isDirty: boolean;
  isDevEnvironment: boolean;
  lastSaved: Date | null;
  
  // Actions
  selectIssue: (id: string) => Promise<void>;
  createIssue: (title: string, template: IssueTemplate) => Promise<MagazineIssueFile | null>;
  saveCurrentIssue: () => Promise<{ success: boolean; error?: string }>;
  updateMagazine: (updates: Partial<Magazine>) => void;
  deleteCurrentIssue: () => Promise<{ success: boolean; error?: string }>;
  refreshIssues: () => Promise<void>;
}

export function useIssues(): UseIssuesReturn {
  const [issues, setIssues] = useState<MagazineIssueMeta[]>([]);
  const [currentIssue, setCurrentIssue] = useState<MagazineIssueFile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDirty, setIsDirty] = useState(false);
  const [isDevEnvironment, setIsDevEnvironment] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  
  const autoSaveTimerRef = useRef<NodeJS.Timeout | null>(null);
  const currentIssueRef = useRef<MagazineIssueFile | null>(null);
  
  // Keep ref in sync with state for auto-save
  useEffect(() => {
    currentIssueRef.current = currentIssue;
  }, [currentIssue]);

  /**
   * Load or create initial issues on mount
   */
  useEffect(() => {
    async function initialize() {
      setIsLoading(true);
      
      // Check if dev environment supports file writing
      const isDev = await checkDevEnvironment();
      setIsDevEnvironment(isDev);
      
      // Load the issues index
      const index = await loadIssuesIndex();
      setIssues(index.issues);
      
      if (index.issues.length === 0) {
        // No issues exist - create first issue from demo template
        const demoTemplate = await loadDemoTemplate();
        
        if (demoTemplate) {
          // Use demo as first issue
          const meta = createIssueMeta('First Issue', []);
          const firstIssue: MagazineIssueFile = {
            meta,
            magazine: {
              ...demoTemplate.magazine,
              id: meta.id,
            },
          };
          
          // Save if in dev environment
          if (isDev) {
            await saveIssue(firstIssue);
            await updateIssuesIndex({ issues: [meta], lastOpenedId: meta.id });
          }
          
          setIssues([meta]);
          setCurrentIssue(firstIssue);
          localStorage.setItem(LAST_ISSUE_KEY, meta.id);
        } else {
          // Create blank first issue
          const meta = createIssueMeta('First Issue', []);
          const firstIssue: MagazineIssueFile = {
            meta,
            magazine: {
              ...createDefaultMagazine(),
              id: meta.id,
            },
          };
          
          if (isDev) {
            await saveIssue(firstIssue);
            await updateIssuesIndex({ issues: [meta], lastOpenedId: meta.id });
          }
          
          setIssues([meta]);
          setCurrentIssue(firstIssue);
          localStorage.setItem(LAST_ISSUE_KEY, meta.id);
        }
      } else {
        // Issues exist - load the last opened or first
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
   * Auto-save in dev environment
   */
  useEffect(() => {
    if (!isDevEnvironment || !isDirty) {
      return;
    }
    
    // Clear existing timer
    if (autoSaveTimerRef.current) {
      clearTimeout(autoSaveTimerRef.current);
    }
    
    // Set new timer
    autoSaveTimerRef.current = setTimeout(async () => {
      if (currentIssueRef.current && isDirty) {
        const result = await saveIssue(currentIssueRef.current);
        if (result.success) {
          setIsDirty(false);
          setLastSaved(new Date());
        }
      }
    }, AUTO_SAVE_INTERVAL);
    
    return () => {
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current);
      }
    };
  }, [isDevEnvironment, isDirty, currentIssue]);

  /**
   * Select and load a different issue
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
   * Create a new issue
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
    
    // Save to repo if in dev environment
    if (isDevEnvironment) {
      const saveResult = await saveIssue(newIssue);
      if (!saveResult.success) {
        console.error('Failed to save new issue:', saveResult.error);
        // Continue anyway - user can still work with it in memory
      }
      
      const newIndex: IssuesIndex = {
        issues: [...issues, meta],
        lastOpenedId: meta.id,
      };
      await updateIssuesIndex(newIndex);
    }
    
    // Update state
    setIssues(prev => [...prev, meta]);
    setCurrentIssue(newIssue);
    setIsDirty(false);
    localStorage.setItem(LAST_ISSUE_KEY, meta.id);
    
    return newIssue;
  }, [issues, currentIssue, isDevEnvironment]);

  /**
   * Save the current issue to repo
   */
  const saveCurrentIssue = useCallback(async (): Promise<{ success: boolean; error?: string }> => {
    if (!currentIssue) {
      return { success: false, error: 'No issue loaded' };
    }
    
    // Update the updatedAt timestamp
    const updatedIssue: MagazineIssueFile = {
      ...currentIssue,
      meta: {
        ...currentIssue.meta,
        updatedAt: new Date().toISOString(),
        title: currentIssue.magazine.title, // Sync title from magazine
      },
    };
    
    const result = await saveIssue(updatedIssue);
    
    if (result.success) {
      setCurrentIssue(updatedIssue);
      setIsDirty(false);
      setLastSaved(new Date());
      
      // Update index with new metadata
      const updatedIssues = issues.map(i =>
        i.id === updatedIssue.meta.id ? updatedIssue.meta : i
      );
      setIssues(updatedIssues);
      
      if (isDevEnvironment) {
        await updateIssuesIndex({ issues: updatedIssues, lastOpenedId: updatedIssue.meta.id });
      }
    }
    
    return result;
  }, [currentIssue, issues, isDevEnvironment]);

  /**
   * Update the current magazine content
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
   * Delete the current issue
   */
  const deleteCurrentIssue = useCallback(async (): Promise<{ success: boolean; error?: string }> => {
    if (!currentIssue) {
      return { success: false, error: 'No issue loaded' };
    }
    
    if (issues.length <= 1) {
      return { success: false, error: 'Cannot delete the last issue' };
    }
    
    const result = await deleteIssue(currentIssue.meta.slug);
    
    if (result.success) {
      const newIssues = issues.filter(i => i.id !== currentIssue.meta.id);
      setIssues(newIssues);
      
      // Update index
      if (isDevEnvironment) {
        await updateIssuesIndex({ issues: newIssues });
      }
      
      // Switch to first remaining issue
      if (newIssues.length > 0) {
        await selectIssue(newIssues[0].id);
      }
    }
    
    return result;
  }, [currentIssue, issues, isDevEnvironment, selectIssue]);

  /**
   * Refresh the issues list from disk
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
    isDevEnvironment,
    lastSaved,
    selectIssue,
    createIssue,
    saveCurrentIssue,
    updateMagazine,
    deleteCurrentIssue,
    refreshIssues,
  };
}
