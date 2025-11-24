import { Magazine, Section } from "@/types/magazine";

export type PageType = "cover" | "contents" | "article";

export interface ArticlePageBlock {
  sectionId: string;
  sectionLabel: string;
  sectionTitle: string;
  section: Section;
  paragraphs: string[];
  isFirstPage: boolean;
  isLastPage: boolean;
}

export interface MagazinePage {
  type: PageType;
  pageNumber: number;
  articleBlock?: ArticlePageBlock;
}

const MAX_CHARS_PER_PAGE = 1400;
const MIN_PARAGRAPHS_PER_PAGE = 3;

export function paginateMagazine(magazine: Magazine): MagazinePage[] {
  const pages: MagazinePage[] = [];
  let pageNumber = 1;

  // Page 1: Cover
  pages.push({
    type: "cover",
    pageNumber: pageNumber++,
  });

  // Page 2: Contents
  pages.push({
    type: "contents",
    pageNumber: pageNumber++,
  });

  // Pages 3+: Articles
  for (const section of magazine.sections) {
    const paragraphs = section.bodyMarkdown
      .split(/\n\n+/)
      .map((p) => p.trim())
      .filter((p) => p.length > 0);

    if (paragraphs.length === 0) {
      // Empty section, create one page anyway
      pages.push({
        type: "article",
        pageNumber: pageNumber++,
        articleBlock: {
          sectionId: section.id,
          sectionLabel: section.label,
          sectionTitle: section.title,
          section,
          paragraphs: [],
          isFirstPage: true,
          isLastPage: true,
        },
      });
      continue;
    }

    let currentPageParagraphs: string[] = [];
    let currentCharCount = 0;
    const sectionPages: ArticlePageBlock[] = [];

    for (let i = 0; i < paragraphs.length; i++) {
      const para = paragraphs[i];
      const paraLength = para.length;

      // Check if adding this paragraph would exceed limit
      if (
        currentPageParagraphs.length >= MIN_PARAGRAPHS_PER_PAGE &&
        currentCharCount + paraLength > MAX_CHARS_PER_PAGE
      ) {
        // Commit current page
        sectionPages.push({
          sectionId: section.id,
          sectionLabel: section.label,
          sectionTitle: section.title,
          section,
          paragraphs: [...currentPageParagraphs],
          isFirstPage: sectionPages.length === 0,
          isLastPage: false,
        });
        currentPageParagraphs = [];
        currentCharCount = 0;
      }

      currentPageParagraphs.push(para);
      currentCharCount += paraLength;
    }

    // Commit last page for this section
    if (currentPageParagraphs.length > 0) {
      sectionPages.push({
        sectionId: section.id,
        sectionLabel: section.label,
        sectionTitle: section.title,
        section,
        paragraphs: currentPageParagraphs,
        isFirstPage: sectionPages.length === 0,
        isLastPage: true,
      });
    }

    // Mark last page
    if (sectionPages.length > 0) {
      sectionPages[sectionPages.length - 1].isLastPage = true;
    }

    // Add all section pages to magazine pages
    for (const block of sectionPages) {
      pages.push({
        type: "article",
        pageNumber: pageNumber++,
        articleBlock: block,
      });
    }
  }

  return pages;
}
