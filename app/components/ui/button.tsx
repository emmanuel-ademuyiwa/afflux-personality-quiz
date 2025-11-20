import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "~/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center cursor-pointer justify-center whitespace-nowrap rounded-full text-base font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#cc9933]/40 focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:pointer-events-none disabled:opacity-60",
  {
    variants: {
      variant: {
        default:
          "bg-[#cc9933]/80 text-black shadow-[0_10px_30px_rgba(204,153,51,0.3)]",
        outline:
          "border border-[#E5E5E5] bg-transparent text-[#1a1a1a] hover:bg-[#FAFAFA] hover:border-[#cc9933]",
        secondary: "bg-white text-[#1a1a1a] border border-[#E5E5E5] shadow-sm",
        ghost:
          "text-[#666] hover:text-[#1a1a1a] hover:bg-[#FAFAFA] border border-transparent",
        subtle:
          "bg-[#FAFAFA] text-[#1a1a1a] border border-[#E5E5E5] hover:border-[#cc9933]",
      },
      size: {
        default: "h-11 px-6",
        sm: "h-9 px-4 text-xs",
        lg: "h-12 px-8 text-base",
        icon: "h-10 w-10 rounded-full",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";
