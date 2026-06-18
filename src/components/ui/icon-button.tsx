import * as React from "react";
import { cn } from "@/lib/cn";
import { buttonVariants, type ButtonProps } from "./button";

export interface IconButtonProps extends Omit<ButtonProps, "size"> {
  /**
   * Required aria-label for icon-only buttons.
   * Screen readers announce this; sighted users see the icon.
   */
  "aria-label": string;
}

export const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  function IconButton({ className, variant, ...props }, ref) {
    return (
      <button
        ref={ref}
        className={cn(buttonVariants({ variant, size: "icon" }), className)}
        {...props}
      />
    );
  }
);
