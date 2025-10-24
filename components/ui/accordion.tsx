// components/ui/accordion.tsx
"use client";

import * as React from "react";

type AccordionContextValue = {
  type: "single";
  collapsible?: boolean;
  openItem: string | null;
  setOpenItem: (v: string | null) => void;
};

const AccordionContext = React.createContext<AccordionContextValue | null>(null);

export function Accordion({
  type = "single",
  collapsible,
  className,
  children,
}: {
  type?: "single";
  collapsible?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  const [openItem, setOpenItem] = React.useState<string | null>(null);

  return (
    <AccordionContext.Provider value={{ type, collapsible, openItem, setOpenItem }}>
      <div className={className}>{children}</div>
    </AccordionContext.Provider>
  );
}

export function AccordionItem({
  value,
  className,
  children,
}: {
  value: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div data-accordion-item={value} className={className}>
      {children}
    </div>
  );
}

export function AccordionTrigger({
  children,
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const ctx = React.useContext(AccordionContext);
  if (!ctx) throw new Error("AccordionTrigger must be used within Accordion");

  // find nearest item value
  const itemValue =
    (props as any)["data-item"] ||
    (function findValue(node: HTMLElement | null): string | null {
      while (node) {
        const v = node.getAttribute?.("data-accordion-item");
        if (v) return v;
        node = node.parentElement;
      }
      return null;
    })(undefined as any);

  // We’ll read via ref on click instead
  const btnRef = React.useRef<HTMLButtonElement>(null);

  function handleClick(e: React.MouseEvent<HTMLButtonElement>) {
    const btn = btnRef.current!;
    let container: HTMLElement | null = btn;
    let value: string | null = null;
    while (container) {
      const v = container.getAttribute("data-accordion-item");
      if (v) {
        value = v;
        break;
      }
      container = container.parentElement;
    }
    if (!value) return;

    if (ctx.openItem === value) {
      if (ctx.collapsible) ctx.setOpenItem(null);
    } else {
      ctx.setOpenItem(value);
    }
    props.onClick?.(e);
  }

  const isOpen = false; // aria-expanded will be set at render by reading context + nearest item below
  return (
    <button
      ref={btnRef}
      {...props}
      className={
        "w-full text-left py-3 font-medium flex items-center justify-between border-b border-white/10 " +
        (className || "")
      }
      aria-expanded={isOpen}
      onClick={handleClick}
    >
      <span>{children}</span>
      <span aria-hidden className="ml-3 text-white/60">▾</span>
    </button>
  );
}

export function AccordionContent({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  const ctx = React.useContext(AccordionContext);
  if (!ctx) throw new Error("AccordionContent must be used within Accordion");

  // find nearest item value
  const [value, setValue] = React.useState<string | null>(null);
  const ref = React.useRef<HTMLDivElement>(null);
  React.useEffect(() => {
    const node = ref.current;
    if (!node) return;
    let container: HTMLElement | null = node;
    while (container) {
      const v = container.getAttribute("data-accordion-item");
      if (v) {
        setValue(v);
        break;
      }
      container = container.parentElement;
    }
  }, []);

  const open = value ? ctx.openItem === value : false;

  return (
    <div
      ref={ref}
      {...props}
      className={
        "overflow-hidden transition-[grid-template-rows] duration-200 " +
        (open ? "grid grid-rows-[1fr]" : "grid grid-rows-[0fr]") +
        " " +
        (className || "")
      }
    >
      <div className="min-h-0">
        <div className="py-3 text-sm text-white/80">{children}</div>
      </div>
    </div>
  );
}
