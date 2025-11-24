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
    kind: "cover",
  });

  // Page 1: Contents
  pages.push({
    index: pageIndex++,
    kind: "contents",
  });

  // Pages 2+: Articles and Ads
  for (const section of magazine.sections) {
    // Handle advertisement sections
    if (section.kind === "advertisement") {
      pages.push({
        index: pageIndex++,
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

    if (paragraphs.length === 0) {
      // Empty section, create one page anyway
      pages.push({
        index: pageIndex++,
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

    let currentPageParagraphs: string[] = [];
    let currentCharCount = 0;
    let pageWithinSection = 0;

    // Determine placement settings
    const keyPointsPlacement = section.keyPointsPlacement || "first-page-end";
    const pullQuotePlacement = section.pullQuotePlacement || "first-page-end";
    const keyPointsFirst = section.keyPointsFirst !== false; // default true

    const flushPage = () => {
      if (currentPageParagraphs.length === 0) return;
      
      pageWithinSection++;
      
      // Determine what to show on this page
      let showKeyPoints = false;
      let showPullQuote = false;

      if (pageWithinSection === 1) {
        showKeyPoints = keyPointsPlacement === "first-page-end";
        showPullQuote = pullQuotePlacement === "first-page-end";
      } else if (pageWithinSection === 2) {
        showKeyPoints = keyPointsPlacement === "second-page-top" || keyPointsPlacement === "second-page-end";
        showPullQuote = pullQuotePlacement === "second-page-top" || pullQuotePlacement === "second-page-end";
      }
      
      pages.push({
        index: pageIndex++,
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
  }

  // Re-index to ensure sequential 0-based indices
  return pages.map((page, idx) => ({ ...page, index: idx }));
}
