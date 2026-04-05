//
import { forwardRef } from "react";
import type { ComponentProps, ComponentPropsWithRef } from "react";

import { cn } from "@/lib/utils";
import type { NodeStatus } from "./node-status-indicator";
import { CheckCircle2Icon, Loader2Icon, XCircleIcon } from "lucide-react";

interface BaseNodeProps extends ComponentPropsWithRef<"div"> {
  status?: NodeStatus;
}

export const BaseNode = forwardRef<HTMLDivElement, BaseNodeProps>(
  ({ className, status, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "bg-card text-card-foreground relative rounded-sm border-muted-foreground hover:bg-accent",
          className,
        )}
        {...props}
      >
        {children}

        {status === "error" && (
          <XCircleIcon className="absolute right-0.5 bottom-0.5 size-2 text-red-700 stroke-3" />
        )}
        {status === "success" && (
          <CheckCircle2Icon className="absolute right-0.5 bottom-0.5 size-2 text-green-700 stroke-3" />
        )}
        {status === "loading" && (
          <Loader2Icon className="absolute -right-0.5 -bottom-0.5 size-2 text-blue-700 stroke-3 animate-spin" />
        )}
      </div>
    );
  },
);

BaseNode.displayName = "BaseNode";

// ---------------- HEADER ----------------

export function BaseNodeHeader({
  className,
  ...props
}: ComponentProps<"header">) {
  return (
    <header
      {...props}
      className={cn(
        "mx-0 my-0 -mb-1 flex flex-row items-center justify-between gap-2 px-3 py-2",
        className,
      )}
    />
  );
}

// ---------------- TITLE ----------------

export function BaseNodeHeaderTitle({
  className,
  ...props
}: ComponentProps<"h3">) {
  return (
    <h3
      data-slot="base-node-title"
      className={cn("user-select-none flex-1 font-semibold", className)}
      {...props}
    />
  );
}

// ---------------- CONTENT ----------------

export function BaseNodeContent({
  className,
  ...props
}: ComponentProps<"div">) {
  return (
    <div
      data-slot="base-node-content"
      className={cn("flex flex-col gap-y-2 p-3", className)}
      {...props}
    />
  );
}

// ---------------- FOOTER ----------------

export function BaseNodeFooter({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="base-node-footer"
      className={cn(
        "flex flex-col items-center gap-y-2 border-t px-3 pt-2 pb-3",
        className,
      )}
      {...props}
    />
  );
}
