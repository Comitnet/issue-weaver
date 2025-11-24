import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMagazine } from "@/hooks/useMagazine";
import { Section } from "@/types/magazine";
import { BuilderHeader } from "@/components/builder/BuilderHeader";
import { SectionList } from "@/components/builder/SectionList";
import { SectionEditor } from "@/components/builder/SectionEditor";
import { CoverEditor } from "@/components/builder/CoverEditor";
import { PreviewPanel } from "@/components/preview/PreviewPanel";
import { MagazineSettingsDialog } from "@/components/builder/MagazineSettingsDialog";
import { toast } from "@/hooks/use-toast";
import { exportMagazineAsDocx } from "@/lib/exportDocx";

const Builder = () => {
  const navigate = useNavigate();
  const { magazine, updateMagazine, resetMagazine, importMagazine, exportMagazine } = useMagazine();
  const [selectedSectionId, setSelectedSectionId] = useState<string | undefined>(
    magazine.sections[0]?.id
  );
  const [isCoverSelected, setIsCoverSelected] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

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

  const handleExportJSON = () => {
    const data = exportMagazine();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${magazine.title.replace(/\s+/g, "-").toLowerCase()}-${magazine.issueNumber}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast({ title: "JSON exported successfully" });
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
            importMagazine(data);
            setSelectedSectionId(data.sections[0]?.id);
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
    toast({ title: "Share & Embed", description: "Share and embed functionality coming soon" });
  };

  const handleNewIssue = () => {
    if (confirm("Create a new issue? Current work will be saved to your previous session.")) {
      resetMagazine();
      setSelectedSectionId(undefined);
      toast({ title: "New issue created" });
    }
  };

  return (
    <div className="flex flex-col h-screen">
      <BuilderHeader
        magazine={magazine}
        onNew={handleNewIssue}
        onExportJSON={handleExportJSON}
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
