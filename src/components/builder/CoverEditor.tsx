import { Magazine } from "@/types/magazine";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

interface CoverEditorProps {
  magazine: Magazine;
  onUpdate: (updates: Partial<Magazine>) => void;
}

export const CoverEditor = ({ magazine, onUpdate }: CoverEditorProps) => {
  return (
    <ScrollArea className="h-full">
      <div className="p-6 space-y-6">
        <div>
          <h2 className="text-2xl font-bold mb-2">Cover Page</h2>
          <p className="text-sm text-muted-foreground">
            Edit the information displayed on your magazine's cover
          </p>
        </div>

        <Card className="p-4 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="cover-title">Magazine Title *</Label>
            <Input
              id="cover-title"
              value={magazine.title}
              onChange={(e) => onUpdate({ title: e.target.value })}
              placeholder="Digital Vault"
              maxLength={200}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="cover-subtitle">Subtitle</Label>
            <Input
              id="cover-subtitle"
              value={magazine.subtitle || ""}
              onChange={(e) => onUpdate({ subtitle: e.target.value })}
              placeholder="Financial Cyber Resilience"
              maxLength={300}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="cover-tagline">Tagline</Label>
            <Input
              id="cover-tagline"
              value={magazine.tagline || ""}
              onChange={(e) => onUpdate({ tagline: e.target.value })}
              placeholder="Excellence in Publishing"
              maxLength={200}
            />
          </div>
        </Card>

        <Card className="p-4 space-y-4">
          <h3 className="font-semibold">Issue Information</h3>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="cover-issue-number">Issue Number *</Label>
              <Input
                id="cover-issue-number"
                value={magazine.issueNumber}
                onChange={(e) => onUpdate({ issueNumber: e.target.value })}
                placeholder="01"
                maxLength={10}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cover-issue-label">Issue Label</Label>
              <Input
                id="cover-issue-label"
                value={magazine.issueLabel || ""}
                onChange={(e) => onUpdate({ issueLabel: e.target.value })}
                placeholder="Volume 1"
                maxLength={50}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="cover-publication-date">Publication Date *</Label>
            <Input
              id="cover-publication-date"
              type="date"
              value={magazine.publicationDate}
              onChange={(e) => onUpdate({ publicationDate: e.target.value })}
            />
          </div>
        </Card>

        <Card className="p-4 space-y-4">
          <h3 className="font-semibold">Theme</h3>
          
          <div className="space-y-2">
            <Label htmlFor="cover-theme-title">Theme Title</Label>
            <Input
              id="cover-theme-title"
              value={magazine.themeTitle || ""}
              onChange={(e) => onUpdate({ themeTitle: e.target.value })}
              placeholder="Innovation & Technology"
              maxLength={100}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="cover-theme-summary">Theme Summary</Label>
            <Textarea
              id="cover-theme-summary"
              value={magazine.themeSummary || ""}
              onChange={(e) => onUpdate({ themeSummary: e.target.value })}
              placeholder="Exploring the future of digital publishing"
              rows={4}
              maxLength={500}
            />
          </div>
        </Card>

        <Card className="p-4 space-y-4">
          <h3 className="font-semibold">Cover Background</h3>
          
          <div className="space-y-2">
            <Label htmlFor="cover-image-url">Cover Background Image URL</Label>
            <Input
              id="cover-image-url"
              type="url"
              value={magazine.coverImageUrl || ""}
              onChange={(e) => onUpdate({ coverImageUrl: e.target.value })}
              placeholder="https://example.com/cover.jpg"
              maxLength={500}
            />
          </div>

          <div className="space-y-2">
            <Label>Cover Image Style</Label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="coverImageStyle"
                  value="none"
                  checked={(magazine.coverImageStyle || "none") === "none"}
                  onChange={(e) => onUpdate({ coverImageStyle: e.target.value as any })}
                  className="cursor-pointer"
                />
                <span className="text-sm">None</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="coverImageStyle"
                  value="full-bleed"
                  checked={magazine.coverImageStyle === "full-bleed"}
                  onChange={(e) => onUpdate({ coverImageStyle: e.target.value as any })}
                  className="cursor-pointer"
                />
                <span className="text-sm">Full-bleed</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="coverImageStyle"
                  value="banner"
                  checked={magazine.coverImageStyle === "banner"}
                  onChange={(e) => onUpdate({ coverImageStyle: e.target.value as any })}
                  className="cursor-pointer"
                />
                <span className="text-sm">Banner</span>
              </label>
            </div>
          </div>
        </Card>

        <Card className="p-4 space-y-4">
          <h3 className="font-semibold">Publisher</h3>
          
          <div className="space-y-2">
            <Label htmlFor="cover-publisher-name">Publisher Name *</Label>
            <Input
              id="cover-publisher-name"
              value={magazine.publisherName}
              onChange={(e) => onUpdate({ publisherName: e.target.value })}
              placeholder="Your Publisher"
              maxLength={200}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="cover-publisher-website">Publisher Website</Label>
            <Input
              id="cover-publisher-website"
              type="url"
              value={magazine.publisherWebsite || ""}
              onChange={(e) => onUpdate({ publisherWebsite: e.target.value })}
              placeholder="https://example.com"
              maxLength={500}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="cover-publisher-logo">Publisher Logo URL</Label>
            <Input
              id="cover-publisher-logo"
              type="url"
              value={magazine.publisherLogoUrl || ""}
              onChange={(e) => onUpdate({ publisherLogoUrl: e.target.value })}
              placeholder="https://example.com/logo.png"
              maxLength={500}
            />
          </div>
        </Card>

        <Card className="p-4 space-y-4">
          <h3 className="font-semibold">Additional Settings</h3>
          
          <div className="space-y-2">
            <Label htmlFor="cover-language">Language</Label>
            <Input
              id="cover-language"
              value={magazine.language || ""}
              onChange={(e) => onUpdate({ language: e.target.value })}
              placeholder="en"
              maxLength={10}
            />
          </div>
        </Card>
      </div>
    </ScrollArea>
  );
};
