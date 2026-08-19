"use client";

import { useMemo, useState } from "react";
import { AlertTriangle, ArrowDownRight, ArrowUpRight, BarChart3, Bell, CalendarDays, Check, ChevronDown, CircleDollarSign, Clock3, Filter, HandCoins, Instagram, LayoutDashboard, Menu, PackageCheck, Search, Send, Settings2, ShieldAlert, Sparkles, Target, UserRound, UsersRound, X } from "lucide-react";
import { attentionItems as initialItems, followUp, inbound, moneyStill, pipeline, podActivity, reorders, topDeals } from "@/lib/dashboard-data";
import { Card, CardHeader, LinkButton, Pill, money } from "@/components/ui";

type DetailView = "money" | "pipeline" | "reorders" | "issue" | null;

const rangeOptions = [
  { label: "Last 3 days", days: 3, factor: .22, comparison: 8.7 },
  { label: "Last 7 days", days: 7, factor: .4, comparison: 11.3 },
  { label: "Last 2 weeks", days: 14, factor: .65, comparison: 6.9 },
  { label: "Last 30 days", days: 30, factor: 1, comparison: 12.4 },
  { label: "Last 2 months", days: 60, factor: 1.62, comparison: 9.8 },
  { label: "Last 90 days", days: 90, factor: 2.15, comparison: 15.1 },
] as const;

const pipelineColors = ["#6478b1", "#dd8b52", "#243263", "#338265", "#9aa6b9"];
const followUpThresholds = [5, 5, 10, 6, 10, 2];
const followUpPenalties = [6, 6, 8, 4, 2, 8];

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
      <div className="metric-heading"><span className="metric-title"><span className="metric-icon"><Icon size={16} /></span><span className="metric-label">{label}</span></span><ArrowUpRight size={15} className="metric-arrow" /></div>
      <strong className="metric-value">{value}</strong>
      <small className="metric-note">{note}</small>
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
  const [hoveredDeal, setHoveredDeal] = useState<number | null>(null);
  const [rangeLabel, setRangeLabel] = useState<(typeof rangeOptions)[number]["label"]>("Last 30 days");
  const [selectedIssue, setSelectedIssue] = useState<(typeof initialItems)[number] | null>(null);

  const visibleItems = useMemo(() => priority === "All priorities" ? items : items.filter((item) => item.priority === priority), [items, priority]);
  const selectedRange = rangeOptions.find((range) => range.label === rangeLabel) ?? rangeOptions[3];
  const scalePeriod = (value: number) => Math.max(1, Math.round(value * selectedRange.factor));
  const periodPipeline = pipeline.map((item, index) => ({ ...item, count: scalePeriod(item.count), value: scalePeriod(item.value), color: pipelineColors[index] }));
  const periodPipelineValue = scalePeriod(487600);
  const periodInbound = [scalePeriod(14), scalePeriod(3), scalePeriod(6), scalePeriod(11)];
  const periodPodActivity = podActivity.map((item) => ({ ...item, value: scalePeriod(item.value) }));
  const periodHours = (42.5 * selectedRange.factor).toFixed(1);
  const periodWorkdays = (5.3 * selectedRange.factor).toFixed(1);
  const indicatorsAboveThreshold = followUp.filter((item, index) => item.value > followUpThresholds[index]).length;
  const healthScore = 100 - followUp.reduce((penalty, item, index) => penalty + (item.value > followUpThresholds[index] ? followUpPenalties[index] : 0), 0);
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
              <label className="date-filter"><CalendarDays size={16}/><select aria-label="Dashboard date range" value={rangeLabel} onChange={(event) => setRangeLabel(event.target.value as (typeof rangeOptions)[number]["label"])}>{rangeOptions.map((range) => <option key={range.label}>{range.label}</option>)}</select><ChevronDown size={14}/></label>
              <button><UserRound size={16}/> All owners <ChevronDown size={14}/></button>
              <label><Filter size={16}/><select value={priority} onChange={(e) => setPriority(e.target.value)}><option>All priorities</option><option>Critical</option><option>High</option><option>Medium</option></select></label>
            </div>
          </section>

          <section className="metric-grid widget-grid">
            <MetricCard label="Today's escalations" value={String(items.filter(i => i.priority === "Critical" || i.priority === "High").length)} note="3 require a decision" icon={AlertTriangle} tone="red" onClick={() => document.getElementById("attention")?.scrollIntoView({ behavior: "smooth" })}/>
            <MetricCard label="Money sitting still" value="$99.2K" note="No activity for 7+ days" icon={HandCoins} tone="amber" onClick={() => setDetail("money")}/>
            <MetricCard label="Total pipeline value" value={periodPipelineValue >= 100000 ? `$${(periodPipelineValue / 1000).toFixed(1)}K` : money(periodPipelineValue)} note={`+${selectedRange.comparison}% vs previous ${selectedRange.days} days`} icon={CircleDollarSign} tone="blue" onClick={() => setDetail("pipeline")}/>
            <MetricCard label="Reorders due" value="8" note="$64.8K potential value" icon={PackageCheck} tone="blue" onClick={() => setDetail("reorders")}/>
          </section>

          <section className="primary-grid widget-grid">
            <Card className="attention-card" id="attention">
              <CardHeader eyebrow="Decision required" title="Executive Attention Queue" action={<div className="live-count attention-live"><i/>{items.length} open</div>}/>
              <div className="queue-list">
                {visibleItems.map((item) => <article className="queue-item" key={item.id} role="button" tabIndex={0} onClick={() => { setSelectedIssue(item); setDetail("issue"); }} onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); setSelectedIssue(item); setDetail("issue"); } }}>
                  <div className={`priority-line priority-${item.priority.toLowerCase()}`}/>
                  <div className="queue-main"><div className="queue-title"><Pill tone={item.priority}>{item.priority}</Pill><span>{item.category}</span></div><h3>{item.issue}</h3><p><strong>{item.account}</strong> · {item.detail}</p></div>
                  <div className="queue-data">{item.value && <div><span>Value</span><strong>{money(item.value)}</strong></div>}<div><span>Waiting</span><strong className={item.days >= 7 ? "danger-text" : ""}>{item.days} days</strong></div><div><span>Owner</span><strong>{item.owner}</strong></div></div>
                  <div className="queue-action"><span>Recommended action</span><strong>{item.nextAction}</strong><div><button className="resolve" onClick={(event) => { event.stopPropagation(); resolve(item.id); }}><Check size={14}/> Resolve</button><button className="assign" onClick={(event) => { event.stopPropagation(); setAssignee(assignee === item.id ? null : item.id); }}>Assign <ChevronDown size={13}/></button></div>{assignee === item.id && <div className="assign-menu" onClick={(event) => event.stopPropagation()}>{["Maya", "Jordan", "Alex"].map(owner => <button key={owner} onClick={() => assign(item.id, owner)}>{owner}</button>)}</div>}</div>
                </article>)}
              </div>
              <footer className="card-footer"><span>Showing {visibleItems.length} of {items.length} open items</span><LinkButton>View full queue</LinkButton></footer>
            </Card>

            <Card className="deals-card">
              <CardHeader eyebrow="Revenue focus" title="Top 5 Deals to Push" />
              <div className="deal-list">{topDeals.map((deal, index) => <article key={deal.account}><span className="rank">0{index + 1}</span><div className="deal-info"><strong>{deal.account}</strong><span>{deal.stage} · {deal.signal}</span></div><div className="deal-value"><strong>{money(deal.value)}</strong><span>{deal.probability}% likely</span></div><div className="deal-bar"><i style={{ width: `${(deal.value / topDeals[0].value) * 100}%` }}/></div></article>)}</div>
              <div className="deal-summary">
                <div className="donut-wrap">
                  <svg className="deal-donut" viewBox="0 0 44 44" role="img" aria-label="Distribution of Top 5 deal value" onMouseLeave={() => setHoveredDeal(null)}>
                    <circle className="donut-track" cx="22" cy="22" r="16" pathLength="100" />
                    {topDeals.map((deal, index) => {
                      const total = topDeals.reduce((sum, item) => sum + item.value, 0);
                      const share = deal.value / total * 100;
                      const offset = -topDeals.slice(0, index).reduce((sum, item) => sum + item.value / total * 100, 0);
                      return <circle key={deal.account} className={`donut-segment donut-segment-${index}`} cx="22" cy="22" r="16" pathLength="100" strokeDasharray={`${share} ${100 - share}`} strokeDashoffset={offset} tabIndex={0} onMouseEnter={() => setHoveredDeal(index)} onFocus={() => setHoveredDeal(index)} onBlur={() => setHoveredDeal(null)}><title>{deal.account}: {money(deal.value)} ({share.toFixed(1)}%)</title></circle>;
                    })}
                  </svg>
                  {hoveredDeal !== null && <div className="donut-tooltip"><strong>{topDeals[hoveredDeal].account}</strong><span>{money(topDeals[hoveredDeal].value)} · {(topDeals[hoveredDeal].value / topDeals.reduce((sum, item) => sum + item.value, 0) * 100).toFixed(1)}%</span></div>}
                </div>
                <div className="deal-summary-copy"><strong>$199.7K</strong><span>Top 5 value</span><small>Hover chart segments to view deal details</small></div>
              </div>
              <footer className="card-footer"><span>Ranked by value, likelihood & urgency</span><LinkButton>Open pipeline</LinkButton></footer>
            </Card>
          </section>

          <section className="secondary-grid widget-grid">
            <Card><CardHeader eyebrow={rangeLabel} title="Sales Pipeline Snapshot"/><div className="pipeline-total"><div><span>Open pipeline</span><strong>{money(periodPipelineValue)}</strong></div><span className="positive"><ArrowUpRight size={14}/> {selectedRange.comparison}%</span></div><div className="pipeline-bars">{periodPipeline.map(p => <div key={p.label}><div className="bar-meta"><span>{p.label}<b>{p.count}</b></span><strong>{money(p.value)}</strong></div><div className="bar"><i style={{ width: `${Math.max(18, p.value / Math.max(...periodPipeline.map(item => item.value)) * 100)}%`, background: p.color }}/></div></div>)}</div></Card>
            <Card><CardHeader eyebrow="Attention signals" title="Follow-Up Health"/><div className="health-score"><div className="score-ring" style={{ background: `conic-gradient(#d49a3a ${healthScore}%,#f0f1f4 0)` }}><strong>{healthScore}</strong><span>/ 100</span></div><div><strong>{indicatorsAboveThreshold ? "Needs attention" : "Healthy"}</strong><span>{indicatorsAboveThreshold} indicator{indicatorsAboveThreshold === 1 ? " is" : "s are"} above threshold</span></div></div><div className="health-grid">{followUp.map(item => <div key={item.label}><span className={`status-dot ${item.severity}`}/><span>{item.label}</span><strong>{item.value}</strong></div>)}</div></Card>
          </section>

          <section className="secondary-grid widget-grid">
            <Card><CardHeader eyebrow="Inbound demand" title="Instagram / Inbound Activity" action={<div className="instagram-stat"><Instagram size={15}/> {periodInbound[0]} qualified</div>}/><div className="mini-stats"><div><strong>{periodInbound[0]}</strong><span>Qualified leads</span></div><div><strong>{periodInbound[1]}</strong><span>Awaiting reply</span></div><div><strong>{periodInbound[2]}</strong><span>Meetings generated</span></div><div><strong>{periodInbound[3]}</strong><span>Moved to CRM</span></div></div><div className="compact-table">{inbound.map(row => <div key={row.lead}><div className="lead-avatar">{row.lead.slice(0,1)}</div><div><strong>{row.lead}</strong><span>{row.organization}</span></div><Pill tone={row.status === "Meeting booked" ? "meeting" : row.status === "Moved to CRM" ? "crm" : "reply"}>{row.status}</Pill><time>{row.time}</time></div>)}</div></Card>
            <Card><CardHeader eyebrow="Next 14 days" title="Reorder Radar"/><div className="reorder-list">{reorders.map(row => <article key={row.account}><div className="date-box"><strong>{row.due.split(" ")[1]}</strong><span>AUG</span></div><div><strong>{row.account}</strong><span>{row.product}</span></div><div className="likelihood"><span>{row.likelihood}% likely</span><div><i style={{width: `${row.likelihood}%`}}/></div></div><button aria-label={`Contact ${row.account}`}><Send size={15}/></button></article>)}</div><div className="radar-note"><Clock3 size={16}/><span><strong>$64.8K potential reorder value</strong> across 8 accounts</span></div></Card>
          </section>

          <section className="bottom-grid widget-grid">
            <Card><CardHeader eyebrow={rangeLabel} title="Orbal Pod Activity" action={<div className="live-count"><i/>Live</div>}/><div className="pod-grid">{periodPodActivity.map((item, index) => <div key={item.label} className={index === 5 && item.value > 0 ? "pod-blocker" : ""}><span className={`pod-icon pod-${index}`}><Check size={15}/></span><strong>{item.value}</strong><span>{item.label}</span></div>)}</div></Card>
            <Card className="hours-card"><div className="hours-icon"><Clock3 size={24}/></div><div><span className="eyebrow">Estimated · {rangeLabel}</span><h2>Executive Hours Saved</h2><strong>{periodHours} <small>hours</small></strong><p>Admin, CRM updates, follow-ups and coordination handled by your Orbal Pod.</p><div className="hours-foot"><span>≈ {periodWorkdays} workdays</span><span>Estimate based on completed activity</span></div></div></Card>
          </section>
          <p className="data-note">Data refreshed today at 9:42 AM · Mock data for Version 1</p>
        </div>
      </main>

      {detail && <div className="modal-backdrop" onClick={() => setDetail(null)}><aside className="drawer" onClick={(e) => e.stopPropagation()}><button className="drawer-close" onClick={() => setDetail(null)}><X size={20}/></button>{detail === "money" && <><span className="eyebrow">No activity in 7+ days</span><h2>Money Sitting Still</h2><div className="drawer-total">$99,150 <span>across 3 opportunities</span></div>{moneyStill.map(row => <div className="drawer-row" key={row.account}><div><strong>{row.account}</strong><span>{row.inactive} days inactive</span></div><strong>{money(row.value)}</strong></div>)}</>}{detail === "pipeline" && <><span className="eyebrow">{rangeLabel}</span><h2>Open Pipeline</h2><div className="drawer-total">{money(periodPipelineValue)} <span>{scalePeriod(48)} opportunities in range</span></div>{periodPipeline.map(row => <div className="drawer-row" key={row.label}><div><strong>{row.label}</strong><span>{row.count} opportunities</span></div><strong>{money(row.value)}</strong></div>)}</>}{detail === "reorders" && <><span className="eyebrow">Upcoming revenue</span><h2>Reorders Due</h2><div className="drawer-total">$64,800 <span>estimated potential value</span></div>{reorders.map(row => <div className="drawer-row" key={row.account}><div><strong>{row.account}</strong><span>{row.product} · {row.due}</span></div><strong>{row.likelihood}%</strong></div>)}</>}{detail === "issue" && selectedIssue && <><span className="eyebrow">{selectedIssue.priority} · {selectedIssue.category}</span><h2>{selectedIssue.issue}</h2><div className="drawer-total">{selectedIssue.value ? money(selectedIssue.value) : selectedIssue.account}<span>{selectedIssue.account} · waiting {selectedIssue.days} days</span></div><div className="issue-detail"><span>Owner</span><strong>{selectedIssue.owner}</strong><span>Recommended action</span><strong>{selectedIssue.nextAction}</strong><p>{selectedIssue.detail}</p></div></>}</aside></div>}
      {toast && <div className="toast"><Check size={16}/>{toast}</div>}
    </div>
  );
}
