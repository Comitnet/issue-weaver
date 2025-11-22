import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Section } from "@/types/magazine";
import { Plus, Trash2, GripVertical, BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";

interface SectionListProps {
  sections: Section[];
  selectedSectionId?: string;
  onSelectSection: (sectionId: string) => void;
  onAddSection: () => void;
  onDeleteSection: (sectionId: string) => void;
  onSelectCover: () => void;
  isCoverSelected: boolean;
}

export const SectionList = ({
  sections,
  selectedSectionId,
  onSelectSection,
  onAddSection,
  onDeleteSection,
  onSelectCover,
  isCoverSelected,
}: SectionListProps) => {
  return (
    <div className="flex h-full flex-col border-r border-border bg-muted/30">
      <div className="border-b border-border p-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold text-foreground">Content</h2>
          <span className="text-xs text-muted-foreground">{sections.length + 1}</span>
        </div>
        <Button onClick={onAddSection} className="w-full" size="sm">
          <Plus className="mr-2 h-4 w-4" />
          Add Section
        </Button>
      </div>
      
      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {/* Cover Page Item */}
        <Card
          className={cn(
            "p-3 cursor-pointer transition-colors hover:bg-accent/50",
            isCoverSelected && "bg-accent border-accent-foreground/20"
          )}
          onClick={onSelectCover}
        >
          <div className="flex items-start gap-2">
            <BookOpen className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm">Cover Page</p>
              <p className="text-xs text-muted-foreground">Edit magazine cover</p>
            </div>
          </div>
        </Card>

        {sections.map((section) => (
          <Card
            key={section.id}
            className={cn(
              "p-3 cursor-pointer transition-colors hover:bg-accent/50",
              selectedSectionId === section.id && "bg-accent border-accent-foreground/20"
            )}
            onClick={() => onSelectSection(section.id)}
          >
            <div className="flex items-start gap-2">
              <GripVertical className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-accent-foreground bg-accent px-1.5 py-0.5 rounded">
                    {section.label}
                  </span>
                </div>
                <p className="font-medium text-sm mt-1 truncate">{section.title}</p>
                {section.subtitle && (
                  <p className="text-xs text-muted-foreground truncate">{section.subtitle}</p>
                )}
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 flex-shrink-0"
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteSection(section.id);
                }}
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
