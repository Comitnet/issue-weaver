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

  const position = section.heroImagePosition || "top";
  const size = section.heroImageSize || "medium";
  const align = section.heroImageAlign || "center";

  const getSizeClass = () => {
    if (size === "small") return "w-48 h-32";
    if (size === "large") return "w-96 h-64";
    return "w-72 h-48"; // medium
  };

  const getAlignClass = () => {
    if (align === "left") return "float-left mr-4 mb-2";
    if (align === "right") return "float-right ml-4 mb-2";
    return "mx-auto block mb-4";
  };

  const renderImage = () => {
    if (!section.heroImageUrl) return null;

    if (position === "top") {
      return (
        <div className="w-full h-[40%] overflow-hidden">
          <img
            src={section.heroImageUrl}
            alt={section.heroImageAlt || section.title}
            className="w-full h-full object-cover"
          />
        </div>
      );
    }

    if (position === "bottom") {
      return (
        <div className="w-full h-[35%] overflow-hidden mt-4">
          <img
            src={section.heroImageUrl}
            alt={section.heroImageAlt || section.title}
            className="w-full h-full object-cover"
          />
        </div>
      );
    }

    // Middle position with wrapping
    return (
      <img
        src={section.heroImageUrl}
        alt={section.heroImageAlt || section.title}
        className={`${getSizeClass()} ${getAlignClass()} object-cover rounded`}
      />
    );
  };

  return (
    <Card
      className="w-full aspect-[210/297] overflow-hidden shadow-2xl print:shadow-none"
      style={{ backgroundColor: palette.background }}
    >
      <div className="h-full flex flex-col">
        {position === "top" && renderImage()}
        
        <div className="flex-1 p-6 overflow-hidden">
          <div
            className="text-[10px] uppercase tracking-wider font-semibold mb-2"
            style={{ color: palette.secondary }}
          >
            {section.label}
          </div>
          
          <h1
            className="text-2xl font-bold mb-2 leading-tight"
            style={{ color: palette.primary }}
          >
            {section.title}
          </h1>
          
          {section.subtitle && (
            <p className="text-sm mb-3" style={{ color: palette.text, opacity: 0.8 }}>
              {section.subtitle}
            </p>
          )}

          {section.pullQuote && (
            <div
              className="my-4 pl-3 border-l-4 italic text-base"
              style={{ borderColor: palette.secondary, color: palette.primary }}
            >
              "{section.pullQuote}"
            </div>
          )}

          {position === "middle" && renderImage()}
          
          <div className="prose prose-sm max-w-none" style={{ color: palette.text }}>
            {section.bodyMarkdown.split('\n\n').map((paragraph, idx) => (
              <p key={idx} className="mb-2 leading-relaxed text-xs">
                {paragraph.replace(/[#*_]/g, "")}
              </p>
            ))}
          </div>

          {section.keyPoints.length > 0 && (
            <div className="mt-4">
              <h3 className="text-xs font-bold mb-2" style={{ color: palette.primary }}>
                Key Points
              </h3>
              <ul className="space-y-1.5">
                {section.keyPoints.map((point, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-xs">
                    <span
                      className="w-1 h-1 rounded-full mt-1.5 flex-shrink-0"
                      style={{ backgroundColor: palette.secondary }}
                    />
                    <span style={{ color: palette.text }}>{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {position === "bottom" && renderImage()}
        </div>
      </div>
    </Card>
  );
};
