import { Section } from "@/types/magazine";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Plus, X } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";

interface SectionEditorProps {
  section: Section;
  onUpdate: (updates: Partial<Section>) => void;
}

export const SectionEditor = ({ section, onUpdate }: SectionEditorProps) => {
  const addKeyPoint = () => {
    onUpdate({ keyPoints: [...section.keyPoints, ""] });
  };

  const updateKeyPoint = (index: number, value: string) => {
    const newKeyPoints = [...section.keyPoints];
    newKeyPoints[index] = value;
    onUpdate({ keyPoints: newKeyPoints });
  };

  const removeKeyPoint = (index: number) => {
    onUpdate({ keyPoints: section.keyPoints.filter((_, i) => i !== index) });
  };

  return (
    <div className="h-full overflow-y-auto border-r border-border bg-background">
      <div className="p-6 space-y-6">
        <div>
          <h2 className="text-lg font-semibold mb-4">Edit Section</h2>
        </div>

        <div className="space-y-4">
          <div>
            <Label htmlFor="label">Label</Label>
            <Input
              id="label"
              value={section.label}
              onChange={(e) => onUpdate({ label: e.target.value })}
              placeholder="e.g., Feature, Opinion, News"
            />
          </div>

          <div>
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={section.title}
              onChange={(e) => onUpdate({ title: e.target.value })}
              placeholder="Section title"
            />
          </div>

          <div>
            <Label htmlFor="subtitle">Subtitle</Label>
            <Input
              id="subtitle"
              value={section.subtitle || ""}
              onChange={(e) => onUpdate({ subtitle: e.target.value })}
              placeholder="Optional subtitle"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="showOnCover"
              checked={section.showOnCover || false}
              onCheckedChange={(checked) => onUpdate({ showOnCover: checked as boolean })}
            />
            <Label htmlFor="showOnCover" className="cursor-pointer">
              Show this article on cover page
            </Label>
          </div>

          <Card className="p-4 space-y-4 bg-muted/30">
            <h3 className="font-semibold text-sm">Hero Image</h3>
            
            <div>
              <Label htmlFor="heroImage">Image URL</Label>
              <Input
                id="heroImage"
                value={section.heroImageUrl || ""}
                onChange={(e) => onUpdate({ heroImageUrl: e.target.value })}
                placeholder="https://example.com/image.jpg"
              />
            </div>

            <div>
              <Label htmlFor="heroImageAlt">Alt Text</Label>
              <Input
                id="heroImageAlt"
                value={section.heroImageAlt || ""}
                onChange={(e) => onUpdate({ heroImageAlt: e.target.value })}
                placeholder="Describe the image"
              />
            </div>

            <div>
              <Label>Position</Label>
              <div className="flex gap-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name={`position-${section.id}`}
                    value="top"
                    checked={(section.heroImagePosition || "top") === "top"}
                    onChange={(e) => onUpdate({ heroImagePosition: e.target.value as any })}
                    className="cursor-pointer"
                  />
                  <span className="text-sm">Top</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name={`position-${section.id}`}
                    value="middle"
                    checked={section.heroImagePosition === "middle"}
                    onChange={(e) => onUpdate({ heroImagePosition: e.target.value as any })}
                    className="cursor-pointer"
                  />
                  <span className="text-sm">Middle</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name={`position-${section.id}`}
                    value="bottom"
                    checked={section.heroImagePosition === "bottom"}
                    onChange={(e) => onUpdate({ heroImagePosition: e.target.value as any })}
                    className="cursor-pointer"
                  />
                  <span className="text-sm">Bottom</span>
                </label>
              </div>
            </div>

            {section.heroImagePosition === "middle" && (
              <>
                <div>
                  <Label>Size</Label>
                  <div className="flex gap-3">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name={`size-${section.id}`}
                        value="small"
                        checked={(section.heroImageSize || "medium") === "small"}
                        onChange={(e) => onUpdate({ heroImageSize: e.target.value as any })}
                        className="cursor-pointer"
                      />
                      <span className="text-sm">Small</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name={`size-${section.id}`}
                        value="medium"
                        checked={(section.heroImageSize || "medium") === "medium"}
                        onChange={(e) => onUpdate({ heroImageSize: e.target.value as any })}
                        className="cursor-pointer"
                      />
                      <span className="text-sm">Medium</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name={`size-${section.id}`}
                        value="large"
                        checked={section.heroImageSize === "large"}
                        onChange={(e) => onUpdate({ heroImageSize: e.target.value as any })}
                        className="cursor-pointer"
                      />
                      <span className="text-sm">Large</span>
                    </label>
                  </div>
                </div>

                <div>
                  <Label>Align</Label>
                  <div className="flex gap-3">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name={`align-${section.id}`}
                        value="left"
                        checked={(section.heroImageAlign || "center") === "left"}
                        onChange={(e) => onUpdate({ heroImageAlign: e.target.value as any })}
                        className="cursor-pointer"
                      />
                      <span className="text-sm">Left</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name={`align-${section.id}`}
                        value="center"
                        checked={(section.heroImageAlign || "center") === "center"}
                        onChange={(e) => onUpdate({ heroImageAlign: e.target.value as any })}
                        className="cursor-pointer"
                      />
                      <span className="text-sm">Center</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name={`align-${section.id}`}
                        value="right"
                        checked={section.heroImageAlign === "right"}
                        onChange={(e) => onUpdate({ heroImageAlign: e.target.value as any })}
                        className="cursor-pointer"
                      />
                      <span className="text-sm">Right</span>
                    </label>
                  </div>
                </div>
              </>
            )}
          </Card>

          <div>
            <div className="flex items-center justify-between mb-2">
              <Label>Key Points</Label>
              <Button size="sm" variant="outline" onClick={addKeyPoint}>
                <Plus className="h-3 w-3 mr-1" />
                Add Point
              </Button>
            </div>
            <div className="space-y-2">
              {section.keyPoints.map((point, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={point}
                    onChange={(e) => updateKeyPoint(index, e.target.value)}
                    placeholder={`Key point ${index + 1}`}
                  />
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => removeKeyPoint(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          <div>
            <Label htmlFor="pullQuote">Pull Quote</Label>
            <Textarea
              id="pullQuote"
              value={section.pullQuote || ""}
              onChange={(e) => onUpdate({ pullQuote: e.target.value })}
              placeholder="A compelling quote to highlight"
              rows={2}
            />
          </div>

          <div>
            <Label htmlFor="statsLine">Stats Line</Label>
            <Input
              id="statsLine"
              value={section.statsLine || ""}
              onChange={(e) => onUpdate({ statsLine: e.target.value })}
              placeholder="e.g., 75% increase in engagement"
            />
          </div>

          <div>
            <Label htmlFor="body">Body Content (Markdown)</Label>
            <Textarea
              id="body"
              value={section.bodyMarkdown}
              onChange={(e) => onUpdate({ bodyMarkdown: e.target.value })}
              placeholder="Write your article content in Markdown format..."
              rows={12}
              className="font-mono text-sm"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
