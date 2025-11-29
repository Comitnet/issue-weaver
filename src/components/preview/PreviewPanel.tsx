import { Magazine } from "@/types/magazine";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, RotateCcw } from "lucide-react";
import { useState, useMemo } from "react";
import { MagazinePageView } from "./MagazinePageView";
import { paginateMagazine } from "@/lib/pagination";

interface PreviewPanelProps {
  magazine: Magazine;
}

export const PreviewPanel = ({ magazine }: PreviewPanelProps) => {
  const [currentPage, setCurrentPage] = useState(0);
  
  const pages = useMemo(() => paginateMagazine(magazine), [magazine]);
  const totalPages = pages.length;

  const goToPrevPage = () => {
    setCurrentPage((prev) => Math.max(0, prev - 1));
  };

  const goToNextPage = () => {
    setCurrentPage((prev) => Math.min(totalPages - 1, prev + 1));
  };

  const currentMagazinePage = pages[currentPage];

  const getPageTitle = () => {
    if (!currentMagazinePage) return "";
    if (currentMagazinePage.kind === "cover") return "Cover";
    if (currentMagazinePage.kind === "contents") return "Contents";
    if (currentMagazinePage.article) {
      return currentMagazinePage.article.sectionTitle;
    }
    return "";
  };

  return (
    <div className="h-full bg-muted/30 p-6 overflow-y-auto flex flex-col">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setCurrentPage(0)}
            title="Go to cover"
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
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
        <div className="w-full max-w-[800px]">
          {currentMagazinePage && (
            <MagazinePageView magazine={magazine} page={currentMagazinePage} />
          )}
        </div>
      </div>
    </div>
  );
};
