// components/ui/button.tsx
"use client";

import * as React from "react";

/**
 * Minimal Button component (no external deps).
 * Supports `asChild` (wrapping a single child, e.g. <Link />) and `variant`, `size`.
 */
type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  asChild?: boolean;
  variant?: "default" | "outline";
  size?: "sm" | "md" | "lg";
  className?: string;
  children: React.ReactNode;
};

function cx(...classes: (string | undefined | false)[]) {
  return classes.filter(Boolean).join(" ");
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ asChild, variant = "default", size = "md", className, children, ...props }, ref) => {
    const base =
      "inline-flex items-center justify-center rounded-2xl font-semibold transition-all duration-150 focus:outline-none focus-visible:ring";
    const variants = {
      default: "bg-white text-black hover:translate-y-[-1px]",
      outline: "border border-white/25 text-white hover:bg-white/5",
    } as const;
    const sizes = {
      sm: "h-9 px-3 text-sm",
      md: "h-10 px-4 text-sm",
      lg: "h-12 px-5 text-base",
    } as const;

    const classes = cx(base, variants[variant], sizes[size], className);

    if (asChild) {
      // Clone the single child (e.g., <Link />) and inject className
      const child = React.Children.only(children) as React.ReactElement<any>;
      return React.cloneElement(child, {
        className: cx(child.props.className, classes),
      });
    }

    return (
      <button ref={ref} className={classes} {...props}>
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";
