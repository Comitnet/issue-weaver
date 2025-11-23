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

  const coverStyle = magazine.coverImageStyle || "none";
  const hasImage = !!magazine.coverImageUrl;

  // Full-bleed style
  if (coverStyle === "full-bleed" && hasImage) {
    return (
      <Card
        className="w-full aspect-[210/297] overflow-hidden shadow-2xl relative"
        style={{
          backgroundImage: `url(${magazine.coverImageUrl})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div 
          className="absolute inset-0"
          style={{
            backgroundColor: palette.primary,
            opacity: 0.75,
          }}
        />
        <div className="h-full flex flex-col p-8 relative z-10" style={{ color: palette.background }}>
          {/* Publisher Logo */}
          {magazine.publisherLogoUrl && (
            <div className="mb-6">
              <img
                src={magazine.publisherLogoUrl}
                alt={magazine.publisherName}
                className="h-8 object-contain brightness-0 invert"
              />
            </div>
          )}

          {/* Header */}
          <div className="mb-auto">
            {magazine.issueLabel && (
              <p className="text-xs uppercase tracking-wider opacity-90 mb-2">
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
              <p className="text-xs uppercase tracking-wide opacity-80">{magazine.tagline}</p>
            )}
          </div>

          {/* Cover Lines */}
          {magazine.sections.filter(s => s.showOnCover).length > 0 && (
            <div className="mt-8 space-y-2 border-t pt-4" style={{ borderColor: palette.secondary }}>
              {magazine.sections.filter(s => s.showOnCover).map((section) => (
                <div key={section.id} className="flex items-center gap-2">
                  <div
                    className="w-1 h-1 rounded-full flex-shrink-0"
                    style={{ backgroundColor: palette.secondary }}
                  />
                  <p className="text-xs uppercase tracking-wide opacity-90 truncate">
                    {section.title}
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* Footer */}
          <div className="mt-6 text-xs opacity-80">
            <p>Issue {magazine.issueNumber}</p>
            <p>{format(new Date(magazine.publicationDate), 'MMMM dd, yyyy')}</p>
          </div>
        </div>
      </Card>
    );
  }

  // Banner style
  if (coverStyle === "banner" && hasImage) {
    return (
      <Card
        className="w-full aspect-[210/297] overflow-hidden shadow-2xl"
        style={{ backgroundColor: palette.primary }}
      >
        <div className="h-full flex flex-col">
          <div className="h-[35%] w-full overflow-hidden">
            <img
              src={magazine.coverImageUrl}
              alt="Cover banner"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1 flex flex-col p-8" style={{ color: palette.background }}>
            {/* Publisher Logo */}
            {magazine.publisherLogoUrl && (
              <div className="mb-4">
                <img
                  src={magazine.publisherLogoUrl}
                  alt={magazine.publisherName}
                  className="h-8 object-contain brightness-0 invert"
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

            {/* Cover Lines */}
            {magazine.sections.filter(s => s.showOnCover).length > 0 && (
              <div className="mt-6 space-y-2 border-t pt-4" style={{ borderColor: palette.secondary }}>
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
            <div className="mt-4 text-xs opacity-70">
              <p>Issue {magazine.issueNumber}</p>
              <p>{format(new Date(magazine.publicationDate), 'MMMM dd, yyyy')}</p>
            </div>
          </div>
        </div>
      </Card>
    );
  }

  // Default style (no image or "none")
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
