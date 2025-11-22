import { Magazine } from "@/types/magazine";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CoverPreview } from "./CoverPreview";
import { InsidePreview } from "./InsidePreview";

interface PreviewPanelProps {
  magazine: Magazine;
}

export const PreviewPanel = ({ magazine }: PreviewPanelProps) => {
  return (
    <div className="h-full bg-muted/30 p-6 overflow-y-auto">
      <Tabs defaultValue="cover" className="h-full">
        <TabsList className="mb-4 w-full">
          <TabsTrigger value="cover" className="flex-1">Cover Preview</TabsTrigger>
          <TabsTrigger value="inside" className="flex-1">Inside Preview</TabsTrigger>
        </TabsList>
        
        <TabsContent value="cover" className="mt-0">
          <div className="flex justify-center">
            <div className="w-full max-w-sm">
              <CoverPreview magazine={magazine} />
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="inside" className="mt-0">
          <div className="flex justify-center">
            <div className="w-full">
              <InsidePreview magazine={magazine} />
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
