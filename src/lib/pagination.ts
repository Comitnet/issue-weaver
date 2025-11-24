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
}

export interface MagazinePage {
  index: number;
  kind: PageKind;
  article?: ArticlePageBlock;
}

const MAX_CHARS_PER_PAGE = 6000;

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

    // Handle article sections
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

    const flushPage = () => {
      if (currentPageParagraphs.length === 0) return;
      
      pages.push({
        index: pageIndex++,
        kind: "article",
        article: {
          sectionId: section.id,
          sectionLabel: section.label,
          sectionTitle: section.title,
          section,
          isContinuation: pageWithinSection > 0,
          paragraphs: [...currentPageParagraphs],
          pageWithinSection: ++pageWithinSection,
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
