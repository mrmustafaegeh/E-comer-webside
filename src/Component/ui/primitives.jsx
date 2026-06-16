import { clsx } from "clsx";

export function cn(...args) {
  return clsx(args);
}

export function Container({ children, className = "" }) {
  return (
    <div className={cn("mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8", className)}>
      {children}
    </div>
  );
}

export function Section({ children, className = "" }) {
  return (
    <section className={cn("py-16 md:py-20 lg:py-24", className)}>{children}</section>
  );
}

export function Card({ children, className = "", as: Tag = "div", ...props }) {
  return (
    <Tag
      className={cn(
        "rounded-xl border border-[var(--border)] bg-[var(--bg)]",
        className
      )}
      {...props}
    >
      {children}
    </Tag>
  );
}

const buttonStyles = {
  primary:
    "bg-[var(--accent)] text-white hover:bg-neutral-800 border border-[var(--accent)]",
  secondary:
    "bg-[var(--bg)] text-[var(--text)] border border-[var(--border)] hover:border-neutral-300 hover:bg-[var(--bg-subtle)]",
  ghost: "bg-transparent text-[var(--text)] hover:bg-[var(--bg-subtle)] border border-transparent",
};

export function Button({
  children,
  className = "",
  variant = "primary",
  type = "button",
  as: Tag = "button",
  ...props
}) {
  const isNativeButton = Tag === "button";
  return (
    <Tag
      type={isNativeButton ? type : undefined}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-lg px-5 py-2.5 text-sm font-medium transition-all duration-200",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 focus-visible:ring-offset-2",
        "disabled:pointer-events-none disabled:opacity-50",
        buttonStyles[variant] || buttonStyles.primary,
        className
      )}
      {...props}
    >
      {children}
    </Tag>
  );
}

const fieldClass =
  "w-full rounded-lg border border-[var(--border)] bg-[var(--bg)] px-4 py-3 text-sm text-[var(--text)] shadow-sm placeholder:text-neutral-400 transition-[border-color,box-shadow] focus:border-neutral-900 focus:outline-none focus:ring-4 focus:ring-neutral-900/5 disabled:cursor-not-allowed disabled:bg-[var(--bg-subtle)] disabled:opacity-60";

export function Label({ children, className = "", htmlFor, ...props }) {
  return (
    <label
      htmlFor={htmlFor}
      className={cn("block text-sm font-medium text-[var(--text)]", className)}
      {...props}
    >
      {children}
    </label>
  );
}

export function FieldError({ children, className = "" }) {
  if (!children) return null;
  return (
    <p role="alert" className={cn("text-sm text-red-600", className)}>
      {children}
    </p>
  );
}

export function FormField({
  label,
  htmlFor,
  hint,
  error,
  children,
  className = "",
}) {
  return (
    <div className={cn("space-y-2", className)}>
      {label && <Label htmlFor={htmlFor}>{label}</Label>}
      {children}
      {error ? (
        <FieldError>{error}</FieldError>
      ) : hint ? (
        <p className="text-xs text-[var(--text-muted)]">{hint}</p>
      ) : null}
    </div>
  );
}

export function FormActions({ children, className = "" }) {
  return (
    <div
      className={cn(
        "flex flex-col-reverse gap-3 border-t border-[var(--border)] pt-6 sm:flex-row sm:items-center sm:justify-end",
        className
      )}
    >
      {children}
    </div>
  );
}

export function AuthShell({ title, description, footer, children }) {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-[var(--bg)] px-4 py-12 sm:py-16">
      <div className="w-full max-w-[420px]">
        <div className="mb-8">
          <h1 className="font-heading text-2xl font-semibold tracking-tight text-[var(--text)] md:text-3xl">
            {title}
          </h1>
          {description && (
            <p className="mt-2 text-sm leading-relaxed text-[var(--text-muted)]">
              {description}
            </p>
          )}
        </div>
        <div className="rounded-xl border border-[var(--border)] bg-[var(--bg)] p-6 shadow-sm sm:p-8">
          {children}
        </div>
        {footer && (
          <p className="mt-6 text-center text-sm text-[var(--text-muted)]">{footer}</p>
        )}
      </div>
    </div>
  );
}

export function Input({ className = "", ...props }) {
  return <input className={cn(fieldClass, className)} {...props} />;
}

export function Textarea({ className = "", ...props }) {
  return (
    <textarea
      className={cn(fieldClass, "min-h-[120px] resize-y", className)}
      {...props}
    />
  );
}

export function Select({ className = "", children, ...props }) {
  return (
    <select className={cn(fieldClass, className)} {...props}>
      {children}
    </select>
  );
}

export function Badge({ children, className = "", tone = "neutral" }) {
  const tones = {
    neutral: "bg-[var(--bg-subtle)] text-[var(--text-muted)] border-[var(--border)]",
    accent: "bg-neutral-100 text-neutral-900 border-neutral-200",
    dark: "bg-[var(--bg-dark-elevated)] text-[var(--text-muted-on-dark)] border-[var(--border-on-dark)]",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium",
        tones[tone] || tones.neutral,
        className
      )}
    >
      {children}
    </span>
  );
}

export function PageHeader({ eyebrow, title, description, actions, className = "", dark = false }) {
  return (
    <SectionHeader
      label={eyebrow}
      title={title}
      description={description}
      actions={actions}
      className={className}
      dark={dark}
    />
  );
}

export function SectionHeader({
  label,
  title,
  description,
  actions,
  className = "",
  dark = false,
}) {
  return (
    <div
      className={cn(
        "mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between md:mb-12",
        className
      )}
    >
      <div className="max-w-2xl">
        {label && (
          <p
            className={cn(
              "mb-2 text-xs font-medium uppercase tracking-[0.14em]",
              dark ? "text-[var(--text-muted-on-dark)]" : "text-[var(--text-muted)]"
            )}
          >
            {label}
          </p>
        )}
        <h2
          className={cn(
            "font-heading text-2xl font-semibold tracking-tight md:text-3xl lg:text-4xl",
            dark ? "text-[var(--text-on-dark)]" : "text-[var(--text)]"
          )}
        >
          {title}
        </h2>
        {description && (
          <p
            className={cn(
              "mt-3 text-sm leading-relaxed md:text-base",
              dark ? "text-[var(--text-muted-on-dark)]" : "text-[var(--text-muted)]"
            )}
          >
            {description}
          </p>
        )}
      </div>
      {actions && <div className="flex shrink-0 flex-wrap gap-2">{actions}</div>}
    </div>
  );
}

export function EmptyState({ title, description, action, className = "" }) {
  return (
    <Card className={cn("p-10 text-center", className)}>
      <h3 className="text-lg font-semibold text-[var(--text)]">{title}</h3>
      {description && (
        <p className="mt-2 text-sm text-[var(--text-muted)]">{description}</p>
      )}
      {action && <div className="mt-6 flex justify-center">{action}</div>}
    </Card>
  );
}

export function Alert({ children, variant = "info", className = "" }) {
  const variants = {
    info: "border-neutral-200 bg-neutral-50 text-neutral-800",
    error: "border-red-200 bg-red-50 text-red-800",
    success: "border-green-200 bg-green-50 text-green-800",
  };
  return (
    <div
      role="alert"
      className={cn(
        "rounded-lg border px-4 py-3 text-sm",
        variants[variant] || variants.info,
        className
      )}
    >
      {children}
    </div>
  );
}

/** Panel for admin pages — matches storefront tokens */
export function AppPanel({ children, className = "" }) {
  return (
    <Card className={cn("p-4 sm:p-6", className)}>{children}</Card>
  );
}
