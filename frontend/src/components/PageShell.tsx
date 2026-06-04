import { type ReactNode } from "react";

interface PageShellProps {
  /** Small all-caps eyebrow label above the title */
  eyebrow?: string;
  title: string;
  subtitle?: string;
  /** Optional element rendered top-right (button, badge, etc.) */
  action?: ReactNode;
  /** Extra content below the header row (tabs, filters, etc.) */
  header?: ReactNode;
  children: ReactNode;
}

/**
 * Consistent wrapper for every dashboard menu page.
 * Provides: bg-bg canvas, max-w container, padding, and a standard header block.
 * Eliminates the "some pages take the whole screen" inconsistency.
 */
export default function PageShell({ eyebrow, title, subtitle, action, header, children }: PageShellProps) {
  return (
    <div className="bg-bg min-h-[calc(100vh-68px)]">
      <div className="mx-auto max-w-[1180px] px-5 md:px-8 py-8 md:py-10">

        {/* ── page header ── */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">
          <div>
            {eyebrow && (
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-fg-muted">{eyebrow}</p>
            )}
            <h1 className={`font-display font-medium text-fg-strong tracking-[-0.03em] leading-[1.02] ${eyebrow ? "mt-2" : ""} text-[2rem] md:text-[2.4rem]`}>
              {title}
            </h1>
            {subtitle && (
              <p className="mt-2 text-sm text-fg-muted">{subtitle}</p>
            )}
          </div>
          {action && <div className="self-start sm:self-end shrink-0">{action}</div>}
        </div>

        {/* optional sub-header (tabs, filter row, etc.) */}
        {header && <div className="mb-6">{header}</div>}

        {/* page content */}
        {children}
      </div>
    </div>
  );
}
