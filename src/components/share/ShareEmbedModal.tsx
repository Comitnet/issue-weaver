import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Copy, Check, Link, Code, Info } from "lucide-react";
import { getIssueShareData } from "@/lib/share";

interface ShareEmbedModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  issueId: string;
  issueTitle?: string;
}

export const ShareEmbedModal = ({
  open,
  onOpenChange,
  issueId,
  issueTitle,
}: ShareEmbedModalProps) => {
  const [copiedPublic, setCopiedPublic] = useState(false);
  const [copiedEmbed, setCopiedEmbed] = useState(false);

  const { publicUrl, iframeSnippet } = getIssueShareData(issueId);

  const copyToClipboard = async (text: string, type: "public" | "embed") => {
    try {
      await navigator.clipboard.writeText(text);
      if (type === "public") {
        setCopiedPublic(true);
        setTimeout(() => setCopiedPublic(false), 2000);
      } else {
        setCopiedEmbed(true);
        setTimeout(() => setCopiedEmbed(false), 2000);
      }
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            Share & Embed
          </DialogTitle>
          <DialogDescription>
            {issueTitle
              ? `Share "${issueTitle}" with others or embed it on your website.`
              : "Share this issue with others or embed it on your website."}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Public Link Section */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Link className="h-4 w-4 text-primary" />
              <Label className="text-sm font-semibold">Public reader link</Label>
            </div>
            <div className="flex gap-2">
              <Input
                readOnly
                value={publicUrl}
                className="font-mono text-sm bg-muted/50"
              />
              <Button
                variant="outline"
                size="icon"
                onClick={() => copyToClipboard(publicUrl, "public")}
                className="flex-shrink-0"
              >
                {copiedPublic ? (
                  <Check className="h-4 w-4 text-green-500" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          {/* Embed Code Section */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Code className="h-4 w-4 text-primary" />
              <Label className="text-sm font-semibold">
                Embed on your website (responsive iframe)
              </Label>
            </div>
            <div className="relative">
              <Textarea
                readOnly
                value={iframeSnippet}
                className="font-mono text-xs bg-muted/50 min-h-[140px] resize-none pr-12"
              />
              <Button
                variant="outline"
                size="icon"
                onClick={() => copyToClipboard(iframeSnippet, "embed")}
                className="absolute top-2 right-2"
              >
                {copiedEmbed ? (
                  <Check className="h-4 w-4 text-green-500" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          {/* How to Use Section */}
          <div className="space-y-3 rounded-lg bg-muted/30 p-4 border border-border">
            <div className="flex items-center gap-2">
              <Info className="h-4 w-4 text-muted-foreground" />
              <Label className="text-sm font-semibold text-muted-foreground">
                How to use
              </Label>
            </div>
            <ul className="text-sm text-muted-foreground space-y-2 ml-6 list-disc">
              <li>
                Paste the <strong>public link</strong> into emails, chats, or
                social posts to share directly.
              </li>
              <li>
                For websites (WordPress, Wix, Squarespace, etc.), paste the{" "}
                <strong>embed code</strong> into a custom HTML block.
              </li>
              <li>
                The embed automatically fills the width of its container and
                maintains a magazine-like aspect ratio.
              </li>
            </ul>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
