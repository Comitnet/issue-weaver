import { useNavigate, useLocation } from "react-router-dom";
import { Magazine } from "@/types/magazine";
import { Button } from "@/components/ui/button";
import { MagazinePageView } from "@/components/preview/MagazinePageView";
import { paginateMagazine } from "@/lib/pagination";
import { ArrowLeft, Printer } from "lucide-react";
import { useEffect, useState, useMemo } from "react";

const Print = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [magazine, setMagazine] = useState<Magazine | null>(null);
  
  const pages = useMemo(() => (magazine ? paginateMagazine(magazine) : []), [magazine]);

  useEffect(() => {
    // Try to get magazine from navigation state first
    if (location.state?.magazine) {
      setMagazine(location.state.magazine);
    } else {
      // Fallback to localStorage
      const stored = localStorage.getItem('magazine-builder-current');
      if (stored) {
        try {
          setMagazine(JSON.parse(stored));
        } catch (e) {
          console.error('Failed to load magazine:', e);
          navigate('/');
        }
      } else {
        navigate('/');
      }
    }
  }, [location.state, navigate]);

  const handlePrint = () => {
    window.print();
  };

  const handleBack = () => {
    navigate('/');
  };

  if (!magazine) {
    return (
      <div className="h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Loading magazine...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header - hidden when printing */}
      <header className="print-hide sticky top-0 z-10 bg-background border-b px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={handleBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Editor
          </Button>
          <div>
            <h1 className="font-semibold">{magazine.title}</h1>
            <p className="text-xs text-muted-foreground">Issue {magazine.issueNumber} - Print Preview</p>
          </div>
        </div>
        <Button onClick={handlePrint}>
          <Printer className="h-4 w-4 mr-2" />
          Print / Save as PDF
        </Button>
      </header>

      {/* Magazine pages */}
      <div className="print-container py-8 px-4 space-y-8">
        {pages.map((page) => (
          <div key={page.index} className="print-page mx-auto max-w-[800px]">
            <MagazinePageView magazine={magazine} page={page} />
          </div>
        ))}
      </div>

      {/* Print instructions - hidden when printing */}
      <div className="print-hide fixed bottom-4 right-4 bg-muted p-4 rounded-lg shadow-lg max-w-sm">
        <p className="text-sm">
          Click "Print / Save as PDF" above, then select "Save as PDF" in your browser's print dialog.
        </p>
      </div>
    </div>
  );
};

export default Print;
