import React from "react";
import { Link } from "react-router-dom";
import { BoxIcon } from "lucide-react";
interface Props {
  icon: BoxIcon;
  title: string;
  description: string;
  actionLabel?: string;
  actionTo?: string;
  onAction?: () => void;
}
export function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  actionTo,
  onAction
}: Props) {
  return <div className="glass mx-auto flex max-w-md flex-col items-center rounded-3xl px-8 py-14 text-center">
      <span className="flex h-16 w-16 items-center justify-center rounded-full border border-magenta/30 bg-magenta/10 text-magenta">
        <Icon className="h-7 w-7" />
      </span>
      <h2 className="mt-6 font-display text-2xl">{title}</h2>
      <p className="mt-2 text-sm leading-relaxed text-mist">{description}</p>
      {actionLabel && actionTo && <Link to={actionTo} className="mt-7 rounded-full bg-magenta px-6 py-3 text-sm font-semibold text-white shadow-glow transition-transform duration-150 ease-smooth hover:bg-magenta/90 active:scale-95">
          {actionLabel}
        </Link>}
      {actionLabel && !actionTo && onAction && <button type="button" onClick={onAction} className="mt-7 rounded-full bg-magenta px-6 py-3 text-sm font-semibold text-white shadow-glow transition-transform duration-150 ease-smooth hover:bg-magenta/90 active:scale-95">
          {actionLabel}
        </button>}
    </div>;
}