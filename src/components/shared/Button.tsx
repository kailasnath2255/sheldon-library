import type { ButtonHTMLAttributes, ReactNode } from "react";
import { forwardRef } from "react";

type Variant = "primary" | "secondary" | "ghost" | "pill";
type Size = "sm" | "md" | "lg";

const VARIANT: Record<Variant, string> = {
  primary:
    "bg-ss-orange-500 text-white border-2 border-ss-ink-900 dark:border-white/50 hover:bg-ss-orange-600 hover:shadow-brand active:bg-ss-orange-700",
  secondary:
    "bg-white dark:bg-deep-surface text-ss-ink-900 dark:text-white border-2 border-ss-ink-900 dark:border-white/50 hover:bg-ss-ink-100 dark:hover:bg-deep-border",
  ghost:
    "bg-transparent text-ss-ink-700 dark:text-ss-ink-200 border-2 border-transparent hover:bg-ss-ink-100 dark:hover:bg-deep-border",
  pill:
    "bg-white dark:bg-deep-surface text-ss-ink-900 dark:text-white border-2 border-ss-ink-900 dark:border-white/50 hover:bg-soft-cream dark:hover:bg-deep-cream/40 hover:shadow-soft-lg",
};

const SIZE: Record<Size, string> = {
  sm: "px-4 py-2 text-sm gap-1.5",
  md: "px-5 py-3 text-sm gap-2",
  lg: "px-6 py-4 text-base gap-2.5",
};

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  icon?: ReactNode;
  iconRight?: ReactNode;
}

const Button = forwardRef<HTMLButtonElement, Props>(function Button(
  { variant = "primary", size = "md", icon, iconRight, className = "", children, ...rest },
  ref
) {
  return (
    <button
      ref={ref}
      className={`inline-flex items-center justify-center font-semibold rounded-full transition duration-300 ease-out hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] disabled:opacity-40 disabled:translate-y-0 disabled:cursor-not-allowed ${VARIANT[variant]} ${SIZE[size]} ${className}`}
      {...rest}
    >
      {icon ? <span className="shrink-0 inline-flex items-center justify-center">{icon}</span> : null}
      {children}
      {iconRight ? <span className="shrink-0 inline-flex items-center justify-center">{iconRight}</span> : null}
    </button>
  );
});

export default Button;
