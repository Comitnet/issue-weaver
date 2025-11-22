import { Button } from "@/components/ui/button";
import { Download, Upload, FileJson, FileText, Settings, Share2, Plus } from "lucide-react";
import { Magazine } from "@/types/magazine";

interface BuilderHeaderProps {
  magazine: Magazine;
  onNew: () => void;
  onExportJSON: () => void;
  onImportJSON: () => void;
  onExportPDF: () => void;
  onSettings: () => void;
  onShare: () => void;
}

export const BuilderHeader = ({
  magazine,
  onNew,
  onExportJSON,
  onImportJSON,
  onExportPDF,
  onSettings,
  onShare,
}: BuilderHeaderProps) => {
  return (
    <header className="border-b border-border bg-card px-6 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Magazine Builder</h1>
          <p className="text-sm text-muted-foreground">
            {magazine.title} • Issue {magazine.issueNumber}
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={onNew}>
            <Plus className="mr-2 h-4 w-4" />
            New Issue
          </Button>
          
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
