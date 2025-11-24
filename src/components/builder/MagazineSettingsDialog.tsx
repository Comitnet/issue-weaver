import { useState } from "react";
import { Magazine } from "@/types/magazine";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface MagazineSettingsDialogProps {
  magazine: Magazine;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdate: (updates: Partial<Magazine>) => void;
}

export const MagazineSettingsDialog = ({
  magazine,
  open,
  onOpenChange,
  onUpdate,
}: MagazineSettingsDialogProps) => {
  const [formData, setFormData] = useState({
    title: magazine.title,
    subtitle: magazine.subtitle || "",
    tagline: magazine.tagline || "",
    issueNumber: magazine.issueNumber,
    issueLabel: magazine.issueLabel || "",
    themeTitle: magazine.themeTitle || "",
    themeSummary: magazine.themeSummary || "",
    publisherName: magazine.publisherName,
    publisherWebsite: magazine.publisherWebsite || "",
    publicationDate: magazine.publicationDate,
    language: magazine.language || "",
    coverTextColor: magazine.coverTextColor || "",
    coverAccentColor: magazine.coverAccentColor || "",
  });

  const handleSave = () => {
    onUpdate(formData);
    onOpenChange(false);
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Magazine Settings</DialogTitle>
          <DialogDescription>
            Configure your magazine's cover page and metadata
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="basic">Basic Info</TabsTrigger>
            <TabsTrigger value="cover">Cover</TabsTrigger>
            <TabsTrigger value="theme">Theme</TabsTrigger>
            <TabsTrigger value="publisher">Publisher</TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="title">Magazine Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleChange("title", e.target.value)}
                placeholder="Digital Vault"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="subtitle">Subtitle</Label>
              <Input
                id="subtitle"
                value={formData.subtitle}
                onChange={(e) => handleChange("subtitle", e.target.value)}
                placeholder="Financial Cyber Resilience"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tagline">Tagline</Label>
              <Input
                id="tagline"
                value={formData.tagline}
                onChange={(e) => handleChange("tagline", e.target.value)}
                placeholder="Excellence in Publishing"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="issueNumber">Issue Number *</Label>
                <Input
                  id="issueNumber"
                  value={formData.issueNumber}
                  onChange={(e) => handleChange("issueNumber", e.target.value)}
                  placeholder="01"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="issueLabel">Issue Label</Label>
                <Input
                  id="issueLabel"
                  value={formData.issueLabel}
                  onChange={(e) => handleChange("issueLabel", e.target.value)}
                  placeholder="Volume 1"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="publicationDate">Publication Date *</Label>
                <Input
                  id="publicationDate"
                  type="date"
                  value={formData.publicationDate}
                  onChange={(e) => handleChange("publicationDate", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="language">Language</Label>
                <Input
                  id="language"
                  value={formData.language}
                  onChange={(e) => handleChange("language", e.target.value)}
                  placeholder="en"
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="cover" className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="coverTextColor">Cover Text Color</Label>
              <div className="flex gap-2">
                <Input
                  id="coverTextColor"
                  value={formData.coverTextColor}
                  onChange={(e) => handleChange("coverTextColor", e.target.value)}
                  placeholder="#ffffff or hsl(0, 0%, 100%)"
                />
                <input
                  type="color"
                  value={formData.coverTextColor || "#ffffff"}
                  onChange={(e) => handleChange("coverTextColor", e.target.value)}
                  className="w-12 h-10 rounded border cursor-pointer"
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Override text color on the cover (for contrast with background image)
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="coverAccentColor">Cover Accent Color</Label>
              <div className="flex gap-2">
                <Input
                  id="coverAccentColor"
                  value={formData.coverAccentColor}
                  onChange={(e) => handleChange("coverAccentColor", e.target.value)}
                  placeholder="#f59e0b or hsl(38, 92%, 50%)"
                />
                <input
                  type="color"
                  value={formData.coverAccentColor || "#f59e0b"}
                  onChange={(e) => handleChange("coverAccentColor", e.target.value)}
                  className="w-12 h-10 rounded border cursor-pointer"
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Override accent color for labels and taglines on the cover
              </p>
            </div>
          </TabsContent>

          <TabsContent value="theme" className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="themeTitle">Theme Title</Label>
              <Input
                id="themeTitle"
                value={formData.themeTitle}
                onChange={(e) => handleChange("themeTitle", e.target.value)}
                placeholder="Innovation & Technology"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="themeSummary">Theme Summary</Label>
              <Textarea
                id="themeSummary"
                value={formData.themeSummary}
                onChange={(e) => handleChange("themeSummary", e.target.value)}
                placeholder="Exploring the future of digital publishing"
                rows={4}
              />
            </div>
          </TabsContent>

          <TabsContent value="publisher" className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="publisherName">Publisher Name *</Label>
              <Input
                id="publisherName"
                value={formData.publisherName}
                onChange={(e) => handleChange("publisherName", e.target.value)}
                placeholder="Your Publisher"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="publisherWebsite">Publisher Website</Label>
              <Input
                id="publisherWebsite"
                type="url"
                value={formData.publisherWebsite}
                onChange={(e) => handleChange("publisherWebsite", e.target.value)}
                placeholder="https://example.com"
              />
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Save Changes
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
