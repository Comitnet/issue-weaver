import { Button } from "@/components/ui/button";
import { Download, Upload, FileJson, FileText, Settings, Share2, Plus, Save, Check, AlertCircle, Loader2 } from "lucide-react";
import { Magazine } from "@/types/magazine";
import { MagazineIssueMeta } from "@/types/issue";
import { IssueSelector } from "./IssueSelector";
import { format } from "date-fns";
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
  isDevEnvironment: boolean;
  lastSaved: Date | null;
  isSaving?: boolean;
  onSelectIssue: (id: string) => void;
  onNew: () => void;
  onSave: () => void;
  onExportJSON: () => void;
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
  isDevEnvironment,
  lastSaved,
  isSaving,
  onSelectIssue,
  onNew,
  onSave,
  onExportJSON,
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
          
          {/* Save button with status indicator */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant={isDirty ? "default" : "outline"} 
                size="sm" 
                onClick={onSave}
                disabled={!isDevEnvironment || isSaving}
                className="min-w-[100px]"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : isDirty ? (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save
                  </>
                ) : (
                  <>
                    <Check className="mr-2 h-4 w-4" />
                    Saved
                  </>
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              {!isDevEnvironment ? (
                <div className="flex items-center gap-2 text-yellow-500">
                  <AlertCircle className="h-4 w-4" />
                  <span>Repo-backed saving only available in dev environment</span>
                </div>
              ) : lastSaved ? (
                <span>Last saved: {format(lastSaved, "h:mm:ss a")}</span>
              ) : (
                <span>Not saved yet</span>
              )}
            </TooltipContent>
          </Tooltip>
          
          <div className="h-6 w-px bg-border" />
          
          <Button variant="outline" size="sm" onClick={onImportJSON}>
            <Upload className="mr-2 h-4 w-4" />
            Import
          </Button>
          
          <Button variant="outline" size="sm" onClick={onExportJSON}>
            <FileJson className="mr-2 h-4 w-4" />
            Export JSON
          </Button>
          
          <Button variant="outline" size="sm" onClick={onExportPDF}>
            <FileText className="mr-2 h-4 w-4" />
            Export PDF
          </Button>
          
          <Button variant="outline" size="sm" onClick={onExportDocx}>
            <Download className="mr-2 h-4 w-4" />
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
