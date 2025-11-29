import { describe, it, expect } from 'vitest';
import { paginateMagazine, MagazinePage } from './pagination';
import { Magazine } from '@/types/magazine';

// Minimal fixture based on issue-debug.json last section
const createTestMagazine = (overrides: Partial<Magazine['sections'][0]> = {}): Magazine => ({
  id: 'test-magazine',
  title: 'Test Magazine',
  issueNumber: '01',
  publisherName: 'Test Publisher',
  publicationDate: '2025-11-22',
  sections: [
    {
      id: 'test-section',
      label: 'DOCUMENT SUMMARY',
      title: 'Test Section',
      keyPoints: [
        'Key point 1',
        'Key point 2',
        'Key point 3',
      ],
      pullQuote: 'This is a test pull quote.',
      bodyMarkdown: 'Short body content that fits on one page.',
      keyPointsPlacement: 'second-page-top',
      pullQuotePlacement: 'second-page-top',
      ...overrides,
    },
  ],
});

describe('paginateMagazine', () => {
  it('creates dedicated second page when keyPointsPlacement is second-page-top but content fits on one page', () => {
    const magazine = createTestMagazine({
      keyPointsPlacement: 'second-page-top',
      pullQuotePlacement: 'first-page-end',
    });

    const pages = paginateMagazine(magazine);
    
    // Should have: cover, contents, article page 1, article page 2 (for key points)
    expect(pages.length).toBe(4);
    
    const articlePages = pages.filter(p => p.kind === 'article');
    expect(articlePages.length).toBe(2);
    
    // Page 1: should NOT show key points (placement is second-page-top)
    expect(articlePages[0].article?.pageWithinSection).toBe(1);
    expect(articlePages[0].article?.showKeyPoints).toBe(false);
    expect(articlePages[0].article?.showPullQuote).toBe(true); // first-page-end
    
    // Page 2: should show key points
    expect(articlePages[1].article?.pageWithinSection).toBe(2);
    expect(articlePages[1].article?.showKeyPoints).toBe(true);
    expect(articlePages[1].article?.isContinuation).toBe(true);
  });

  it('creates dedicated second page when pullQuotePlacement is second-page-end but content fits on one page', () => {
    const magazine = createTestMagazine({
      keyPointsPlacement: 'first-page-end',
      pullQuotePlacement: 'second-page-end',
    });

    const pages = paginateMagazine(magazine);
    
    const articlePages = pages.filter(p => p.kind === 'article');
    expect(articlePages.length).toBe(2);
    
    // Page 2 should show pull quote
    expect(articlePages[1].article?.showPullQuote).toBe(true);
  });

  it('handles missing pullQuotePlacement by defaulting to first-page-end', () => {
    const magazine = createTestMagazine({
      keyPointsPlacement: 'second-page-top',
      pullQuotePlacement: undefined, // Missing - should default to first-page-end
    });

    const pages = paginateMagazine(magazine);
    const articlePages = pages.filter(p => p.kind === 'article');
    
    // Page 1: pull quote should show (default first-page-end)
    expect(articlePages[0].article?.showPullQuote).toBe(true);
    
    // Page 2: key points should show
    expect(articlePages[1].article?.showKeyPoints).toBe(true);
    expect(articlePages[1].article?.showPullQuote).toBe(false);
  });

  it('does not create second page when placement is none', () => {
    const magazine = createTestMagazine({
      keyPointsPlacement: 'none',
      pullQuotePlacement: 'none',
    });

    const pages = paginateMagazine(magazine);
    const articlePages = pages.filter(p => p.kind === 'article');
    
    // Only 1 article page since both placements are none
    expect(articlePages.length).toBe(1);
    expect(articlePages[0].article?.showKeyPoints).toBe(false);
    expect(articlePages[0].article?.showPullQuote).toBe(false);
  });

  it('shows key points and pull quote on page 2 when both have second-page placement', () => {
    const magazine = createTestMagazine({
      keyPointsPlacement: 'second-page-top',
      pullQuotePlacement: 'second-page-end',
    });

    const pages = paginateMagazine(magazine);
    const articlePages = pages.filter(p => p.kind === 'article');
    
    expect(articlePages.length).toBe(2);
    
    // Page 2 should show both
    expect(articlePages[1].article?.showKeyPoints).toBe(true);
    expect(articlePages[1].article?.showPullQuote).toBe(true);
  });
});
