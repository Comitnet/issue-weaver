import { Magazine } from "@/types/magazine";
import { Card } from "@/components/ui/card";

interface ContentsPagePreviewProps {
  magazine: Magazine;
}

export const ContentsPagePreview = ({ magazine }: ContentsPagePreviewProps) => {
  const palette = magazine.colorPalette || {
    primary: "#1e293b",
    secondary: "#f59e0b",
    background: "#ffffff",
    text: "#0f172a",
  };

  return (
    <Card
      className="w-full aspect-[210/297] overflow-hidden shadow-2xl"
      style={{ backgroundColor: palette.background, color: palette.text }}
    >
      <div className="h-full flex flex-col p-8">
        <div className="mb-6">
          <h2
            className="text-3xl font-bold mb-2"
            style={{ color: palette.primary }}
          >
            Contents
          </h2>
          <div
            className="w-12 h-1 rounded-full"
            style={{ backgroundColor: palette.secondary }}
          />
        </div>

        <div className="space-y-4 flex-1">
          {magazine.sections.map((section, index) => (
            <div 
              key={section.id} 
              className="flex gap-4 items-start pb-4 border-b-2" 
              style={{ borderColor: palette.primary, opacity: 0.2 }}
            >
              <span
                className="text-2xl font-bold flex-shrink-0"
                style={{ color: palette.secondary }}
              >
                {String(index + 2).padStart(2, "0")}
              </span>
              <div className="flex-1 min-w-0">
                <p
                  className="text-xs uppercase tracking-wider mb-1.5 font-bold"
                  style={{ color: palette.secondary }}
                >
                  {section.label}
                </p>
                <p className="font-bold text-lg leading-tight mb-1" style={{ color: palette.primary }}>
                  {section.title}
                </p>
                {section.subtitle && (
                  <p className="text-sm" style={{ color: palette.text, opacity: 0.8 }}>
                    {section.subtitle}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};
