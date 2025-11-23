import { Magazine, Section } from "@/types/magazine";
import { Card } from "@/components/ui/card";

interface SectionPagePreviewProps {
  magazine: Magazine;
  section: Section;
}

export const SectionPagePreview = ({ magazine, section }: SectionPagePreviewProps) => {
  const palette = magazine.colorPalette || {
    primary: "#1e293b",
    secondary: "#f59e0b",
    background: "#ffffff",
    text: "#0f172a",
  };

  const placement = section.heroImagePlacement || "top";
  const size = section.heroImageSize || "medium";
  const alignment = section.heroImageAlignment || "center";
  const wrapText = section.wrapTextAroundImage || false;

  const getSizeStyles = () => {
    if (size === "small") return { width: "30%", minWidth: "200px" };
    if (size === "large") return { width: "65%", minWidth: "400px" };
    return { width: "45%", minWidth: "300px" }; // medium
  };

  const getFloatStyles = () => {
    const baseStyles = getSizeStyles();
    if (placement !== "middle" || !wrapText) {
      return { ...baseStyles, display: "block", margin: "0 auto 1rem auto" };
    }
    
    if (alignment === "left") {
      return { ...baseStyles, float: "left" as const, marginRight: "1.5rem", marginBottom: "1rem" };
    }
    if (alignment === "right") {
      return { ...baseStyles, float: "right" as const, marginLeft: "1.5rem", marginBottom: "1rem" };
    }
    return { ...baseStyles, display: "block", margin: "0 auto 1rem auto" };
  };

  const renderTopImage = () => {
    if (!section.heroImageUrl || placement !== "top") return null;
    return (
      <div className="w-full h-[40%] overflow-hidden print:page-break-inside-avoid">
        <img
          src={section.heroImageUrl}
          alt={section.heroImageAlt || section.title}
          className="w-full h-full object-cover"
        />
      </div>
    );
  };

  const renderBottomImage = () => {
    if (!section.heroImageUrl || placement !== "bottom") return null;
    return (
      <div className="w-full mt-6 print:page-break-inside-avoid">
        <img
          src={section.heroImageUrl}
          alt={section.heroImageAlt || section.title}
          className="w-full h-auto max-h-[300px] object-cover"
        />
      </div>
    );
  };

  const renderMiddleImage = () => {
    if (!section.heroImageUrl || placement !== "middle") return null;
    const styles = getFloatStyles();
    return (
      <img
        src={section.heroImageUrl}
        alt={section.heroImageAlt || section.title}
        style={styles}
        className="object-cover rounded print:page-break-inside-avoid"
      />
    );
  };

  // Split paragraphs for middle placement
  const paragraphs = section.bodyMarkdown.split('\n\n').filter(p => p.trim());
  const insertImageAfter = placement === "middle" ? Math.min(1, Math.floor(paragraphs.length / 3)) : -1;

  return (
    <Card
      className="w-full aspect-[210/297] overflow-visible shadow-2xl print:shadow-none print:overflow-visible"
      style={{ backgroundColor: palette.background }}
    >
      <div className="h-full flex flex-col print:h-auto print:min-h-full">
        {renderTopImage()}
        
        <div className="flex-1 p-8 print:p-12 print:overflow-visible">
          <div
            className="text-xs uppercase tracking-widest font-bold mb-3"
            style={{ color: palette.secondary }}
          >
            {section.label}
          </div>
          
          <h1
            className="text-3xl font-bold mb-3 leading-tight print:text-4xl"
            style={{ color: palette.primary }}
          >
            {section.title}
          </h1>
          
          {section.subtitle && (
            <p className="text-base mb-4 print:text-lg" style={{ color: palette.text, opacity: 0.85 }}>
              {section.subtitle}
            </p>
          )}

          {section.pullQuote && (
            <div
              className="my-6 pl-4 border-l-4 italic text-lg print:text-xl print:my-8"
              style={{ borderColor: palette.secondary, color: palette.primary }}
            >
              "{section.pullQuote}"
            </div>
          )}
          
          <div className="prose prose-sm max-w-none print:prose-base" style={{ color: palette.text }}>
            {paragraphs.map((paragraph, idx) => (
              <div key={idx}>
                {idx === insertImageAfter && renderMiddleImage()}
                <p className="mb-3 leading-relaxed text-sm print:text-base print:mb-4 print:leading-relaxed">
                  {paragraph.replace(/[#*_]/g, "")}
                </p>
              </div>
            ))}
          </div>

          {section.keyPoints.length > 0 && (
            <div className="mt-6 print:mt-8 clear-both">
              <h3 className="text-sm font-bold mb-3 print:text-base" style={{ color: palette.primary }}>
                Key Points
              </h3>
              <ul className="space-y-2">
                {section.keyPoints.map((point, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-sm print:text-base">
                    <span
                      className="w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0"
                      style={{ backgroundColor: palette.secondary }}
                    />
                    <span style={{ color: palette.text }}>{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {renderBottomImage()}
        </div>
      </div>
    </Card>
  );
};
