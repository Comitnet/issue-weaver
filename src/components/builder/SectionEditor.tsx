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

  const isArticle = (section.kind || "article") === "article";
  const isAd = section.kind === "advertisement";

  return (
    <div className="h-full overflow-y-auto border-r border-border bg-background">
      <div className="p-6 space-y-6">
        <div>
          <h2 className="text-lg font-semibold mb-4">Edit Section</h2>
        </div>

        <div className="space-y-4">
          <div>
            <Label>Section Type</Label>
            <div className="flex gap-3">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name={`kind-${section.id}`}
                  value="article"
                  checked={isArticle}
                  onChange={() => onUpdate({ kind: "article" })}
                  className="cursor-pointer"
                />
                <span className="text-sm">Article</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name={`kind-${section.id}`}
                  value="advertisement"
                  checked={isAd}
                  onChange={() => onUpdate({ kind: "advertisement" })}
                  className="cursor-pointer"
                />
                <span className="text-sm">Advertisement</span>
              </label>
            </div>
          </div>

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

          {isArticle && (
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
          )}

          {isArticle && (
            <div>
              <Label>Text Layout (Columns)</Label>
              <div className="flex gap-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name={`columns-${section.id}`}
                    value="1"
                    checked={(section.columnCount || 1) === 1}
                    onChange={() => onUpdate({ columnCount: 1 })}
                    className="cursor-pointer"
                  />
                  <span className="text-sm">1 Column</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name={`columns-${section.id}`}
                    value="2"
                    checked={section.columnCount === 2}
                    onChange={() => onUpdate({ columnCount: 2 })}
                    className="cursor-pointer"
                  />
                  <span className="text-sm">2 Columns</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name={`columns-${section.id}`}
                    value="3"
                    checked={section.columnCount === 3}
                    onChange={() => onUpdate({ columnCount: 3 })}
                    className="cursor-pointer"
                  />
                  <span className="text-sm">3 Columns</span>
                </label>
              </div>
            </div>
          )}

          {isAd && (
            <Card className="p-4 space-y-4 bg-muted/30">
              <h3 className="font-semibold text-sm">Advertisement Layout</h3>
              
              <div>
                <Label>Ad Layout</Label>
                <div className="flex flex-col gap-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name={`adLayout-${section.id}`}
                      value="full-page"
                      checked={(section.adLayout || "full-page") === "full-page"}
                      onChange={(e) => onUpdate({ adLayout: e.target.value as any })}
                      className="cursor-pointer"
                    />
                    <span className="text-sm">Full Page</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name={`adLayout-${section.id}`}
                      value="half-top"
                      checked={section.adLayout === "half-top"}
                      onChange={(e) => onUpdate({ adLayout: e.target.value as any })}
                      className="cursor-pointer"
                    />
                    <span className="text-sm">Half Page - Top</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name={`adLayout-${section.id}`}
                      value="half-bottom"
                      checked={section.adLayout === "half-bottom"}
                      onChange={(e) => onUpdate({ adLayout: e.target.value as any })}
                      className="cursor-pointer"
                    />
                    <span className="text-sm">Half Page - Bottom</span>
                  </label>
                </div>
              </div>

              <div>
                <Label htmlFor="adImageUrl">Ad Image URL</Label>
                <Input
                  id="adImageUrl"
                  value={section.adImageUrl || ""}
                  onChange={(e) => onUpdate({ adImageUrl: e.target.value })}
                  placeholder="https://example.com/ad-image.jpg"
                />
              </div>

              <div>
                <Label htmlFor="adAltText">Ad Alt Text</Label>
                <Input
                  id="adAltText"
                  value={section.adAltText || ""}
                  onChange={(e) => onUpdate({ adAltText: e.target.value })}
                  placeholder="Describe the ad image"
                />
              </div>

              <div>
                <Label htmlFor="adHeadline">Ad Headline</Label>
                <Input
                  id="adHeadline"
                  value={section.adHeadline || ""}
                  onChange={(e) => onUpdate({ adHeadline: e.target.value })}
                  placeholder="Short attention-grabbing headline"
                />
              </div>

              <div>
                <Label htmlFor="adBody">Ad Body Text</Label>
                <Textarea
                  id="adBody"
                  value={section.adBody || ""}
                  onChange={(e) => onUpdate({ adBody: e.target.value })}
                  placeholder="Brief ad description"
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="adCallToAction">Call to Action</Label>
                <Input
                  id="adCallToAction"
                  value={section.adCallToAction || ""}
                  onChange={(e) => onUpdate({ adCallToAction: e.target.value })}
                  placeholder="e.g., Visit example.com or Learn More"
                />
              </div>
            </Card>
          )}

          {isArticle && (
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
              <Label>Placement</Label>
              <div className="flex gap-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name={`placement-${section.id}`}
                    value="top"
                    checked={(section.heroImagePlacement || "top") === "top"}
                    onChange={(e) => onUpdate({ heroImagePlacement: e.target.value as any })}
                    className="cursor-pointer"
                  />
                  <span className="text-sm">Top</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name={`placement-${section.id}`}
                    value="middle"
                    checked={section.heroImagePlacement === "middle"}
                    onChange={(e) => onUpdate({ heroImagePlacement: e.target.value as any })}
                    className="cursor-pointer"
                  />
                  <span className="text-sm">Middle</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name={`placement-${section.id}`}
                    value="bottom"
                    checked={section.heroImagePlacement === "bottom"}
                    onChange={(e) => onUpdate({ heroImagePlacement: e.target.value as any })}
                    className="cursor-pointer"
                  />
                  <span className="text-sm">Bottom</span>
                </label>
              </div>
            </div>

            {section.heroImagePlacement === "middle" && (
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
                  <Label>Alignment</Label>
                  <div className="flex gap-3">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name={`alignment-${section.id}`}
                        value="left"
                        checked={(section.heroImageAlignment || "center") === "left"}
                        onChange={(e) => onUpdate({ heroImageAlignment: e.target.value as any })}
                        className="cursor-pointer"
                      />
                      <span className="text-sm">Left</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name={`alignment-${section.id}`}
                        value="center"
                        checked={(section.heroImageAlignment || "center") === "center"}
                        onChange={(e) => onUpdate({ heroImageAlignment: e.target.value as any })}
                        className="cursor-pointer"
                      />
                      <span className="text-sm">Center</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name={`alignment-${section.id}`}
                        value="right"
                        checked={section.heroImageAlignment === "right"}
                        onChange={(e) => onUpdate({ heroImageAlignment: e.target.value as any })}
                        className="cursor-pointer"
                      />
                      <span className="text-sm">Right</span>
                    </label>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id={`wrapText-${section.id}`}
                    checked={section.wrapTextAroundImage || false}
                    onCheckedChange={(checked) => onUpdate({ wrapTextAroundImage: checked as boolean })}
                  />
                  <Label htmlFor={`wrapText-${section.id}`} className="cursor-pointer text-sm">
                    Wrap text around this image
                  </Label>
                </div>
              </>
            )}
          </Card>
          )}

          {isArticle && (
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
          )}

          {isArticle && (
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
          )}

          {isArticle && section.label.toUpperCase() !== "FROM THE EDITOR" && (
            <Card className="p-4 space-y-4 bg-muted/30">
              <h3 className="font-semibold text-sm">Key Points & Pull Quote Placement</h3>
              
              <div>
                <Label>Key Points Placement</Label>
                <div className="flex flex-col gap-2 mt-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name={`keyPointsPlacement-${section.id}`}
                      value="first-page-end"
                      checked={(section.keyPointsPlacement || "first-page-end") === "first-page-end"}
                      onChange={(e) => onUpdate({ keyPointsPlacement: e.target.value as any })}
                      className="cursor-pointer"
                    />
                    <span className="text-sm">End of first page</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name={`keyPointsPlacement-${section.id}`}
                      value="second-page-top"
                      checked={section.keyPointsPlacement === "second-page-top"}
                      onChange={(e) => onUpdate({ keyPointsPlacement: e.target.value as any })}
                      className="cursor-pointer"
                    />
                    <span className="text-sm">Top of second page</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name={`keyPointsPlacement-${section.id}`}
                      value="second-page-end"
                      checked={section.keyPointsPlacement === "second-page-end"}
                      onChange={(e) => onUpdate({ keyPointsPlacement: e.target.value as any })}
                      className="cursor-pointer"
                    />
                    <span className="text-sm">End of second page</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name={`keyPointsPlacement-${section.id}`}
                      value="none"
                      checked={section.keyPointsPlacement === "none"}
                      onChange={(e) => onUpdate({ keyPointsPlacement: e.target.value as any })}
                      className="cursor-pointer"
                    />
                    <span className="text-sm">Don't show</span>
                  </label>
                </div>
              </div>

              <div>
                <Label>Pull Quote Placement</Label>
                <div className="flex flex-col gap-2 mt-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name={`pullQuotePlacement-${section.id}`}
                      value="first-page-end"
                      checked={(section.pullQuotePlacement || "first-page-end") === "first-page-end"}
                      onChange={(e) => onUpdate({ pullQuotePlacement: e.target.value as any })}
                      className="cursor-pointer"
                    />
                    <span className="text-sm">End of first page</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name={`pullQuotePlacement-${section.id}`}
                      value="second-page-top"
                      checked={section.pullQuotePlacement === "second-page-top"}
                      onChange={(e) => onUpdate({ pullQuotePlacement: e.target.value as any })}
                      className="cursor-pointer"
                    />
                    <span className="text-sm">Top of second page</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name={`pullQuotePlacement-${section.id}`}
                      value="second-page-end"
                      checked={section.pullQuotePlacement === "second-page-end"}
                      onChange={(e) => onUpdate({ pullQuotePlacement: e.target.value as any })}
                      className="cursor-pointer"
                    />
                    <span className="text-sm">End of second page</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name={`pullQuotePlacement-${section.id}`}
                      value="none"
                      checked={section.pullQuotePlacement === "none"}
                      onChange={(e) => onUpdate({ pullQuotePlacement: e.target.value as any })}
                      className="cursor-pointer"
                    />
                    <span className="text-sm">Don't show</span>
                  </label>
                </div>
              </div>

              {(section.keyPointsPlacement === section.pullQuotePlacement && 
                section.keyPointsPlacement !== "none" && section.pullQuotePlacement !== "none") && (
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id={`keyPointsFirst-${section.id}`}
                    checked={section.keyPointsFirst !== false}
                    onCheckedChange={(checked) => onUpdate({ keyPointsFirst: checked as boolean })}
                  />
                  <Label htmlFor={`keyPointsFirst-${section.id}`} className="cursor-pointer text-sm">
                    Show Key Points before Pull Quote
                  </Label>
                </div>
              )}
            </Card>
          )}

          {isArticle && (
            <div>
              <Label htmlFor="statsLine">Stats Line</Label>
            <Input
              id="statsLine"
              value={section.statsLine || ""}
              onChange={(e) => onUpdate({ statsLine: e.target.value })}
              placeholder="e.g., 75% increase in engagement"
            />
          </div>
          )}

          {isArticle && (
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
          )}
        </div>
      </div>
    </div>
  );
};
