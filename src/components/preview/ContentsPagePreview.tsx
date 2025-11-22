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
      <div className="h-full flex flex-col p-12">
        <div className="mb-8">
          <h2
            className="text-4xl font-bold mb-3"
            style={{ color: palette.primary }}
          >
            Contents
          </h2>
          <div
            className="w-16 h-1.5 rounded-full"
            style={{ backgroundColor: palette.secondary }}
          />
        </div>

        <div className="space-y-6 flex-1 overflow-y-auto">
          {magazine.sections.map((section, index) => (
            <div key={section.id} className="flex gap-6 items-start pb-4 border-b" style={{ borderColor: palette.text, opacity: 0.1 }}>
              <span
                className="text-2xl font-bold flex-shrink-0"
                style={{ color: palette.secondary }}
              >
                {String(index + 2).padStart(2, "0")}
              </span>
              <div className="flex-1 min-w-0">
                <p
                  className="text-xs uppercase tracking-wider mb-2 font-semibold"
                  style={{ color: palette.secondary }}
                >
                  {section.label}
                </p>
                <p className="font-bold text-lg leading-tight mb-1" style={{ color: palette.primary }}>
                  {section.title}
                </p>
                {section.subtitle && (
                  <p className="text-sm opacity-70">{section.subtitle}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};
