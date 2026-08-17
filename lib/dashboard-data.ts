export type Priority = "Critical" | "High" | "Medium";

export type AttentionItem = {
  id: number;
  account: string;
  issue: string;
  detail: string;
  value?: number;
  days: number;
  priority: Priority;
  owner: string;
  nextAction: string;
  category: string;
};

export const attentionItems: AttentionItem[] = [
  { id: 1, account: "Bethany Community Church", issue: "Production hold needs approval", detail: "Easter gift boxes · artwork bleed issue", value: 28400, days: 2, priority: "Critical", owner: "Jordan", nextAction: "Approve revised proof", category: "Production" },
  { id: 2, account: "Grace Fellowship", issue: "Quote awaiting response", detail: "Custom welcome kits · 5,000 units", value: 41750, days: 11, priority: "High", owner: "Maya", nextAction: "Executive follow-up", category: "Quote" },
  { id: 3, account: "Kingdom Life Network", issue: "Pricing exception requested", detail: "Multi-campus annual program", value: 68500, days: 4, priority: "High", owner: "Alex", nextAction: "Approve 7% discount", category: "Approval" },
  { id: 4, account: "Northside Ministries", issue: "Customer issue unresolved", detail: "Color variance on delivered mailers", value: 12900, days: 3, priority: "High", owner: "Sam", nextAction: "Authorize reprint", category: "Customer" },
  { id: 5, account: "Elevation Outreach", issue: "Lead has no response", detail: "Instagram inquiry · conference packaging", value: 18600, days: 6, priority: "Medium", owner: "Unassigned", nextAction: "Assign sales owner", category: "Lead" },
];

export const topDeals = [
  { account: "Kingdom Life Network", stage: "Proposal", value: 68500, probability: 78, signal: "Decision this week" },
  { account: "Grace Fellowship", stage: "Quote sent", value: 41750, probability: 72, signal: "11d inactive" },
  { account: "City Hope Church", stage: "Negotiation", value: 36200, probability: 84, signal: "Budget approved" },
  { account: "Bethany Community", stage: "Production review", value: 28400, probability: 90, signal: "Approval blocked" },
  { account: "New Covenant", stage: "Discovery", value: 24800, probability: 61, signal: "Meeting tomorrow" },
];

export const inbound = [
  { lead: "Rachel M.", organization: "Resonate Church", source: "Instagram", status: "Needs executive reply", time: "18m ago" },
  { lead: "Marcus T.", organization: "Bridge City Youth", source: "Instagram", status: "Meeting booked", time: "1h ago" },
  { lead: "Anna S.", organization: "One Hope Ministries", source: "Referral", status: "Moved to CRM", time: "3h ago" },
];

export const reorders = [
  { account: "Faith Assembly", product: "Offering envelopes", due: "Aug 21", days: 4, likelihood: 92 },
  { account: "Cornerstone Church", product: "Welcome folders", due: "Aug 24", days: 7, likelihood: 87 },
  { account: "New Life Center", product: "Event mailers", due: "Aug 29", days: 12, likelihood: 74 },
];

export const pipeline = [
  { label: "Quotes sent", count: 18, value: 184200, color: "#6673a4" },
  { label: "Awaiting response", count: 9, value: 128400, color: "#d9a441" },
  { label: "Likely this month", count: 6, value: 96700, color: "#327a61" },
  { label: "Won", count: 11, value: 142800, color: "#233263" },
  { label: "Lost", count: 4, value: 31600, color: "#aeb5c9" },
];

export const followUp = [
  { label: "Leads without next step", value: 7, severity: "high" },
  { label: "Quotes not followed up", value: 9, severity: "high" },
  { label: "Overdue tasks", value: 12, severity: "critical" },
  { label: "Dormant opportunities", value: 5, severity: "medium" },
  { label: "Reorders due soon", value: 8, severity: "neutral" },
  { label: "At-risk accounts", value: 3, severity: "critical" },
];

export const podActivity = [
  { label: "Tasks completed", value: 34 },
  { label: "Follow-ups sent", value: 21 },
  { label: "CRM records updated", value: 17 },
  { label: "Leads qualified", value: 8 },
  { label: "Meetings booked", value: 4 },
  { label: "Open blockers", value: 3 },
];

export const moneyStill = [
  { account: "Grace Fellowship", value: 41750, inactive: 11 },
  { account: "Living Word Church", value: 32600, inactive: 9 },
  { account: "Radiant City", value: 24800, inactive: 8 },
];
