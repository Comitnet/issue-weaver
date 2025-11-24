import { Magazine, Section } from "@/types/magazine";
import { MagazinePage } from "@/lib/pagination";
import { PageFrame } from "./PageFrame";

interface MagazinePageViewProps {
  magazine: Magazine;
  page: MagazinePage;
}

export const MagazinePageView = ({ magazine, page }: MagazinePageViewProps) => {
  const palette = magazine.colorPalette || {
    primary: "#1e293b",
    secondary: "#f59e0b",
    background: "#ffffff",
    text: "#0f172a",
  };

  if (page.type === "cover") {
    return (
      <PageFrame>
        <div className="relative w-full h-full overflow-hidden">
          {/* Background image */}
          {magazine.coverImageUrl && magazine.coverImageStyle === "full-bleed" && (
            <img
              src={magazine.coverImageUrl}
              alt={magazine.title}
              className="absolute inset-0 w-full h-full object-cover z-0"
            />
          )}

          {/* Gradient overlay */}
          {magazine.coverImageUrl && magazine.coverImageStyle === "full-bleed" && (
            <div className="absolute inset-0 z-10 bg-gradient-to-b from-black/40 via-black/20 to-black/70" />
          )}

          {/* Solid background if no image */}
          {(!magazine.coverImageUrl || magazine.coverImageStyle !== "full-bleed") && (
            <div
              className="absolute inset-0 z-0"
              style={{ backgroundColor: palette.background }}
            />
          )}

          {/* Foreground content */}
          <div
            className="relative z-20 flex flex-col h-full justify-between p-12"
            style={{
              color: magazine.coverImageStyle === "full-bleed" ? "#ffffff" : palette.text,
            }}
          >
            {/* Header */}
            <div className="flex justify-between items-start">
              <div>
                {magazine.publisherName && (
                  <p className="text-sm font-bold uppercase tracking-widest mb-1 opacity-90">
                    {magazine.publisherName}
                  </p>
                )}
                {magazine.issueLabel && (
                  <p className="text-xs uppercase tracking-wider opacity-75">
                    {magazine.issueLabel}
                  </p>
                )}
              </div>
              {magazine.publisherLogoUrl && (
                <img
                  src={magazine.publisherLogoUrl}
                  alt={magazine.publisherName}
                  className="h-12 w-auto object-contain"
                />
              )}
            </div>

            {/* Center */}
            <div className="flex-1 flex flex-col justify-center">
              <h1 className="text-6xl font-bold mb-4 leading-tight">{magazine.title}</h1>
              {magazine.subtitle && (
                <p className="text-2xl opacity-90 mb-6">{magazine.subtitle}</p>
              )}
              {magazine.tagline && (
                <p className="text-lg uppercase tracking-wider opacity-75">{magazine.tagline}</p>
              )}
            </div>

            {/* Footer */}
            <div className="space-y-3">
              {magazine.themeTitle && (
                <div>
                  <p className="text-xs uppercase tracking-widest mb-1 opacity-75">This Issue</p>
                  <p className="text-lg font-bold">{magazine.themeTitle}</p>
                </div>
              )}
              {magazine.sections.filter((s) => s.showOnCover).length > 0 && (
                <div>
                  <p className="text-xs uppercase tracking-widest mb-2 opacity-75">In This Issue</p>
                  <div className="space-y-1">
                    {magazine.sections
                      .filter((s) => s.showOnCover)
                      .map((section) => (
                        <p key={section.id} className="text-sm font-medium">
                          • {section.title}
                        </p>
                      ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </PageFrame>
    );
  }

  if (page.type === "contents") {
    return (
      <PageFrame>
        <div
          className="h-full flex flex-col p-12"
          style={{ backgroundColor: palette.background, color: palette.text }}
        >
          <div className="mb-8">
            <h2 className="text-5xl font-bold mb-4" style={{ color: palette.primary }}>
              Contents
            </h2>
            <div className="w-20 h-1.5 rounded-full" style={{ backgroundColor: palette.secondary }} />
          </div>

          <div className="space-y-6 flex-1">
            {magazine.sections.map((section, index) => (
              <div
                key={section.id}
                className="flex gap-5 items-start pb-4 border-b"
                style={{ borderColor: `${palette.primary}25` }}
              >
                <span
                  className="text-3xl font-bold flex-shrink-0 leading-none"
                  style={{ color: palette.primary }}
                >
                  {String(index + 3).padStart(2, "0")}
                </span>
                <div className="flex-1 min-w-0">
                  <p
                    className="text-xs uppercase tracking-widest mb-2 font-bold"
                    style={{ color: palette.secondary }}
                  >
                    {section.label}
                  </p>
                  <h3 className="font-bold text-xl leading-tight mb-1.5" style={{ color: palette.text }}>
                    {section.title}
                  </h3>
                  {section.subtitle && (
                    <p className="text-base leading-snug" style={{ color: palette.secondary, opacity: 0.9 }}>
                      {section.subtitle}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </PageFrame>
    );
  }

  if (page.type === "article" && page.articleBlock) {
    const { section, paragraphs, isFirstPage } = page.articleBlock;

    const getImageSizeClass = () => {
      switch (section.heroImageSize) {
        case "small":
          return "w-1/4";
        case "large":
          return "w-2/3";
        default:
          return "w-1/2";
      }
    };

    const getImageAlignClass = () => {
      switch (section.heroImageAlignment) {
        case "left":
          return "float-left mr-6 mb-4";
        case "right":
          return "float-right ml-6 mb-4";
        default:
          return "mx-auto mb-6";
      }
    };

    const renderImage = (placement: string) => {
      if (!section.heroImageUrl || section.heroImagePlacement !== placement) return null;

      const sizeClass = getImageSizeClass();
      const alignClass = section.wrapTextAroundImage && placement === "middle" ? getImageAlignClass() : "mx-auto mb-6";

      return (
        <img
          src={section.heroImageUrl}
          alt={section.heroImageAlt || section.title}
          className={`${sizeClass} ${alignClass} rounded-lg page-break-avoid`}
        />
      );
    };

    return (
      <PageFrame>
        <div
          className="h-full flex flex-col p-12"
          style={{ backgroundColor: palette.background, color: palette.text }}
        >
          {/* Header - only on first page */}
          {isFirstPage && (
            <div className="mb-8">
              <p
                className="text-xs uppercase tracking-widest mb-3 font-bold"
                style={{ color: palette.secondary }}
              >
                {section.label}
              </p>
              <h2 className="text-4xl font-bold mb-3 leading-tight" style={{ color: palette.primary }}>
                {section.title}
              </h2>
              {section.subtitle && (
                <p className="text-xl mb-4" style={{ color: palette.secondary, opacity: 0.9 }}>
                  {section.subtitle}
                </p>
              )}
              <div className="w-16 h-1 rounded-full" style={{ backgroundColor: palette.secondary }} />
            </div>
          )}

          {/* Top image */}
          {isFirstPage && renderImage("top")}

          {/* Body text */}
          <div className="flex-1 space-y-4 text-base leading-relaxed">
            {paragraphs.map((para, idx) => (
              <p key={idx}>{para}</p>
            ))}
          </div>

          {/* Bottom image */}
          {renderImage("bottom")}
        </div>
      </PageFrame>
    );
  }

  return null;
};
