import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useIssues } from "@/hooks/useIssues";
import { Section } from "@/types/magazine";
import { BuilderHeader } from "@/components/builder/BuilderHeader";
import { SectionList } from "@/components/builder/SectionList";
import { SectionEditor } from "@/components/builder/SectionEditor";
import { CoverEditor } from "@/components/builder/CoverEditor";
import { PreviewPanel } from "@/components/preview/PreviewPanel";
import { MagazineSettingsDialog } from "@/components/builder/MagazineSettingsDialog";
import { ShareEmbedModal } from "@/components/share/ShareEmbedModal";
import { NewIssueDialog } from "@/components/builder/NewIssueDialog";
import { toast } from "@/hooks/use-toast";
import { exportMagazineAsDocx } from "@/lib/exportDocx";
import { saveMagazineById } from "@/lib/magazineStorage";
import { copyIssueToClipboard, downloadIssueAsJson } from "@/lib/issueExport";
import { Loader2 } from "lucide-react";

const Builder = () => {
  const navigate = useNavigate();
  const {
    issues,
    currentIssue,
    isLoading,
    isDirty,
    selectIssue,
    createIssue,
    updateMagazine,
  } = useIssues();

  const magazine = currentIssue?.magazine;
  
  const [selectedSectionId, setSelectedSectionId] = useState<string | undefined>();
  const [isCoverSelected, setIsCoverSelected] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [newIssueOpen, setNewIssueOpen] = useState(false);
  const [hasCopied, setHasCopied] = useState(false);

  // Set initial section selection when magazine loads
  useEffect(() => {
    if (magazine?.sections[0]?.id && !selectedSectionId) {
      setSelectedSectionId(magazine.sections[0].id);
    }
  }, [magazine, selectedSectionId]);

  // Loading state
  if (isLoading || !magazine) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          <p className="text-muted-foreground">Loading issues...</p>
        </div>
      </div>
    );
  }

  const selectedSection = magazine.sections.find((s) => s.id === selectedSectionId);

  const handleSelectCover = () => {
    setIsCoverSelected(true);
    setSelectedSectionId(undefined);
  };

  const handleSelectSection = (sectionId: string | undefined) => {
    setIsCoverSelected(false);
    setSelectedSectionId(sectionId);
  };

  const handleAddSection = () => {
    const newSection: Section = {
      id: crypto.randomUUID(),
      label: "New Section",
      title: "Untitled",
      keyPoints: [],
      bodyMarkdown: "",
      keyPointsPlacement: "first-page-end",
      pullQuotePlacement: "second-page-top",
    };
    updateMagazine({ sections: [...magazine.sections, newSection] });
    setSelectedSectionId(newSection.id);
    setIsCoverSelected(false);
    toast({ title: "Section added" });
  };

  const handleDeleteSection = (sectionId: string) => {
    if (magazine.sections.length === 1) {
      toast({ title: "Cannot delete", description: "Magazine must have at least one section", variant: "destructive" });
      return;
    }
    const newSections = magazine.sections.filter((s) => s.id !== sectionId);
    updateMagazine({ sections: newSections });
    if (selectedSectionId === sectionId) {
      setSelectedSectionId(newSections[0]?.id);
    }
    toast({ title: "Section deleted" });
  };

  const handleUpdateSection = (updates: Partial<Section>) => {
    const newSections = magazine.sections.map((s) =>
      s.id === selectedSectionId ? { ...s, ...updates } : s
    );
    updateMagazine({ sections: newSections });
  };

  /**
   * Export for Git: Copy the full issue JSON to clipboard.
   * User then pastes it in AI chat to persist to data/issues/<slug>.json
   */
  const handleExportForGit = async () => {
    if (!currentIssue) return;
    
    const success = await copyIssueToClipboard(currentIssue);
    
    if (success) {
      setHasCopied(true);
      toast({ 
        title: "Issue JSON copied to clipboard", 
        description: "Paste it in the AI chat to save to the repository.",
      });
      
      // Reset the "Copied!" state after 3 seconds
      setTimeout(() => setHasCopied(false), 3000);
    } else {
      toast({ 
        title: "Failed to copy", 
        description: "Could not copy to clipboard. Try Download JSON instead.",
        variant: "destructive" 
      });
    }
  };

  /**
   * Download the issue as a JSON file (backup option)
   */
  const handleDownloadJSON = () => {
    if (!currentIssue) return;
    downloadIssueAsJson(currentIssue);
    toast({ title: "JSON downloaded", description: `Saved as ${currentIssue.meta.slug}.json` });
  };

  const handleImportJSON = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "application/json";
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          try {
            const data = JSON.parse(event.target?.result as string);
            // Support both full issue files (with meta+magazine) and raw magazine objects
            if (data.magazine && data.meta) {
              updateMagazine(data.magazine);
            } else {
              updateMagazine(data);
            }
            setSelectedSectionId(data.magazine?.sections[0]?.id || data.sections[0]?.id);
            toast({ title: "Magazine imported successfully" });
          } catch {
            toast({ title: "Failed to import", description: "Invalid JSON file", variant: "destructive" });
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  const handleExportPDF = () => {
    navigate('/print', { state: { magazine } });
  };

  const handleExportDocx = async () => {
    try {
      const blob = await exportMagazineAsDocx(magazine);
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${magazine.title.replace(/\s+/g, "-").toLowerCase()}-${magazine.issueNumber}.docx`;
      a.click();
      URL.revokeObjectURL(url);
      toast({ title: "DOCX exported successfully" });
    } catch (error) {
      toast({ title: "Export failed", description: "Could not export DOCX", variant: "destructive" });
    }
  };

  const handleSettings = () => {
    setSettingsOpen(true);
  };

  const handleShare = () => {
    // Save the magazine by ID so the reader route can load it
    saveMagazineById(magazine);
    setShareOpen(true);
  };

  const handleNewIssue = () => {
    setNewIssueOpen(true);
  };

  const handleCreateIssue = async (title: string, template: "blank" | "demo" | "current") => {
    const newIssue = await createIssue(title, template);
    if (newIssue) {
      setSelectedSectionId(newIssue.magazine.sections[0]?.id);
      toast({ 
        title: "Issue created in memory", 
        description: `Use "Export for Git" to save "${title}" to the repository.`
      });
    }
  };

  const handleSelectIssue = async (id: string) => {
    await selectIssue(id);
    // Reset selection state for new issue
    setSelectedSectionId(undefined);
    setIsCoverSelected(false);
  };

  return (
    <div className="flex flex-col h-screen">
      <BuilderHeader
        magazine={magazine}
        issues={issues}
        currentIssueId={currentIssue?.meta.id}
        isDirty={isDirty}
        hasCopied={hasCopied}
        onSelectIssue={handleSelectIssue}
        onNew={handleNewIssue}
        onExportForGit={handleExportForGit}
        onDownloadJSON={handleDownloadJSON}
        onImportJSON={handleImportJSON}
        onExportPDF={handleExportPDF}
        onExportDocx={handleExportDocx}
        onSettings={handleSettings}
        onShare={handleShare}
      />
      
      <MagazineSettingsDialog
        magazine={magazine}
        open={settingsOpen}
        onOpenChange={setSettingsOpen}
        onUpdate={updateMagazine}
      />
      
      <ShareEmbedModal
        open={shareOpen}
        onOpenChange={setShareOpen}
        issueId={magazine.id}
        issueTitle={magazine.title}
      />
      
      <NewIssueDialog
        open={newIssueOpen}
        onOpenChange={setNewIssueOpen}
        onCreate={handleCreateIssue}
        hasCurrentIssue={!!currentIssue}
      />
      
      <div className="flex-1 flex overflow-hidden">
        <div className="w-64 flex-shrink-0">
          <SectionList
            sections={magazine.sections}
            selectedSectionId={selectedSectionId}
            onSelectSection={handleSelectSection}
            onAddSection={handleAddSection}
            onDeleteSection={handleDeleteSection}
            onSelectCover={handleSelectCover}
            isCoverSelected={isCoverSelected}
          />
        </div>
        
        <div className="flex-1 flex overflow-hidden">
          <div className="w-1/2 overflow-hidden">
            {isCoverSelected ? (
              <CoverEditor magazine={magazine} onUpdate={updateMagazine} />
            ) : selectedSection ? (
              <SectionEditor section={selectedSection} onUpdate={handleUpdateSection} />
            ) : (
              <div className="h-full flex items-center justify-center text-muted-foreground">
                Select the cover or a section to edit
              </div>
            )}
          </div>
          
          <div className="w-1/2 overflow-hidden">
            <PreviewPanel magazine={magazine} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Builder;
