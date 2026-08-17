"use client";

import { ReactNode } from "react";
import { ChevronRight, MoreHorizontal } from "lucide-react";

export function Card({ children, className = "", id }: { children: ReactNode; className?: string; id?: string }) {
  return <section id={id} className={`card ${className}`}>{children}</section>;
}

export function CardHeader({ eyebrow, title, action }: { eyebrow?: string; title: string; action?: ReactNode }) {
  return (
    <header className="card-header">
      <div>{eyebrow && <span className="eyebrow">{eyebrow}</span>}<h2>{title}</h2></div>
      {action ?? <button className="icon-button" aria-label={`More options for ${title}`}><MoreHorizontal size={18} /></button>}
    </header>
  );
}

export function LinkButton({ children, onClick }: { children: ReactNode; onClick?: () => void }) {
  return <button className="link-button" onClick={onClick}>{children}<ChevronRight size={15} /></button>;
}

export function Pill({ children, tone = "neutral" }: { children: ReactNode; tone?: string }) {
  return <span className={`pill pill-${tone.toLowerCase()}`}>{children}</span>;
}

export const money = (n: number) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);
