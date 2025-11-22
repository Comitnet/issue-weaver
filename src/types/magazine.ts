export interface ColorPalette {
  primary: string;
  secondary: string;
  background: string;
  text: string;
}

export interface Section {
  id: string;
  label: string;
  title: string;
  subtitle?: string;
  heroImageUrl?: string;
  heroImageAlt?: string;
  heroImageSource?: "upload" | "ai" | "url";
  heroImagePrompt?: string;
  keyPoints: string[];
  pullQuote?: string;
  statsLine?: string;
  bodyMarkdown: string;
  showOnCover?: boolean;
}

export interface Magazine {
  id: string;
  title: string;
  subtitle?: string;
  tagline?: string;
  issueNumber: string;
  issueLabel?: string;
  themeTitle?: string;
  themeSummary?: string;
  publisherName: string;
  publisherWebsite?: string;
  landingPageUrl?: string;
  publicationDate: string;
  language?: string;
  accentColorHex?: string;
  colorPalette?: ColorPalette;
  publisherLogoUrl?: string;
  logoLibrary?: string[];
  sections: Section[];
}

export const DEFAULT_COLOR_PALETTE: ColorPalette = {
  primary: "#1e293b",
  secondary: "#f59e0b",
  background: "#ffffff",
  text: "#0f172a",
};

export const createDefaultMagazine = (): Magazine => ({
  id: crypto.randomUUID(),
  title: "New Magazine",
  subtitle: "Your subtitle here",
  tagline: "Excellence in Publishing",
  issueNumber: "01",
  issueLabel: "Volume 1",
  themeTitle: "Innovation & Technology",
  themeSummary: "Exploring the future of digital publishing",
  publisherName: "Your Publisher",
  publisherWebsite: "https://example.com",
  publicationDate: new Date().toISOString().split('T')[0],
  language: "en",
  colorPalette: DEFAULT_COLOR_PALETTE,
  logoLibrary: [],
  sections: [
    {
      id: crypto.randomUUID(),
      label: "Feature",
      title: "Welcome to Magazine Builder",
      subtitle: "Create beautiful magazines with ease",
      keyPoints: [
        "Intuitive editor interface",
        "Live preview functionality",
        "Export to PDF and JSON",
      ],
      bodyMarkdown: "# Getting Started\n\nThis is your first section. Edit the content, add images, and customize the layout to create your perfect magazine.\n\n## Key Features\n\n- Rich text editing with Markdown\n- Image management and AI generation\n- Color palette customization\n- Professional print-ready output",
      showOnCover: true,
    },
  ],
});
