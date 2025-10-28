'use client';

import * as React from 'react';
import clsx from 'clsx';

type AccordionRootProps = {
  type?: 'single' | 'multiple';
  defaultValue?: string | string[];
  value?: string | string[];
  onValueChange?: (val: string | string[]) => void;
  className?: string;
  children: React.ReactNode;
};

const AccordionContext = React.createContext<{
  type: 'single' | 'multiple';
  value: string[];                         // always array internally
  setValue: (next: string[]) => void;
} | null>(null);

export function Accordion({
  type = 'single',
  defaultValue,
  value,
  onValueChange,
  className,
  children,
}: AccordionRootProps) {
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

type ItemProps = { value: string; className?: string; children: React.ReactNode };
export function AccordionItem({ value, className, children }: ItemProps) {
  const ctx = React.useContext(AccordionContext)!;
  const open = ctx.value.includes(value);
  return (
    <div
      data-state={open ? 'open' : 'closed'}
      className={clsx(
        'rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-md',
        'hover:bg-white/[0.055] transition-colors',
        className
      )}
    >
      {React.Children.map(children, (child) =>
        React.isValidElement(child) ? React.cloneElement(child as any, { __acVal: value }) : child
      )}
    </div>
  );
}

type TriggerProps = React.ButtonHTMLAttributes<HTMLButtonElement> & { __acVal?: string };
export function AccordionTrigger({ __acVal, className, children, ...btn }: TriggerProps) {
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
          ctx.setValue(open ? ctx.value.filter((v) => v !== value) : [...ctx.value, value]);
        }
      }}
      className={clsx(
        'w-full px-5 py-4 rounded-2xl text-left',
        'flex items-center justify-between gap-4',
        'focus:outline-none focus:ring-2 focus:ring-white/20',
        className
      )}
      {...btn}
    >
      <span className="text-[15px] md:text-base">{children}</span>
      <svg
        className={clsx('h-4 w-4 shrink-0 transition-transform', open && 'rotate-180')}
        viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"
      >
        <path d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 10.94l3.71-3.71a.75.75 0 1 1 1.06 1.06l-4.24 4.25a.75.75 0 0 1-1.06 0L5.21 8.29a.75.75 0 0 1 .02-1.08z" />
      </svg>
    </button>
  );
}

type ContentProps = { __acVal?: string; className?: string; children: React.ReactNode };
export function AccordionContent({ __acVal, className, children }: ContentProps) {
  const ctx = React.useContext(AccordionContext)!;
  const value = __acVal!;
  const open = ctx.value.includes(value);

  // height transition without layout shift
  const ref = React.useRef<HTMLDivElement>(null);
  const [h, setH] = React.useState(0);
  React.useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    setH(open ? el.scrollHeight : 0);
  }, [open, children]);

  return (
    <div
      style={{ height: h }}
      className={clsx(
        'grid overflow-hidden transition-[height] duration-250 ease-out',
        className
      )}
    >
      <div ref={ref} className="px-5 pb-5 text-sm text-white/80">
        {children}
      </div>
    </div>
  );
}
