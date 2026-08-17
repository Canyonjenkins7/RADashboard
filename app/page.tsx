"use client";

import { useMemo, useState } from "react";
import { AlertTriangle, ArrowDownRight, ArrowUpRight, BarChart3, Bell, CalendarDays, Check, ChevronDown, CircleDollarSign, Clock3, Filter, HandCoins, Instagram, LayoutDashboard, Menu, PackageCheck, Search, Send, Settings2, ShieldAlert, Sparkles, Target, UserRound, UsersRound, X } from "lucide-react";
import { attentionItems as initialItems, followUp, inbound, moneyStill, pipeline, podActivity, reorders, topDeals, AttentionItem } from "@/lib/dashboard-data";
import { Card, CardHeader, LinkButton, Pill, money } from "@/components/ui";

type DetailView = "money" | "pipeline" | "reorders" | null;

const nav = [
  { label: "Command Center", icon: LayoutDashboard, active: true },
  { label: "Attention Queue", icon: ShieldAlert },
  { label: "Pipeline", icon: BarChart3 },
  { label: "Accounts", icon: UsersRound },
  { label: "Pod Activity", icon: Sparkles },
];

function MetricCard({ label, value, note, icon: Icon, tone, onClick }: { label: string; value: string; note: string; icon: typeof AlertTriangle; tone: string; onClick?: () => void }) {
  return (
    <button className={`metric-card metric-${tone}`} onClick={onClick}>
      <div className="metric-top"><span className="metric-icon"><Icon size={18} /></span><ArrowUpRight size={17} className="metric-arrow" /></div>
      <div><span className="metric-label">{label}</span><strong>{value}</strong><small>{note}</small></div>
    </button>
  );
}

export default function Dashboard() {
  const [items, setItems] = useState(initialItems);
  const [detail, setDetail] = useState<DetailView>(null);
  const [mobileNav, setMobileNav] = useState(false);
  const [toast, setToast] = useState("");
  const [priority, setPriority] = useState("All priorities");
  const [assignee, setAssignee] = useState<number | null>(null);

  const visibleItems = useMemo(() => priority === "All priorities" ? items : items.filter((item) => item.priority === priority), [items, priority]);
  const showToast = (message: string) => { setToast(message); window.setTimeout(() => setToast(""), 2200); };
  const resolve = (id: number) => { setItems((current) => current.filter((item) => item.id !== id)); showToast("Item marked resolved"); };
  const assign = (id: number, owner: string) => { setItems((current) => current.map((item) => item.id === id ? { ...item, owner } : item)); setAssignee(null); showToast(`Assigned to ${owner}`); };

  return (
    <div className="app-shell">
      <aside className={`sidebar ${mobileNav ? "sidebar-open" : ""}`}>
        <div className="brand"><div className="brand-mark">RP</div><div><strong>Religious</strong><span>PACKAGING</span></div><button className="mobile-close" onClick={() => setMobileNav(false)}><X size={20}/></button></div>
        <nav>{nav.map(({ label, icon: Icon, active }) => <button key={label} className={active ? "active" : ""}><Icon size={18}/><span>{label}</span>{label === "Attention Queue" && <b>{items.length}</b>}</button>)}</nav>
        <div className="sidebar-bottom"><div className="pod-badge"><Sparkles size={17}/><div><strong>Orbal Pod</strong><span>Active now</span></div><i /></div><button><Settings2 size={18}/>Settings</button><div className="profile"><div className="avatar">CJ</div><div><strong>Canyon Jenkins</strong><span>Executive access</span></div><ChevronDown size={15}/></div></div>
      </aside>

      <main>
        <header className="topbar">
          <button className="menu-button" onClick={() => setMobileNav(true)}><Menu size={21}/></button>
          <div className="search"><Search size={17}/><input aria-label="Search accounts, deals, or issues" placeholder="Search accounts, deals, or issues..."/><kbd>⌘ K</kbd></div>
          <button className="bell" aria-label="Notifications"><Bell size={19}/><i/></button>
          <div className="top-avatar">CJ</div>
        </header>

        <div className="content">
          <section className="page-heading">
            <div><span className="today"><i/> Monday, August 17</span><h1>Executive Command Center</h1><p>What needs your attention today?</p></div>
            <div className="filters">
              <button><CalendarDays size={16}/> Last 30 days <ChevronDown size={14}/></button>
              <button><UserRound size={16}/> All owners <ChevronDown size={14}/></button>
              <label><Filter size={16}/><select value={priority} onChange={(e) => setPriority(e.target.value)}><option>All priorities</option><option>Critical</option><option>High</option><option>Medium</option></select></label>
            </div>
          </section>

          <section className="metric-grid widget-grid">
            <MetricCard label="Today's escalations" value={String(items.filter(i => i.priority === "Critical" || i.priority === "High").length)} note="3 require a decision" icon={AlertTriangle} tone="red" onClick={() => document.getElementById("attention")?.scrollIntoView({ behavior: "smooth" })}/>
            <MetricCard label="Money sitting still" value="$99.2K" note="No activity for 7+ days" icon={HandCoins} tone="amber" onClick={() => setDetail("money")}/>
            <MetricCard label="Total pipeline value" value="$487.6K" note="+12.4% vs last month" icon={CircleDollarSign} tone="blue" onClick={() => setDetail("pipeline")}/>
            <MetricCard label="Reorders due" value="8" note="$64.8K potential value" icon={PackageCheck} tone="green" onClick={() => setDetail("reorders")}/>
          </section>

          <section className="primary-grid widget-grid">
            <Card className="attention-card" id="attention">
              <CardHeader eyebrow="Decision required" title="Executive Attention Queue" action={<div className="live-count"><i/>{items.length} open</div>}/>
              <div className="queue-list">
                {visibleItems.map((item) => <article className="queue-item" key={item.id}>
                  <div className={`priority-line priority-${item.priority.toLowerCase()}`}/>
                  <div className="queue-main"><div className="queue-title"><Pill tone={item.priority}>{item.priority}</Pill><span>{item.category}</span></div><h3>{item.issue}</h3><p><strong>{item.account}</strong> · {item.detail}</p></div>
                  <div className="queue-data">{item.value && <div><span>Value</span><strong>{money(item.value)}</strong></div>}<div><span>Waiting</span><strong className={item.days >= 7 ? "danger-text" : ""}>{item.days} days</strong></div><div><span>Owner</span><strong>{item.owner}</strong></div></div>
                  <div className="queue-action"><span>Recommended action</span><strong>{item.nextAction}</strong><div><button className="resolve" onClick={() => resolve(item.id)}><Check size={14}/> Resolve</button><button className="assign" onClick={() => setAssignee(assignee === item.id ? null : item.id)}>Assign <ChevronDown size={13}/></button></div>{assignee === item.id && <div className="assign-menu">{["Maya", "Jordan", "Alex"].map(owner => <button key={owner} onClick={() => assign(item.id, owner)}>{owner}</button>)}</div>}</div>
                </article>)}
              </div>
              <footer className="card-footer"><span>Showing {visibleItems.length} of {items.length} open items</span><LinkButton>View full queue</LinkButton></footer>
            </Card>

            <Card className="deals-card">
              <CardHeader eyebrow="Revenue focus" title="Top 5 Deals to Push" />
              <div className="deal-list">{topDeals.map((deal, index) => <article key={deal.account}><span className="rank">0{index + 1}</span><div className="deal-info"><strong>{deal.account}</strong><span>{deal.stage} · {deal.signal}</span></div><div className="deal-value"><strong>{money(deal.value)}</strong><span>{deal.probability}% likely</span></div><div className="probability"><i style={{ width: `${deal.probability}%` }}/></div></article>)}</div>
              <footer className="card-footer"><span>Ranked by value, likelihood & urgency</span><LinkButton>Open pipeline</LinkButton></footer>
            </Card>
          </section>

          <section className="secondary-grid widget-grid">
            <Card><CardHeader eyebrow="Current month" title="Sales Pipeline Snapshot"/><div className="pipeline-total"><div><span>Open pipeline</span><strong>$487,600</strong></div><span className="positive"><ArrowUpRight size={14}/> 12.4%</span></div><div className="pipeline-bars">{pipeline.map(p => <div key={p.label}><div className="bar-meta"><span>{p.label}<b>{p.count}</b></span><strong>{money(p.value)}</strong></div><div className="bar"><i style={{ width: `${Math.max(18, p.value / 2000)}%`, background: p.color }}/></div></div>)}</div></Card>
            <Card><CardHeader eyebrow="Attention signals" title="Follow-Up Health"/><div className="health-score"><div className="score-ring"><strong>72</strong><span>/ 100</span></div><div><strong>Needs attention</strong><span>4 indicators are above threshold</span></div></div><div className="health-grid">{followUp.map(item => <div key={item.label}><span className={`status-dot ${item.severity}`}/><span>{item.label}</span><strong>{item.value}</strong></div>)}</div></Card>
          </section>

          <section className="secondary-grid widget-grid">
            <Card><CardHeader eyebrow="Inbound demand" title="Instagram / Inbound Activity" action={<div className="instagram-stat"><Instagram size={15}/> 14 qualified</div>}/><div className="mini-stats"><div><strong>14</strong><span>Qualified leads</span></div><div><strong>3</strong><span>Awaiting reply</span></div><div><strong>6</strong><span>Meetings generated</span></div><div><strong>11</strong><span>Moved to CRM</span></div></div><div className="compact-table">{inbound.map(row => <div key={row.lead}><div className="lead-avatar">{row.lead.slice(0,1)}</div><div><strong>{row.lead}</strong><span>{row.organization}</span></div><Pill tone={row.status.includes("executive") ? "High" : "neutral"}>{row.status}</Pill><time>{row.time}</time></div>)}</div></Card>
            <Card><CardHeader eyebrow="Next 14 days" title="Reorder Radar"/><div className="reorder-list">{reorders.map(row => <article key={row.account}><div className="date-box"><strong>{row.due.split(" ")[1]}</strong><span>AUG</span></div><div><strong>{row.account}</strong><span>{row.product}</span></div><div className="likelihood"><span>{row.likelihood}% likely</span><div><i style={{width: `${row.likelihood}%`}}/></div></div><button aria-label={`Contact ${row.account}`}><Send size={15}/></button></article>)}</div><div className="radar-note"><Clock3 size={16}/><span><strong>$64.8K potential reorder value</strong> across 8 accounts</span></div></Card>
          </section>

          <section className="bottom-grid widget-grid">
            <Card><CardHeader eyebrow="Handled today" title="Orbal Pod Activity" action={<div className="live-count"><i/>Live</div>}/><div className="pod-grid">{podActivity.map((item, index) => <div key={item.label}><span className={`pod-icon pod-${index}`}><Check size={15}/></span><strong>{item.value}</strong><span>{item.label}</span></div>)}</div></Card>
            <Card className="hours-card"><div className="hours-icon"><Clock3 size={24}/></div><div><span className="eyebrow">Estimated this month</span><h2>Executive Hours Saved</h2><strong>42.5 <small>hours</small></strong><p>Admin, CRM updates, follow-ups and coordination handled by your Orbal Pod.</p><div className="hours-foot"><span>≈ 5.3 workdays</span><span>Estimate based on completed activity</span></div></div></Card>
          </section>
          <p className="data-note">Data refreshed today at 9:42 AM · Mock data for Version 1</p>
        </div>
      </main>

      {detail && <div className="modal-backdrop" onClick={() => setDetail(null)}><aside className="drawer" onClick={(e) => e.stopPropagation()}><button className="drawer-close" onClick={() => setDetail(null)}><X size={20}/></button>{detail === "money" && <><span className="eyebrow">No activity in 7+ days</span><h2>Money Sitting Still</h2><div className="drawer-total">$99,150 <span>across 3 opportunities</span></div>{moneyStill.map(row => <div className="drawer-row" key={row.account}><div><strong>{row.account}</strong><span>{row.inactive} days inactive</span></div><strong>{money(row.value)}</strong></div>)}</>}{detail === "pipeline" && <><span className="eyebrow">Pipeline detail</span><h2>Open Pipeline</h2><div className="drawer-total">$487,600 <span>48 active opportunities</span></div>{pipeline.map(row => <div className="drawer-row" key={row.label}><div><strong>{row.label}</strong><span>{row.count} opportunities</span></div><strong>{money(row.value)}</strong></div>)}</>}{detail === "reorders" && <><span className="eyebrow">Upcoming revenue</span><h2>Reorders Due</h2><div className="drawer-total">$64,800 <span>estimated potential value</span></div>{reorders.map(row => <div className="drawer-row" key={row.account}><div><strong>{row.account}</strong><span>{row.product} · {row.due}</span></div><strong>{row.likelihood}%</strong></div>)}</>}</aside></div>}
      {toast && <div className="toast"><Check size={16}/>{toast}</div>}
    </div>
  );
}
