// components/ui/accordion.tsx
"use client";

import * as React from "react";

/* ----------------------------- Context & Hook ----------------------------- */

type AccordionContextValue = {
  type: "single";
  collapsible?: boolean;
  openItem: string | null;
  setOpenItem: (v: string | null) => void;
};

const AccordionContext = React.createContext<AccordionContextValue | null>(null);

function useAccordionContext(): AccordionContextValue {
  const ctx = React.useContext(AccordionContext);
  if (!ctx) {
    throw new Error("Accordion components must be used within <Accordion>.");
  }
  return ctx;
}

/* --------------------------------- Utils --------------------------------- */

function findItemValueFrom(node: HTMLElement | null): string | null {
  while (node) {
    const v = node.getAttribute?.("data-accordion-item");
    if (v) return v;
    node = node.parentElement;
  }
  return null;
}

/* --------------------------------- Root ---------------------------------- */

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

/* --------------------------------- Item ---------------------------------- */

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

/* -------------------------------- Trigger -------------------------------- */

export function AccordionTrigger({
  children,
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const ctx = useAccordionContext();

  const btnRef = React.useRef<HTMLButtonElement>(null);
  const [itemValue, setItemValue] = React.useState<string | null>(null);

  // On mount, discover the closest AccordionItem value
  React.useEffect(() => {
    const btn = btnRef.current;
    if (!btn) return;
    setItemValue(findItemValueFrom(btn));
  }, []);

  const isOpen = itemValue ? ctx.openItem === itemValue : false;

  function handleClick(e: React.MouseEvent<HTMLButtonElement>) {
    if (!itemValue) return;

    if (ctx.openItem === itemValue) {
      if (ctx.collapsible) ctx.setOpenItem(null);
    } else {
      ctx.setOpenItem(itemValue);
    }
    props.onClick?.(e);
  }

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
      type={props.type ?? "button"}
    >
      <span>{children}</span>
      <span aria-hidden className="ml-3 text-white/60" style={{ transform: isOpen ? "rotate(180deg)" : "none", transition: "transform .2s" }}>
        ▾
      </span>
    </button>
  );
}

/* -------------------------------- Content -------------------------------- */

export function AccordionContent({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  const ctx = useAccordionContext();

  const ref = React.useRef<HTMLDivElement>(null);
  const [itemValue, setItemValue] = React.useState<string | null>(null);

  React.useEffect(() => {
    setItemValue(findItemValueFrom(ref.current));
  }, []);

  const open = itemValue ? ctx.openItem === itemValue : false;

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
      aria-hidden={!open}
    >
      <div className="min-h-0">
        <div className="py-3 text-sm text-white/80">{children}</div>
      </div>
    </div>
  );
}
