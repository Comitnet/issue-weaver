import { Magazine } from "@/types/magazine";
import { Card } from "@/components/ui/card";
import { format } from "date-fns";

interface CoverPreviewProps {
  magazine: Magazine;
}

export const CoverPreview = ({ magazine }: CoverPreviewProps) => {
  const palette = magazine.colorPalette || {
    primary: "#1e293b",
    secondary: "#f59e0b",
    background: "#ffffff",
    text: "#0f172a",
  };

  return (
    <Card
      className="w-full aspect-[210/297] overflow-hidden shadow-2xl"
      style={{
        backgroundColor: palette.primary,
        color: palette.background,
      }}
    >
      <div className="h-full flex flex-col p-8 relative">
        {/* Publisher Logo */}
        {magazine.publisherLogoUrl && (
          <div className="mb-6">
            <img
              src={magazine.publisherLogoUrl}
              alt={magazine.publisherName}
              className="h-8 object-contain"
            />
          </div>
        )}

        {/* Header */}
        <div className="mb-auto">
          {magazine.issueLabel && (
            <p className="text-xs uppercase tracking-wider opacity-80 mb-2">
              {magazine.issueLabel}
            </p>
          )}
          {magazine.themeTitle && (
            <div
              className="inline-block px-3 py-1 text-xs font-semibold rounded mb-4"
              style={{ backgroundColor: palette.secondary, color: palette.background }}
            >
              {magazine.themeTitle}
            </div>
          )}
        </div>

        {/* Main Title */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold leading-tight">{magazine.title}</h1>
          {magazine.subtitle && (
            <p className="text-base opacity-90">{magazine.subtitle}</p>
          )}
          {magazine.tagline && (
            <p className="text-xs uppercase tracking-wide opacity-70">{magazine.tagline}</p>
          )}
        </div>

        {/* Cover Lines - Key Points */}
        {magazine.sections.filter(s => s.showOnCover).length > 0 && (
          <div className="mt-8 space-y-2 border-t pt-4" style={{ borderColor: palette.secondary }}>
            {magazine.sections.filter(s => s.showOnCover).map((section) => (
              <div key={section.id} className="flex items-center gap-2">
                <div
                  className="w-1 h-1 rounded-full flex-shrink-0"
                  style={{ backgroundColor: palette.secondary }}
                />
                <p className="text-xs uppercase tracking-wide opacity-80 truncate">
                  {section.title}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="mt-6 text-xs opacity-70">
          <p>Issue {magazine.issueNumber}</p>
          <p>{format(new Date(magazine.publicationDate), 'MMMM dd, yyyy')}</p>
        </div>
      </div>
    </Card>
  );
};
