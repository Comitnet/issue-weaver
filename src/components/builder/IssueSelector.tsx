/**
 * Dropdown to select which issue to work on
 */

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MagazineIssueMeta } from "@/types/issue";
import { format } from "date-fns";

interface IssueSelectorProps {
  issues: MagazineIssueMeta[];
  currentIssueId: string | undefined;
  onSelectIssue: (id: string) => void;
  disabled?: boolean;
}

export function IssueSelector({
  issues,
  currentIssueId,
  onSelectIssue,
  disabled,
}: IssueSelectorProps) {
  if (issues.length === 0) {
    return null;
  }

  return (
    <Select
      value={currentIssueId}
      onValueChange={onSelectIssue}
      disabled={disabled}
    >
      <SelectTrigger className="w-[200px]">
        <SelectValue placeholder="Select issue..." />
      </SelectTrigger>
      <SelectContent>
        {issues.map((issue) => (
          <SelectItem key={issue.id} value={issue.id}>
            <div className="flex flex-col items-start">
              <span className="font-medium">{issue.title}</span>
              <span className="text-xs text-muted-foreground">
                {format(new Date(issue.updatedAt), "MMM d, yyyy")}
              </span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
