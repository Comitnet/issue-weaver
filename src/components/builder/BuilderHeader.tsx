import { Button } from "@/components/ui/button";
import { Download, Upload, FileJson, FileText, Settings, Share2, Plus, Copy, ClipboardCheck } from "lucide-react";
import { Magazine } from "@/types/magazine";
import { MagazineIssueMeta } from "@/types/issue";
import { IssueSelector } from "./IssueSelector";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface BuilderHeaderProps {
  magazine: Magazine;
  issues: MagazineIssueMeta[];
  currentIssueId: string | undefined;
  isDirty: boolean;
  hasCopied?: boolean;
  onSelectIssue: (id: string) => void;
  onNew: () => void;
  onExportForGit: () => void;
  onDownloadJSON: () => void;
  onImportJSON: () => void;
  onExportPDF: () => void;
  onExportDocx: () => void;
  onSettings: () => void;
  onShare: () => void;
}

export const BuilderHeader = ({
  magazine,
  issues,
  currentIssueId,
  isDirty,
  hasCopied,
  onSelectIssue,
  onNew,
  onExportForGit,
  onDownloadJSON,
  onImportJSON,
  onExportPDF,
  onExportDocx,
  onSettings,
  onShare,
}: BuilderHeaderProps) => {
  return (
    <header className="border-b border-border bg-card px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Magazine Builder</h1>
            <p className="text-sm text-muted-foreground">
              {magazine.title} • Issue {magazine.issueNumber}
            </p>
          </div>
          
          <div className="h-8 w-px bg-border" />
          
          <IssueSelector
            issues={issues}
            currentIssueId={currentIssueId}
            onSelectIssue={onSelectIssue}
          />
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={onNew}>
            <Plus className="mr-2 h-4 w-4" />
            New Issue
          </Button>
          
          <div className="h-6 w-px bg-border" />
          
          {/* Export for Git - copies JSON to clipboard for AI to save */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant={isDirty ? "default" : "outline"} 
                size="sm" 
                onClick={onExportForGit}
                className="min-w-[130px]"
              >
                {hasCopied ? (
                  <>
                    <ClipboardCheck className="mr-2 h-4 w-4" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="mr-2 h-4 w-4" />
                    Export for Git
                  </>
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent className="max-w-xs">
              <p className="font-medium">Copy issue JSON to clipboard</p>
              <p className="text-xs text-muted-foreground mt-1">
                Paste the JSON in the AI chat to save it to the repository.
                The browser cannot write to Git directly.
              </p>
            </TooltipContent>
          </Tooltip>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="sm" onClick={onDownloadJSON}>
                <Download className="mr-2 h-4 w-4" />
                Download JSON
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Download issue as {magazine.title.toLowerCase().replace(/\s+/g, '-')}.json</p>
            </TooltipContent>
          </Tooltip>
          
          <div className="h-6 w-px bg-border" />
          
          <Button variant="outline" size="sm" onClick={onImportJSON}>
            <Upload className="mr-2 h-4 w-4" />
            Import
          </Button>
          
          <Button variant="outline" size="sm" onClick={onExportPDF}>
            <FileText className="mr-2 h-4 w-4" />
            Export PDF
          </Button>
          
          <Button variant="outline" size="sm" onClick={onExportDocx}>
            <FileJson className="mr-2 h-4 w-4" />
            Export DOCX
          </Button>
          
          <div className="h-6 w-px bg-border" />
          
          <Button variant="outline" size="sm" onClick={onShare}>
            <Share2 className="mr-2 h-4 w-4" />
            Share
          </Button>
          
          <Button variant="default" size="sm" onClick={onSettings}>
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </Button>
        </div>
      </div>
    </header>
  );
};
