import { useState, useEffect } from 'react';
import { Magazine, createDefaultMagazine } from '@/types/magazine';

const STORAGE_KEY = 'magazine-builder-current';

export const useMagazine = () => {
  const [magazine, setMagazine] = useState<Magazine>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        return createDefaultMagazine();
      }
    }
    return createDefaultMagazine();
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(magazine));
  }, [magazine]);

  const updateMagazine = (updates: Partial<Magazine>) => {
    setMagazine((prev) => ({ ...prev, ...updates }));
  };

  const resetMagazine = () => {
    setMagazine(createDefaultMagazine());
  };

  const importMagazine = (data: Magazine) => {
    setMagazine(data);
  };

  const exportMagazine = () => {
    return magazine;
  };

  return {
    magazine,
    updateMagazine,
    resetMagazine,
    importMagazine,
    exportMagazine,
  };
};
