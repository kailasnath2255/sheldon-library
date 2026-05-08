import type { ReactNode } from "react";

export default function PageHero({
  title,
  subtitle,
  right,
}: {
  title: string;
  subtitle?: string;
  right?: ReactNode;
}) {
  return (
    <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3 mb-6">
      <div>
        <h1 className="font-display text-3xl md:text-4xl font-extrabold tracking-tight text-navy">
          {title}
        </h1>
        {subtitle && (
          <p className="text-navy/60 mt-1 text-base max-w-2xl">{subtitle}</p>
        )}
      </div>
      {right}
    </div>
  );
}
