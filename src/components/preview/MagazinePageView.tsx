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

  if (page.kind === "cover") {
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
              color: magazine.coverTextColor || (magazine.coverImageStyle === "full-bleed" ? "#ffffff" : palette.text),
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
                  <p 
                    className="text-xs uppercase tracking-wider opacity-75"
                    style={{ color: magazine.coverAccentColor || (magazine.coverImageStyle === "full-bleed" ? "#ffffff" : palette.secondary) }}
                  >
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
                <p 
                  className="text-lg uppercase tracking-wider opacity-75"
                  style={{ color: magazine.coverAccentColor || (magazine.coverImageStyle === "full-bleed" ? "#ffffff" : palette.secondary) }}
                >
                  {magazine.tagline}
                </p>
              )}
            </div>

            {/* Footer */}
            <div className="space-y-3">
              {magazine.themeTitle && (
                <div>
                  <p 
                    className="text-xs uppercase tracking-widest mb-1 opacity-75"
                    style={{ color: magazine.coverAccentColor || (magazine.coverImageStyle === "full-bleed" ? "#ffffff" : palette.secondary) }}
                  >
                    This Issue
                  </p>
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

  if (page.kind === "contents") {
    // Note: We need access to all pages to find the correct page numbers for each section
    // This is a simplified version - you may need to pass pages array as a prop
    return (
      <PageFrame>
        <div
          className="h-full flex flex-col p-12"
          style={{ backgroundColor: palette.background, color: palette.text }}
        >
          <div className="mb-6">
            <h2 className="text-5xl font-bold mb-3" style={{ color: palette.primary }}>
              Contents
            </h2>
            <div className="w-20 h-1.5 rounded-full" style={{ backgroundColor: palette.secondary }} />
          </div>

          <div className="space-y-4 flex-1 overflow-hidden">
            {magazine.sections.map((section, index) => {
              // Fallback: assuming sequential page numbering starting at page 2
              // Ideally, this should look up the actual first page for this section
              const sectionPageNumber = index + 2;
              
              return (
                <div
                  key={section.id}
                  className="flex gap-4 items-start pb-3 border-b"
                  style={{ borderColor: `${palette.primary}25` }}
                >
                  <span
                    className="text-2xl font-bold flex-shrink-0 leading-none"
                    style={{ color: palette.primary }}
                  >
                    {String(sectionPageNumber).padStart(2, "0")}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p
                      className="text-xs uppercase tracking-widest mb-1.5 font-bold"
                      style={{ color: palette.secondary }}
                    >
                      {section.label}
                    </p>
                    <h3 className="font-bold text-lg leading-tight mb-1" style={{ color: palette.text }}>
                      {section.title}
                    </h3>
                    {section.subtitle && (
                      <p className="text-sm leading-snug" style={{ color: palette.secondary, opacity: 0.9 }}>
                        {section.subtitle}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </PageFrame>
    );
  }

  if (page.kind === "article" && page.article) {
    const { section, paragraphs, isContinuation, pageWithinSection, showKeyPoints, showPullQuote } = page.article;
    const isFirstPage = !isContinuation;
    const isFromEditor = section.label.toUpperCase() === "FROM THE EDITOR";

    // Handle advertisement sections (no page numbers or watermarks)
    if (section.kind === "advertisement") {
      const adLayout = section.adLayout || "full-page";
      
      if (adLayout === "full-page") {
        return (
          <PageFrame>
            <div className="relative h-full flex flex-col" style={{ backgroundColor: palette.background }}>
              {section.adImageUrl && (
                <img
                  src={section.adImageUrl}
                  alt={section.adAltText || "Advertisement"}
                  className="w-full h-full object-cover"
                />
              )}
              <div className="absolute inset-0 flex flex-col justify-end p-12 bg-gradient-to-t from-black/60 to-transparent">
                {section.adHeadline && (
                  <h2 className="text-4xl font-bold text-white mb-2">{section.adHeadline}</h2>
                )}
                {section.adBody && (
                  <p className="text-lg text-white/90 mb-4">{section.adBody}</p>
                )}
                {section.adCallToAction && (
                  <p className="text-sm font-bold text-white uppercase tracking-wider">{section.adCallToAction}</p>
                )}
                <p className="text-xs text-white/60 mt-6 uppercase tracking-widest">Advertisement</p>
              </div>
            </div>
          </PageFrame>
        );
      }

      if (adLayout === "half-top" || adLayout === "half-bottom") {
        const isTop = adLayout === "half-top";
        return (
          <PageFrame>
            <div className="h-full flex flex-col" style={{ backgroundColor: palette.background }}>
              {isTop && (
                <div className="relative h-1/2 flex flex-col justify-end p-8 bg-muted">
                  {section.adImageUrl ? (
                    <>
                      <img
                        src={section.adImageUrl}
                        alt={section.adAltText || "Advertisement"}
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                      <div className="relative z-10">
                        {section.adHeadline && (
                          <h3 className="text-2xl font-bold text-white mb-1">{section.adHeadline}</h3>
                        )}
                        {section.adBody && (
                          <p className="text-sm text-white/90">{section.adBody}</p>
                        )}
                        {section.adCallToAction && (
                          <p className="text-xs font-bold text-white uppercase tracking-wider mt-2">{section.adCallToAction}</p>
                        )}
                      </div>
                    </>
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <p className="text-muted-foreground text-center">Advertisement placeholder</p>
                    </div>
                  )}
                </div>
              )}
              <div className="h-1/2 flex items-center justify-center" style={{ backgroundColor: palette.background }}>
                <p className="text-muted-foreground text-center">Content space</p>
              </div>
              {!isTop && (
                <div className="relative h-1/2 flex flex-col justify-end p-8 bg-muted">
                  {section.adImageUrl ? (
                    <>
                      <img
                        src={section.adImageUrl}
                        alt={section.adAltText || "Advertisement"}
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                      <div className="relative z-10">
                        {section.adHeadline && (
                          <h3 className="text-2xl font-bold text-white mb-1">{section.adHeadline}</h3>
                        )}
                        {section.adBody && (
                          <p className="text-sm text-white/90">{section.adBody}</p>
                        )}
                        {section.adCallToAction && (
                          <p className="text-xs font-bold text-white uppercase tracking-wider mt-2">{section.adCallToAction}</p>
                        )}
                      </div>
                    </>
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <p className="text-muted-foreground text-center">Advertisement placeholder</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </PageFrame>
        );
      }
    }

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

    const columnCount = section.columnCount || 1;
    const columnClass =
      columnCount === 1
        ? "columns-1"
        : columnCount === 2
        ? "columns-2 gap-8"
        : "columns-3 gap-6";

    // Special handling for "FROM THE EDITOR" section
    if (isFromEditor) {
      const isOddPage = page.pageNumber % 2 === 1;
      const shouldShowWatermark = magazine.publisherLogoUrl;

      return (
        <PageFrame>
          <div className="relative w-full h-full overflow-hidden">
            {/* Background image for FROM THE EDITOR */}
            {section.heroImageUrl && (
              <>
                <img
                  src={section.heroImageUrl}
                  alt={section.heroImageAlt || section.title}
                  className="absolute inset-0 w-full h-full object-cover z-0"
                />
                <div className="absolute inset-0 z-10 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />
              </>
            )}

            {/* Content */}
            <div
              className="relative z-20 h-full flex flex-col p-12"
              style={{ color: section.heroImageUrl ? "#ffffff" : palette.text }}
            >
              {/* Header - only on page 1 */}
              {pageWithinSection === 1 && (
                <div className="mb-6 flex-shrink-0">
                  <p
                    className="text-xs uppercase tracking-widest mb-2 font-bold"
                    style={{ color: section.heroImageUrl ? "#ffffff" : palette.secondary, opacity: 0.9 }}
                  >
                    {section.label}
                  </p>
                  <h2 className="text-4xl font-bold mb-2 leading-tight">
                    {section.title}
                  </h2>
                  {section.subtitle && (
                    <p className="text-lg mb-3" style={{ opacity: 0.9 }}>
                      {section.subtitle}
                    </p>
                  )}
                  <div className="w-16 h-1 rounded-full" style={{ backgroundColor: section.heroImageUrl ? "#ffffff" : palette.secondary }} />
                </div>
              )}

              {/* Page 1: Body text - all content must fit on one page */}
              {pageWithinSection === 1 && paragraphs.length > 0 && (
                <div className={`flex-1 ${columnClass} text-sm leading-relaxed overflow-hidden`}>
                  {paragraphs.map((para, idx) => (
                    <p key={idx} className="mb-3 break-inside-avoid text-justify">
                      {para}
                    </p>
                  ))}
                </div>
              )}

              {/* Page 2: Key Points and Pull Quote */}
              {pageWithinSection === 2 && (
                <div className="flex-1 flex flex-col justify-center space-y-8">
                  {section.keyPoints && section.keyPoints.length > 0 && (
                    <div className="p-6 rounded-lg" style={{ 
                      backgroundColor: section.heroImageUrl ? "rgba(255,255,255,0.15)" : `${palette.primary}08`,
                      borderLeft: `4px solid ${section.heroImageUrl ? "#ffffff" : palette.secondary}`
                    }}>
                      <h3 className="text-xl font-bold uppercase tracking-wider mb-4">
                        Key Points
                      </h3>
                      <ul className="space-y-3">
                        {section.keyPoints.map((point, idx) => (
                          <li key={idx} className="text-lg flex items-start gap-3">
                            <span style={{ color: section.heroImageUrl ? "#ffffff" : palette.secondary }}>•</span>
                            <span>{point}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {section.pullQuote && (
                    <div className="p-8 rounded-lg" style={{ 
                      backgroundColor: section.heroImageUrl ? "rgba(255,255,255,0.15)" : `${palette.secondary}10`,
                      borderLeft: `4px solid ${section.heroImageUrl ? "#ffffff" : palette.primary}`
                    }}>
                      <p className="text-2xl italic font-medium leading-relaxed">
                        "{section.pullQuote}"
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Page number footer */}
              <footer className="h-8 flex items-center text-xs mt-4" style={{ color: section.heroImageUrl ? "rgba(255,255,255,0.5)" : `${palette.text}80` }}>
                {isOddPage ? (
                  <div className="w-full text-left">{page.pageNumber}</div>
                ) : (
                  <div className="w-full text-right">{page.pageNumber}</div>
                )}
              </footer>
            </div>

            {/* Watermark */}
            {shouldShowWatermark && (
              <div
                className={`pointer-events-none absolute bottom-6 opacity-20 z-30 ${
                  isOddPage ? "right-8" : "left-8"
                }`}
              >
                <img
                  src={magazine.publisherLogoUrl!}
                  alt={magazine.publisherName || "Publisher logo"}
                  className="h-8 w-auto brightness-0 invert"
                  style={{ filter: section.heroImageUrl ? "brightness(0) invert(1)" : "none" }}
                />
              </div>
            )}
          </div>
        </PageFrame>
      );
    }

    // Regular article rendering
    const isOddPage = page.pageNumber % 2 === 1;
    const shouldShowWatermark = magazine.publisherLogoUrl && section.kind !== "advertisement";

    return (
      <PageFrame>
        <div className="relative w-full h-full">
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

            {/* Continuation page header */}
            {!isFirstPage && (
              <div className="mb-6 pb-2 border-b" style={{ borderColor: `${palette.primary}25` }}>
                <p className="text-xs uppercase tracking-wider" style={{ color: palette.secondary }}>
                  {section.label} • Page {pageWithinSection}
                </p>
              </div>
            )}

            {/* Top image */}
            {isFirstPage && renderImage("top")}

            {/* Key Points and Pull Quote at top of second page */}
            {!isFirstPage && pageWithinSection === 2 && (
              <>
                {/* Determine order when both are at the same location */}
                {(() => {
                  const keyPointsAtTop = section.keyPointsPlacement === "second-page-top" && showKeyPoints && section.keyPoints && section.keyPoints.length > 0;
                  const pullQuoteAtTop = section.pullQuotePlacement === "second-page-top" && showPullQuote && section.pullQuote;
                  const keyPointsFirst = section.keyPointsFirst !== false;

                  const keyPointsElement = keyPointsAtTop && (
                    <div className="mb-6 p-4 rounded-lg border-l-4" style={{ 
                      backgroundColor: `${palette.primary}08`,
                      borderColor: palette.secondary 
                    }}>
                      <h3 className="text-sm font-bold uppercase tracking-wider mb-3" style={{ color: palette.primary }}>
                        Key Points
                      </h3>
                      <ul className="space-y-2">
                        {section.keyPoints.map((point, idx) => (
                          <li key={idx} className="text-sm flex items-start gap-2">
                            <span style={{ color: palette.secondary }}>•</span>
                            <span>{point}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  );

                  const pullQuoteElement = pullQuoteAtTop && (
                    <div className="mb-6 p-6 border-l-4" style={{ 
                      backgroundColor: `${palette.secondary}10`,
                      borderColor: palette.primary 
                    }}>
                      <p className="text-lg italic font-medium leading-relaxed" style={{ color: palette.text }}>
                        "{section.pullQuote}"
                      </p>
                    </div>
                  );

                  if (keyPointsFirst) {
                    return <>{keyPointsElement}{pullQuoteElement}</>;
                  } else {
                    return <>{pullQuoteElement}{keyPointsElement}</>;
                  }
                })()}
              </>
            )}

            {/* Body text with columns */}
            <div className={`flex-1 text-base leading-relaxed ${columnClass} overflow-visible`}>
              {paragraphs.map((para, idx) => (
                <p key={idx} className="mb-4 break-inside-avoid text-justify">
                  {para}
                </p>
              ))}
            </div>

            {/* Key Points and Pull Quote at end of page */}
            {(() => {
              const showKeyPointsAtEnd = showKeyPoints && section.keyPoints && section.keyPoints.length > 0 && 
                ((isFirstPage && section.keyPointsPlacement === "first-page-end") || 
                 (pageWithinSection === 2 && section.keyPointsPlacement === "second-page-end"));
              
              const showPullQuoteAtEnd = showPullQuote && section.pullQuote && 
                ((isFirstPage && section.pullQuotePlacement === "first-page-end") || 
                 (pageWithinSection === 2 && section.pullQuotePlacement === "second-page-end"));
              
              const keyPointsFirst = section.keyPointsFirst !== false;

              const keyPointsElement = showKeyPointsAtEnd && (
                <div className="mt-6 p-4 rounded-lg border-l-4" style={{ 
                  backgroundColor: `${palette.primary}08`,
                  borderColor: palette.secondary 
                }}>
                  <h3 className="text-sm font-bold uppercase tracking-wider mb-3" style={{ color: palette.primary }}>
                    Key Points
                  </h3>
                  <ul className="space-y-2">
                    {section.keyPoints.map((point, idx) => (
                      <li key={idx} className="text-sm flex items-start gap-2">
                        <span style={{ color: palette.secondary }}>•</span>
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              );

              const pullQuoteElement = showPullQuoteAtEnd && (
                <div className="mt-6 p-6 border-l-4" style={{ 
                  backgroundColor: `${palette.secondary}10`,
                  borderColor: palette.primary 
                }}>
                  <p className="text-lg italic font-medium leading-relaxed" style={{ color: palette.text }}>
                    "{section.pullQuote}"
                  </p>
                </div>
              );

              if (keyPointsFirst) {
                return <>{keyPointsElement}{pullQuoteElement}</>;
              } else {
                return <>{pullQuoteElement}{keyPointsElement}</>;
              }
            })()}

            {/* Bottom image */}
            {renderImage("bottom")}

            {/* Page number footer - article pages only */}
            <footer className="h-8 flex items-center text-xs mt-4" style={{ color: `${palette.text}80` }}>
              {isOddPage ? (
                <div className="w-full text-left">{page.pageNumber}</div>
              ) : (
                <div className="w-full text-right">{page.pageNumber}</div>
              )}
            </footer>
          </div>

          {/* Watermark - publisher logo */}
          {shouldShowWatermark && (
            <div
              className={`pointer-events-none absolute bottom-6 opacity-20 ${
                isOddPage ? "right-8" : "left-8"
              }`}
            >
              <img
                src={magazine.publisherLogoUrl!}
                alt={magazine.publisherName || "Publisher logo"}
                className="h-8 w-auto"
              />
            </div>
          )}
        </div>
      </PageFrame>
    );
  }

  return null;
};
