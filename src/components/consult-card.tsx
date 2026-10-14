import type { LucideIcon } from "lucide-react";

export function ConsultCard({
  icon: Icon,
  title,
  description,
  href,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  href: string;
}) {
  return (
    <a
      href={href}
      target={href.startsWith("http") ? "_blank" : undefined}
      rel={href.startsWith("http") ? "noreferrer" : undefined}
      className="flex items-start gap-4 rounded-2xl border border-border bg-surface p-5 transition hover:-translate-y-0.5 hover:border-brand hover:shadow-md hover:shadow-brand/5"
    >
      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-brand-light text-brand">
        <Icon className="h-5 w-5" />
      </span>
      <div>
        <p className="font-medium">{title}</p>
        <p className="mt-1 text-sm text-muted">{description}</p>
      </div>
    </a>
  );
}
