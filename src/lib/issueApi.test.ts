/**
 * Tests for issue management system
 */

import { describe, it, expect } from 'vitest';
import { generateSlug, createIssueMeta } from '@/types/issue';

describe('generateSlug', () => {
  it('converts title to kebab-case', () => {
    expect(generateSlug('My Great Article')).toBe('my-great-article');
    expect(generateSlug('Hello World')).toBe('hello-world');
  });

  it('removes special characters', () => {
    expect(generateSlug('FDA & Device-Level Requirements')).toBe('fda-device-level-requirements');
    expect(generateSlug('Test: Something (New)')).toBe('test-something-new');
  });

  it('handles duplicates by adding suffix', () => {
    const existingSlugs = ['my-issue', 'my-issue-1'];
    expect(generateSlug('My Issue', existingSlugs)).toBe('my-issue-2');
  });

  it('truncates long titles', () => {
    const longTitle = 'This is a very long title that should be truncated to prevent overly long file names';
    const slug = generateSlug(longTitle);
    expect(slug.length).toBeLessThanOrEqual(50);
  });

  it('handles empty titles', () => {
    expect(generateSlug('')).toBe('untitled');
    expect(generateSlug('   ')).toBe('untitled');
  });
});

describe('createIssueMeta', () => {
  it('creates metadata with unique id and slug', () => {
    const meta = createIssueMeta('Test Issue');
    
    expect(meta.id).toBeTruthy();
    expect(meta.title).toBe('Test Issue');
    expect(meta.slug).toBe('test-issue');
    expect(meta.createdAt).toBeTruthy();
    expect(meta.updatedAt).toBeTruthy();
  });

  it('generates unique slug when duplicates exist', () => {
    const existingSlugs = ['test-issue'];
    const meta = createIssueMeta('Test Issue', existingSlugs);
    
    expect(meta.slug).toBe('test-issue-1');
  });
});
