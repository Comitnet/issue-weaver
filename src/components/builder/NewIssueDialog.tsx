/**
 * Dialog for creating a new magazine issue
 */

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { IssueTemplate } from "@/hooks/useIssues";

interface NewIssueDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreate: (title: string, template: IssueTemplate) => void;
  hasCurrentIssue: boolean;
}

export function NewIssueDialog({
  open,
  onOpenChange,
  onCreate,
  hasCurrentIssue,
}: NewIssueDialogProps) {
  const [title, setTitle] = useState("");
  const [template, setTemplate] = useState<IssueTemplate>("blank");

  const handleCreate = () => {
    if (!title.trim()) return;
    onCreate(title.trim(), template);
    setTitle("");
    setTemplate("blank");
    onOpenChange(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && title.trim()) {
      handleCreate();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Issue</DialogTitle>
          <DialogDescription>
            Start a new magazine issue. Choose a template to get started.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="title">Issue Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="e.g., Spring 2025 Issue"
              autoFocus
            />
          </div>

          <div className="grid gap-2">
            <Label>Template</Label>
            <RadioGroup
              value={template}
              onValueChange={(value) => setTemplate(value as IssueTemplate)}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="blank" id="blank" />
                <Label htmlFor="blank" className="font-normal cursor-pointer">
                  Blank issue (minimal structure)
                </Label>
              </div>
              {hasCurrentIssue && (
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="current" id="current" />
                  <Label htmlFor="current" className="font-normal cursor-pointer">
                    Copy from current issue
                  </Label>
                </div>
              )}
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="demo" id="demo" />
                <Label htmlFor="demo" className="font-normal cursor-pointer">
                  From demo template
                </Label>
              </div>
            </RadioGroup>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleCreate} disabled={!title.trim()}>
            Create Issue
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
