"use client";

import * as React from "react";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import { cn } from "@/lib/utils";

function TooltipProvider({ delayDuration = 0, ...props }) {
  return (
    <TooltipPrimitive.Provider
      data-slot="tooltip-provider"
      delayDuration={delayDuration}
      {...props}
    />
  );
}

function Tooltip({ ...props }) {
  return (
    <TooltipProvider>
      <TooltipPrimitive.Root data-slot="tooltip" {...props} />
    </TooltipProvider>
  );
}

function TooltipTrigger({ ...props }) {
  return <TooltipPrimitive.Trigger data-slot="tooltip-trigger" {...props} />;
}

function TooltipContent({ className, sideOffset = 0, children, ...props }) {
  return (
    <TooltipPrimitive.Portal>
      <TooltipPrimitive.Content
        data-slot="tooltip-content"
        sideOffset={sideOffset}
        className={cn(
          "animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-10 w-fit origin-[--radix-tooltip-content-transform-origin] rounded-md border border-gray-700 bg-gray-900 px-3 py-1.5 text-xs text-balance text-white shadow-xl",
          className
        )}
        {...props}
      >
        {children}
        <TooltipPrimitive.Arrow className="z-10 size-2.5 translate-y-[calc(-50%_-_2px)] rotate-45 rounded-[2px] bg-gray-900 fill-gray-900" />
      </TooltipPrimitive.Content>
    </TooltipPrimitive.Portal>
  );
}

const TooltipWrapper = ({ tooltipText, children }) => {
  return (
    <Tooltip>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent>
        <p className="text-[13px]">{tooltipText}</p>
      </TooltipContent>
    </Tooltip>
  );
};

export {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
  TooltipWrapper,
};
