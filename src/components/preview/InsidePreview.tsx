import { Magazine } from "@/types/magazine";
import { Card } from "@/components/ui/card";

interface InsidePreviewProps {
  magazine: Magazine;
}

export const InsidePreview = ({ magazine }: InsidePreviewProps) => {
  const palette = magazine.colorPalette || {
    primary: "#1e293b",
    secondary: "#f59e0b",
    background: "#ffffff",
    text: "#0f172a",
  };

  const featuredSection = magazine.sections[0];

  return (
    <div className="w-full aspect-[3/2] flex gap-1 shadow-2xl">
      {/* Left Page - Contents */}
      <Card
        className="flex-1 p-8 overflow-hidden"
        style={{ backgroundColor: palette.background, color: palette.text }}
      >
        <div className="h-full flex flex-col">
          <div className="mb-6">
            <h2
              className="text-2xl font-bold mb-1"
              style={{ color: palette.primary }}
            >
              Contents
            </h2>
            <div
              className="w-12 h-1 rounded-full"
              style={{ backgroundColor: palette.secondary }}
            />
          </div>

          <div className="space-y-4 flex-1 overflow-y-auto">
            {magazine.sections.map((section, index) => (
              <div key={section.id} className="flex gap-4 items-start">
                <span
                  className="text-sm font-bold flex-shrink-0"
                  style={{ color: palette.secondary }}
                >
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div className="flex-1 min-w-0">
                  <p
                    className="text-xs uppercase tracking-wider mb-1 font-semibold"
                    style={{ color: palette.secondary }}
                  >
                    {section.label}
                  </p>
                  <p className="font-semibold text-sm leading-tight">{section.title}</p>
                  {section.subtitle && (
                    <p className="text-xs opacity-70 mt-1">{section.subtitle}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Right Page - Featured Section */}
      <Card
        className="flex-1 overflow-hidden relative"
        style={{ backgroundColor: palette.background }}
      >
        {featuredSection?.heroImageUrl && (
          <div className="h-1/2 w-full overflow-hidden">
            <img
              src={featuredSection.heroImageUrl}
              alt={featuredSection.heroImageAlt || featuredSection.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}
        
        <div className="p-8 h-1/2 flex flex-col">
          {featuredSection && (
            <>
              <div
                className="text-xs uppercase tracking-wider font-semibold mb-2"
                style={{ color: palette.secondary }}
              >
                {featuredSection.label}
              </div>
              <h3
                className="text-2xl font-bold mb-2 leading-tight"
                style={{ color: palette.primary }}
              >
                {featuredSection.title}
              </h3>
              {featuredSection.subtitle && (
                <p className="text-sm mb-4" style={{ color: palette.text, opacity: 0.8 }}>
                  {featuredSection.subtitle}
                </p>
              )}
              <p className="text-xs leading-relaxed line-clamp-4" style={{ color: palette.text, opacity: 0.7 }}>
                {featuredSection.bodyMarkdown.replace(/[#*_]/g, "").slice(0, 200)}...
              </p>
            </>
          )}
        </div>
      </Card>
    </div>
  );
};
