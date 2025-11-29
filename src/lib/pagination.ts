import { Magazine, Section } from "@/types/magazine";

export type PageKind = "cover" | "contents" | "article";

export interface ArticlePageBlock {
  sectionId: string;
  sectionLabel: string;
  sectionTitle: string;
  section: Section;
  isContinuation: boolean;
  paragraphs: string[];
  pageWithinSection: number;
  showKeyPoints?: boolean;
  showPullQuote?: boolean;
}

export interface MagazinePage {
  index: number;
  pageNumber: number;
  kind: PageKind;
  article?: ArticlePageBlock;
}

const MAX_CHARS_PER_PAGE = 2200;

export function paginateMagazine(magazine: Magazine): MagazinePage[] {
  const pages: MagazinePage[] = [];
  let pageIndex = 0;

  // Page 0: Cover
  pages.push({
    index: pageIndex++,
    pageNumber: 0, // Will be set at the end
    kind: "cover",
  });

  // Page 1: Contents
  pages.push({
    index: pageIndex++,
    pageNumber: 0, // Will be set at the end
    kind: "contents",
  });

  // Pages 2+: Articles and Ads
  for (const section of magazine.sections) {
    // Handle advertisement sections
    if (section.kind === "advertisement") {
      pages.push({
        index: pageIndex++,
        pageNumber: 0, // Will be set at the end
        kind: "article",
        article: {
          sectionId: section.id,
          sectionLabel: section.label,
          sectionTitle: section.title,
          section,
          isContinuation: false,
          paragraphs: [],
          pageWithinSection: 1,
        },
      });
      continue;
    }

    // Special handling for "FROM THE EDITOR" section
    if (section.label.toUpperCase() === "FROM THE EDITOR") {
      const body = section.bodyMarkdown || "";
      const paragraphs = body
        .split(/\n\n+/)
        .map((p) => p.trim())
        .filter((p) => p.length > 0);

      // Page 1: Body content only (no key points/pull quote)
      pages.push({
        index: pageIndex++,
        pageNumber: 0, // Will be set at the end
        kind: "article",
        article: {
          sectionId: section.id,
          sectionLabel: section.label,
          sectionTitle: section.title,
          section,
          isContinuation: false,
          paragraphs,
          pageWithinSection: 1,
          showKeyPoints: false,
          showPullQuote: false,
        },
      });

      // Page 2: Key points and pull quote (if they exist)
      if ((section.keyPoints && section.keyPoints.length > 0) || section.pullQuote) {
        pages.push({
          index: pageIndex++,
          pageNumber: 0, // Will be set at the end
          kind: "article",
          article: {
            sectionId: section.id,
            sectionLabel: section.label,
            sectionTitle: section.title,
            section,
            isContinuation: true,
            paragraphs: [],
            pageWithinSection: 2,
            showKeyPoints: true,
            showPullQuote: true,
          },
        });
      }
      continue;
    }

    // Handle regular article sections
    const body = section.bodyMarkdown || "";
    const paragraphs = body
      .split(/\n\n+/)
      .map((p) => p.trim())
      .filter((p) => p.length > 0);

    // Determine placement settings with defaults
    const keyPointsPlacement = section.keyPointsPlacement || "first-page-end";
    const pullQuotePlacement = section.pullQuotePlacement || "first-page-end";
    const keyPointsFirst = section.keyPointsFirst !== false; // default true

    // Check if section has key points or pull quote that need to be shown
    const hasKeyPoints = section.keyPoints && section.keyPoints.length > 0 && keyPointsPlacement !== "none";
    const hasPullQuote = section.pullQuote && pullQuotePlacement !== "none";

    // Check if any content needs to appear on page 2
    const needsSecondPageForKeyPoints = hasKeyPoints && (keyPointsPlacement === "second-page-top" || keyPointsPlacement === "second-page-end");
    const needsSecondPageForPullQuote = hasPullQuote && (pullQuotePlacement === "second-page-top" || pullQuotePlacement === "second-page-end");
    const requiresDedicatedSecondPage = needsSecondPageForKeyPoints || needsSecondPageForPullQuote;

    if (paragraphs.length === 0) {
      // Empty section, create one page anyway
      const showKeyPointsOnPage1 = hasKeyPoints && keyPointsPlacement === "first-page-end";
      const showPullQuoteOnPage1 = hasPullQuote && pullQuotePlacement === "first-page-end";
      
      pages.push({
        index: pageIndex++,
        pageNumber: 0, // Will be set at the end
        kind: "article",
        article: {
          sectionId: section.id,
          sectionLabel: section.label,
          sectionTitle: section.title,
          section,
          isContinuation: false,
          paragraphs: [],
          pageWithinSection: 1,
          showKeyPoints: showKeyPointsOnPage1,
          showPullQuote: showPullQuoteOnPage1,
        },
      });

      // If key points or pull quote need second page placement, create dedicated page 2
      if (requiresDedicatedSecondPage) {
        pages.push({
          index: pageIndex++,
          pageNumber: 0,
          kind: "article",
          article: {
            sectionId: section.id,
            sectionLabel: section.label,
            sectionTitle: section.title,
            section,
            isContinuation: true,
            paragraphs: [],
            pageWithinSection: 2,
            showKeyPoints: needsSecondPageForKeyPoints,
            showPullQuote: needsSecondPageForPullQuote,
          },
        });
      }
      continue;
    }

    let currentPageParagraphs: string[] = [];
    let currentCharCount = 0;
    let pageWithinSection = 0;
    const sectionPages: MagazinePage[] = [];

    const flushPage = () => {
      if (currentPageParagraphs.length === 0) return;
      
      pageWithinSection++;
      
      // Determine what to show on this page
      let showKeyPoints = false;
      let showPullQuote = false;

      if (pageWithinSection === 1) {
        showKeyPoints = hasKeyPoints && keyPointsPlacement === "first-page-end";
        showPullQuote = hasPullQuote && pullQuotePlacement === "first-page-end";
      } else if (pageWithinSection === 2) {
        showKeyPoints = hasKeyPoints && (keyPointsPlacement === "second-page-top" || keyPointsPlacement === "second-page-end");
        showPullQuote = hasPullQuote && (pullQuotePlacement === "second-page-top" || pullQuotePlacement === "second-page-end");
      }
      
      sectionPages.push({
        index: pageIndex++,
        pageNumber: 0, // Will be set at the end
        kind: "article",
        article: {
          sectionId: section.id,
          sectionLabel: section.label,
          sectionTitle: section.title,
          section,
          isContinuation: pageWithinSection > 1,
          paragraphs: [...currentPageParagraphs],
          pageWithinSection,
          showKeyPoints,
          showPullQuote,
        },
      });
      
      currentPageParagraphs = [];
      currentCharCount = 0;
    };

    for (const para of paragraphs) {
      const paraLength = para.length;
      const newCount = currentCharCount + paraLength + 2;
      
      const wouldOverflow = newCount > MAX_CHARS_PER_PAGE;

      // Break page only if we would overflow AND we have at least one paragraph
      if (wouldOverflow && currentPageParagraphs.length > 0) {
        flushPage();
      }

      currentPageParagraphs.push(para);
      currentCharCount += paraLength + 2; // +2 for spacing
    }

    // Flush remaining paragraphs
    flushPage();

    // After flushing all content, check if we need a dedicated second page for key points/pull quote
    // This happens when content only created 1 page but placement requires page 2
    if (pageWithinSection === 1 && requiresDedicatedSecondPage) {
      sectionPages.push({
        index: pageIndex++,
        pageNumber: 0,
        kind: "article",
        article: {
          sectionId: section.id,
          sectionLabel: section.label,
          sectionTitle: section.title,
          section,
          isContinuation: true,
          paragraphs: [],
          pageWithinSection: 2,
          showKeyPoints: needsSecondPageForKeyPoints,
          showPullQuote: needsSecondPageForPullQuote,
        },
      });
    }

    // Add all section pages to the main pages array
    pages.push(...sectionPages);
  }

  // Re-index to ensure sequential 0-based indices and assign page numbers
  return pages.map((page, idx) => ({ ...page, index: idx, pageNumber: idx }));
}
