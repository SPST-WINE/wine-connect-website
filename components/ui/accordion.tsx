'use client';

import * as React from 'react';

// === utility interna per unire classi ===
function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(' ');
}

// === tipi di base ===
type RootProps = {
  type?: 'single' | 'multiple';
  defaultValue?: string | string[];
  value?: string | string[];
  onValueChange?: (val: string | string[]) => void;
  className?: string;
  children: React.ReactNode;
};

// === contesto interno ===
const AccordionContext = React.createContext<{
  type: 'single' | 'multiple';
  value: string[];
  setValue: (next: string[]) => void;
} | null>(null);

// === ROOT ===
export function Accordion({
  type = 'single',
  defaultValue,
  value,
  onValueChange,
  className,
  children,
}: RootProps) {
  const controlled = value !== undefined;
  const [internal, setInternal] = React.useState<string[]>(
    Array.isArray(defaultValue)
      ? defaultValue
      : defaultValue
      ? [defaultValue]
      : []
  );

  const current = controlled
    ? Array.isArray(value)
      ? value
      : value
      ? [value]
      : []
    : internal;

  const setValue = (next: string[]) => {
    if (!controlled) setInternal(next);
    onValueChange?.(type === 'single' ? next[0] ?? '' : next);
  };

  return (
    <AccordionContext.Provider value={{ type, value: current, setValue }}>
      <div className={className}>{children}</div>
    </AccordionContext.Provider>
  );
}

// === ITEM ===
type ItemProps = { value: string; className?: string; children: React.ReactNode };
export function AccordionItem({ value, className, children }: ItemProps) {
  const ctx = React.useContext(AccordionContext)!;
  const open = ctx.value.includes(value);
  return (
    <div
      data-state={open ? 'open' : 'closed'}
      className={cx(
        'rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-md',
        'transition-colors', // niente hover
        className
      )}
    >
      {React.Children.map(children, (child) =>
        React.isValidElement(child)
          ? React.cloneElement(child as any, { __acVal: value })
          : child
      )}
    </div>
  );
}

// === TRIGGER ===
type TriggerProps = React.ButtonHTMLAttributes<HTMLButtonElement> & { __acVal?: string };
export function AccordionTrigger({
  __acVal,
  className,
  children,
  ...btn
}: TriggerProps) {
  const ctx = React.useContext(AccordionContext)!;
  const value = __acVal!;
  const open = ctx.value.includes(value);

  return (
    <button
      type="button"
      aria-expanded={open}
      onClick={() => {
        if (ctx.type === 'single') {
          ctx.setValue(open ? [] : [value]);
        } else {
          ctx.setValue(
            open ? ctx.value.filter((v) => v !== value) : [...ctx.value, value]
          );
        }
      }}
      className={cx(
        'w-full px-5 py-4 rounded-2xl text-left',
        'flex items-center justify-between gap-4',
        'focus:outline-none focus:ring-2 focus:ring-white/20',
        'transition-transform duration-200',
        className
      )}
      {...btn}
    >
      <span className="text-[15px] md:text-base">{children}</span>
      <svg
        className={cx(
          'h-4 w-4 shrink-0 transition-transform',
          open && 'rotate-180'
        )}
        viewBox="0 0 20 20"
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 10.94l3.71-3.71a.75.75 0 1 1 1.06 1.06l-4.24 4.25a.75.75 0 0 1-1.06 0L5.21 8.29a.75.75 0 0 1 .02-1.08z" />
      </svg>
    </button>
  );
}

// === CONTENT ===
type ContentProps = { __acVal?: string; className?: string; children: React.ReactNode };
export function AccordionContent({
  __acVal,
  className,
  children,
}: ContentProps) {
  const ctx = React.useContext(AccordionContext)!;
  const value = __acVal!;
  const open = ctx.value.includes(value);

  // transizione fluida dell’altezza
  const ref = React.useRef<HTMLDivElement>(null);
  const [height, setHeight] = React.useState(0);

  React.useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    setHeight(open ? el.scrollHeight : 0);
  }, [open, children]);

  return (
    <div
      style={{ height }}
      className={cx(
        'grid overflow-hidden transition-[height] duration-300 ease-out',
        className
      )}
    >
      <div ref={ref} className="px-5 pb-5 text-sm text-white/80">
        {children}
      </div>
    </div>
  );
}
