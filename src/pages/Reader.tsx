import { useParams, useSearchParams } from "react-router-dom";
import { useState, useMemo, useEffect } from "react";
import { Magazine } from "@/types/magazine";
import { loadMagazineById } from "@/lib/magazineStorage";
import { paginateMagazine } from "@/lib/pagination";
import { MagazinePageView } from "@/components/preview/MagazinePageView";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Home } from "lucide-react";

const Reader = () => {
  const { issueId } = useParams<{ issueId: string }>();
  const [searchParams] = useSearchParams();
  const isEmbed = searchParams.get("embed") === "1";

  const [magazine, setMagazine] = useState<Magazine | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);

  useEffect(() => {
    if (issueId) {
      const loaded = loadMagazineById(issueId);
      setMagazine(loaded);
    }
    setLoading(false);
  }, [issueId]);

  const pages = useMemo(
    () => (magazine ? paginateMagazine(magazine) : []),
    [magazine]
  );
  const totalPages = pages.length;

  const goToPrevPage = () => {
    setCurrentPage((prev) => Math.max(0, prev - 1));
  };

  const goToNextPage = () => {
    setCurrentPage((prev) => Math.min(totalPages - 1, prev + 1));
  };

  const goToStart = () => {
    setCurrentPage(0);
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/30">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  // Not found state
  if (!magazine) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-muted/30 p-4">
        <h1 className="text-2xl font-bold text-foreground mb-2">
          Issue Not Found
        </h1>
        <p className="text-muted-foreground text-center max-w-md">
          This magazine issue could not be found. It may have been removed or the
          link may be incorrect.
        </p>
      </div>
    );
  }

  const currentMagazinePage = pages[currentPage];

  // Embed mode: minimal chrome, just the magazine and navigation
  if (isEmbed) {
    return (
      <div className="w-full h-full min-h-screen bg-neutral-100 flex flex-col">
        {/* Magazine content */}
        <div className="flex-1 flex justify-center items-start p-2 overflow-auto">
          <div className="w-full max-w-[800px]">
            {currentMagazinePage && (
              <MagazinePageView magazine={magazine} page={currentMagazinePage} />
            )}
          </div>
        </div>

        {/* Compact navigation bar */}
        <div className="flex-shrink-0 bg-white/90 backdrop-blur border-t border-neutral-200 px-4 py-2">
          <div className="flex items-center justify-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={goToStart}
              disabled={currentPage === 0}
              className="h-8 w-8 p-0"
            >
              <Home className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={goToPrevPage}
              disabled={currentPage === 0}
              className="h-8 w-8 p-0"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-xs text-neutral-600 min-w-[80px] text-center">
              {currentPage + 1} / {totalPages}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={goToNextPage}
              disabled={currentPage === totalPages - 1}
              className="h-8 w-8 p-0"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Full reader mode: with header and better styling
  return (
    <div className="min-h-screen bg-muted/30 flex flex-col">
      {/* Header */}
      <header className="bg-card border-b border-border px-6 py-4 flex-shrink-0">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-foreground">
              {magazine.title}
            </h1>
            <p className="text-sm text-muted-foreground">
              Issue {magazine.issueNumber} • {magazine.publisherName}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={goToStart}
              disabled={currentPage === 0}
              title="Go to cover"
            >
              <Home className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={goToPrevPage}
              disabled={currentPage === 0}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm font-medium min-w-[100px] text-center">
              Page {currentPage + 1} of {totalPages}
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
      </header>

      {/* Magazine content */}
      <div className="flex-1 flex justify-center items-start p-6 overflow-auto">
        <div className="w-full max-w-[800px]">
          {currentMagazinePage && (
            <MagazinePageView magazine={magazine} page={currentMagazinePage} />
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-card border-t border-border px-6 py-3 flex-shrink-0">
        <div className="max-w-4xl mx-auto text-center text-sm text-muted-foreground">
          Published {magazine.publicationDate}
          {magazine.publisherWebsite && (
            <>
              {" • "}
              <a
                href={magazine.publisherWebsite}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline text-primary"
              >
                {magazine.publisherWebsite.replace(/^https?:\/\//, "")}
              </a>
            </>
          )}
        </div>
      </footer>
    </div>
  );
};

export default Reader;
