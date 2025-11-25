import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface PageFrameProps {
  children: ReactNode;
  className?: string;
}

export const PageFrame = ({ children, className }: PageFrameProps) => {
  return (
    <div
      className={cn(
        "w-full aspect-[210/297] overflow-hidden bg-white shadow-2xl print:shadow-none print-page",
        className
      )}
    >
      {children}
    </div>
  );
};
