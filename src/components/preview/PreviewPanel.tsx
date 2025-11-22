import { Magazine } from "@/types/magazine";
import { Button } from "@/components/ui/button";
import { CoverPreview } from "./CoverPreview";
import { ContentsPagePreview } from "./ContentsPagePreview";
import { SectionPagePreview } from "./SectionPagePreview";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

interface PreviewPanelProps {
  magazine: Magazine;
}

export const PreviewPanel = ({ magazine }: PreviewPanelProps) => {
  const [currentPage, setCurrentPage] = useState(0);
  const totalPages = 2 + magazine.sections.length; // Cover + Contents + Sections

  const goToPrevPage = () => {
    setCurrentPage((prev) => Math.max(0, prev - 1));
  };

  const goToNextPage = () => {
    setCurrentPage((prev) => Math.min(totalPages - 1, prev + 1));
  };

  const renderPage = () => {
    if (currentPage === 0) {
      return <CoverPreview magazine={magazine} />;
    } else if (currentPage === 1) {
      return <ContentsPagePreview magazine={magazine} />;
    } else {
      const sectionIndex = currentPage - 2;
      return <SectionPagePreview magazine={magazine} section={magazine.sections[sectionIndex]} />;
    }
  };

  const getPageTitle = () => {
    if (currentPage === 0) return "Cover";
    if (currentPage === 1) return "Contents";
    return magazine.sections[currentPage - 2]?.title || "Section";
  };

  return (
    <div className="h-full bg-muted/30 p-6 overflow-y-auto flex flex-col">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={goToPrevPage}
            disabled={currentPage === 0}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm font-medium">
            Page {currentPage + 1} of {totalPages} - {getPageTitle()}
          </span>
          <Button
            variant="outline"
            size="icon"
            onClick={goToNextPage}
            disabled={currentPage === totalPages - 1}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <div className="flex-1 flex justify-center items-start">
        <div className="w-full max-w-md">
          {renderPage()}
        </div>
      </div>
    </div>
  );
};
