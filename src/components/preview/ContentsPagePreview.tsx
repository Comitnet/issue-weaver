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
      className="w-full aspect-[210/297] overflow-hidden shadow-2xl print:shadow-none"
      style={{ backgroundColor: palette.background, color: palette.text }}
    >
      <div className="h-full flex flex-col p-12">
        <div className="mb-8">
          <h2
            className="text-5xl font-bold mb-4"
            style={{ color: palette.primary }}
          >
            Contents
          </h2>
          <div
            className="w-20 h-1.5 rounded-full"
            style={{ backgroundColor: palette.secondary }}
          />
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
                {String(index + 2).padStart(2, "0")}
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
    </Card>
  );
};
