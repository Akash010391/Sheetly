"use client";

import React, { useState, useRef } from "react";
import Link from 'next/link';
import * as XLSX from "xlsx";
import {
  FileSpreadsheet, Upload, FileText, ShieldCheck, ShieldAlert, Lock, Check, Download,
  Sparkles, Loader2, Building2, TrendingUp, TrendingDown, CheckCircle2, RefreshCw, Table2,
  MessageCircleQuestion, Send, AlertTriangle, IndianRupee, Banknote, Landmark, Gauge,
  ArrowRight, ArrowLeft, Briefcase, CalendarDays, Printer, PieChart, Repeat, Receipt
} from "lucide-react";

/* --------------------------------- THEME ---------------------------------- */
const C = {
  bg: "#FAF9F4", bg2: "#F2F1EA", card: "#FFFFFF",
  ink: "#191C19", inkSoft: "#565B55", inkFaint: "#969B92",
  line: "#E8E6DC", lineSoft: "#F0EEE6",
  emerald: "#0E8F6B", emeraldBright: "#15B589", emeraldDeep: "#0A6E53", emeraldWash: "#E7F4EF",
  rose: "#C25548", roseWash: "#FBEDEB", gold: "#B98A2E", goldWash: "#FBF3DF",
};
const FD = "'Space Grotesk', sans-serif";
const FB = "'Hanken Grotesk', system-ui, sans-serif";
const FM = "'IBM Plex Mono', monospace";
const ENDPOINT = "https://api.anthropic.com/v1/messages";
const BANKS = ["HDFC", "SBI", "ICICI", "Axis", "Kotak", "PNB", "Bank of Baroda", "Yes Bank", "IDFC First", "Canara"];

/* ------------------------------- SAMPLE DATA ------------------------------ */
const SAMPLE_TX = [
  { date: "01 May", description: "UPI/ZOMATO ORDER", debit: 450, credit: null, balance: 41550, category: "Food" },
  { date: "02 May", description: "SALARY CREDIT — ACME PVT LTD", debit: null, credit: 85000, balance: 126550, category: "Income" },
  { date: "03 May", description: "NEFT/RENT/LANDLORD", debit: 18000, credit: null, balance: 108550, category: "Rent" },
  { date: "04 May", description: "UPI/AMAZON PAY", debit: 2340, credit: null, balance: 106210, category: "Shopping" },
  { date: "05 May", description: "ATM WITHDRAWAL", debit: 5000, credit: null, balance: 101210, category: "Cash" },
  { date: "05 May", description: "SMS ALERT CHARGES", debit: 18, credit: null, balance: 101192, category: "Bank Charge", charge: true, explain: "A monthly fee for transaction SMS alerts." },
  { date: "07 May", description: "UPI/SWIGGY", debit: 620, credit: null, balance: 100572, category: "Food" },
  { date: "09 May", description: "INTEREST CREDIT", debit: null, credit: 142, balance: 100714, category: "Income" },
  { date: "12 May", description: "UPI/ELECTRICITY BILL", debit: 1850, credit: null, balance: 98864, category: "Bills" },
  { date: "14 May", description: "MIN BALANCE CHARGE", debit: 354, credit: null, balance: 98510, category: "Bank Charge", charge: true, explain: "Penalty for letting your balance fall below the required minimum." },
  { date: "15 May", description: "NEFT FROM RAHUL SHARMA", debit: null, credit: 7500, balance: 106010, category: "Transfer" },
  { date: "18 May", description: "UPI/PETROL PUMP", debit: 2000, credit: null, balance: 104010, category: "Transport" },
  { date: "20 May", description: "NETFLIX SUBSCRIPTION", debit: 649, credit: null, balance: 103361, category: "Subscription", explain: "Recurring monthly subscription — cancel anytime if unused." },
  { date: "22 May", description: "EMI/HDFC HOME LOAN", debit: 24500, credit: null, balance: 78861, category: "EMI" },
  { date: "25 May", description: "ANNUAL DEBIT CARD FEE", debit: 590, credit: null, balance: 78271, category: "Bank Charge", charge: true, explain: "A yearly fee charged for your debit card." },
  { date: "28 May", description: "UPI/BIG BAZAAR GROCERY", debit: 3200, credit: null, balance: 75071, category: "Groceries" },
];
const SAMPLE_BORROWER = {
  name: "Rahul Sharma", period: "Dec 2024 – May 2025", account: "HDFC Bank · A/C XXXX4821",
  income: 85000, employer: "ACME PVT LTD", salaryMonths: 6, amb: 102600,
  existingEMI: 24500, emiName: "HDFC Home Loan", emiMonths: 6,
  bounces: 1, bounceDetail: "ECS return · 14 Feb · ₹24,500 · insufficient funds",
  cashDeposits: 35000, cashCount: 3, reconciles: true,
  months: [{ m: "Dec", inc: 92300, exp: 71000 }, { m: "Jan", inc: 85200, exp: 68400 }, { m: "Feb", inc: 85000, exp: 90200 }, { m: "Mar", inc: 92500, exp: 66300 }, { m: "Apr", inc: 85140, exp: 70200 }, { m: "May", inc: 92640, exp: 57960 }],
};

/* ------------------------------- UTILITIES -------------------------------- */
function inr(n, dec) {
  if (n == null || isNaN(n)) return "—";
  const neg = n < 0; n = Math.abs(n);
  const [i, d] = Number(n).toFixed(dec ? 2 : 0).split(".");
  let last3 = i.slice(-3); let rest = i.slice(0, -3);
  if (rest) last3 = "," + last3;
  rest = rest.replace(/\B(?=(\d{2})+(?!\d))/g, ",");
  return "₹" + (neg ? "−" : "") + rest + last3 + (dec ? "." + d : "");
}
const bare = (n) => inr(n).replace("₹", "");
function checkAuthenticity(rows) {
  const issues = [];
  for (let i = 1; i < rows.length; i++) {
    const prev = rows[i - 1].balance, cur = rows[i].balance;
    if (prev == null || cur == null) continue;
    const expected = prev + (rows[i].credit || 0) - (rows[i].debit || 0);
    if (Math.abs(expected - cur) > 1) issues.push({ i });
  }
  return issues;
}
function emiToLoan(emi, annual, months) { const r = annual / 12; return (emi * (Math.pow(1 + r, months) - 1)) / (r * Math.pow(1 + r, months)); }
function analyze(s) {
  const foirCap = s.income * 0.5, available = Math.max(0, foirCap - s.existingEMI);
  const loanAmount = emiToLoan(available, 0.10, 60), usedFoir = s.existingEMI / foirCap;
  const surplus = s.months.reduce((a, m) => a + (m.inc - m.exp), 0) / s.months.length;
  let score = 30 + 25 * Math.min(1, s.amb / 50000) + 20 * Math.max(0, 1 - usedFoir) + 15 * Math.max(0, 1 - s.bounces * 0.4) + 10 * (surplus > 0 ? 1 : 0);
  score = Math.round(score);
  const grade = score >= 85 ? "Excellent" : score >= 70 ? "Good" : score >= 55 ? "Fair" : "Weak";
  return { foirCap, available, loanAmount, usedFoir, score, grade };
}
const CAT_COLOR = (c) => (c === "Bank Charge" ? C.gold : c === "EMI" ? C.rose : C.emerald);

/* ----------------------------- SHARED PIECES ------------------------------ */
function Btn({ children, onClick, kind = "primary", style, small, disabled }) {
  const base = { fontFamily: FB, fontWeight: 700, cursor: disabled ? "default" : "pointer", display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8, borderRadius: 12, fontSize: small ? 13 : 14.5, padding: small ? "9px 16px" : "13px 22px", border: "none", opacity: disabled ? 0.55 : 1 };
  const kinds = {
    primary: { background: `linear-gradient(135deg, ${C.emeraldBright}, ${C.emerald})`, color: "#fff", boxShadow: `0 10px 24px ${C.emerald}33` },
    ghost: { background: C.card, color: C.ink, border: `1px solid ${C.line}`, boxShadow: "0 2px 8px rgba(0,0,0,0.03)" },
    soft: { background: C.emeraldWash, color: C.emeraldDeep, border: `1px solid ${C.emerald}22` },
  };
  return <button onClick={disabled ? undefined : onClick} style={{ ...base, ...kinds[kind], ...style }}>{children}</button>;
}
function Steps({ steps, step, label }) {
  return (
    <div style={{ background: C.card, border: `1px solid ${C.line}`, borderRadius: 22, padding: "36px 30px", boxShadow: "0 14px 40px rgba(0,0,0,0.05)", animation: "fu .4s ease both" }}>
      <div style={{ textAlign: "center", fontFamily: FD, fontWeight: 600, fontSize: 16 }}>{label}</div>
      <div style={{ maxWidth: 300, margin: "22px auto 0" }}>
        {steps.map((st, i) => {
          const done = step > i, active = step === i;
          return (
            <div key={st} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 0", opacity: done || active ? 1 : 0.4 }}>
              <div style={{ width: 26, height: 26, borderRadius: 99, display: "flex", alignItems: "center", justifyContent: "center", background: done ? C.emerald : active ? C.emeraldWash : C.bg2, border: `1px solid ${done ? C.emerald : C.line}` }}>{done ? <Check size={15} color="#fff" /> : active ? <Loader2 size={14} color={C.emerald} className="sp" /> : <span style={{ width: 6, height: 6, borderRadius: 99, background: C.inkFaint }} />}</div>
              <span style={{ fontFamily: FB, fontSize: 14.5, fontWeight: 600, color: done || active ? C.ink : C.inkFaint }}>{st}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
function Dropzone({ onFile, drag, setDrag, inputRef, title, sub }) {
  return (
    <div onClick={() => inputRef.current && inputRef.current.click()}
      onDragOver={(e) => { e.preventDefault(); setDrag(true); }} onDragLeave={() => setDrag(false)}
      onDrop={(e) => { e.preventDefault(); setDrag(false); onFile(e.dataTransfer.files[0]); }}
      style={{ cursor: "pointer", borderRadius: 22, padding: "42px 28px", textAlign: "center", background: drag ? C.emeraldWash : C.card, border: `2px dashed ${drag ? C.emerald : C.line}`, boxShadow: "0 14px 40px rgba(0,0,0,0.05)" }}>
      <input ref={inputRef} type="file" accept="application/pdf" style={{ display: "none" }} onChange={(e) => onFile(e.target.files[0])} />
      <div style={{ width: 62, height: 62, margin: "0 auto", borderRadius: 16, background: C.emeraldWash, display: "flex", alignItems: "center", justifyContent: "center" }}><Upload size={27} color={C.emerald} /></div>
      <div style={{ fontFamily: FD, fontWeight: 600, fontSize: 18, marginTop: 16 }}>{title}</div>
      <div style={{ fontFamily: FB, fontSize: 13.5, color: C.inkFaint, marginTop: 6 }}>{sub}</div>
      <div style={{ marginTop: 18 }}><Btn kind="primary"><FileText size={17} /> Choose file</Btn></div>
    </div>
  );
}
function Section({ title, icon: Icon, children, style, accent }) {
  return (
    <div style={{ background: C.card, border: `1px solid ${accent || C.line}`, borderRadius: 16, padding: 18, boxShadow: "0 8px 24px rgba(0,0,0,0.04)", ...style }}>
      <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 14 }}>
        <div style={{ width: 30, height: 30, borderRadius: 8, background: C.emeraldWash, display: "flex", alignItems: "center", justifyContent: "center" }}><Icon size={16} color={C.emerald} /></div>
        <span style={{ fontFamily: FD, fontWeight: 600, fontSize: 15.5 }}>{title}</span>
      </div>
      {children}
    </div>
  );
}
const Row = ({ k, v, mono }) => (
  <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 0" }}>
    <span style={{ fontFamily: FB, fontSize: 12.5, color: C.inkSoft }}>{k}</span>
    <span style={{ fontFamily: mono ? FM : FB, fontSize: 12.5, fontWeight: 600, color: C.ink }}>{v}</span>
  </div>
);
function BackBar({ goHub, label }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
      <button onClick={goHub} style={{ display: "flex", alignItems: "center", gap: 6, fontFamily: FB, fontSize: 13.5, fontWeight: 600, color: C.inkSoft, background: "none", border: "none", cursor: "pointer" }}><ArrowLeft size={16} /> All tools</button>
      <span style={{ fontFamily: FB, fontSize: 12, fontWeight: 700, color: C.emerald, background: C.emeraldWash, padding: "5px 11px", borderRadius: 99 }}>{label}</span>
    </div>
  );
}

/* ===================== TIER 1: UNDERSTAND YOUR STATEMENT ==================== */
function ConsumerTool({ goHub }) {
  const [stage, setStage] = useState("idle");
  const [step, setStep] = useState(0);
  const [rows, setRows] = useState([]);
  const [fileName, setFileName] = useState("");
  const [err, setErr] = useState("");
  const [drag, setDrag] = useState(false);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [asking, setAsking] = useState(false);
  const inputRef = useRef(null);
  const STEPS = ["Reading your PDF", "Categorising transactions", "Finding hidden charges"];

  async function run(dataPromise, name) {
    setFileName(name); setErr(""); setAnswer(""); setQuestion(""); setStage("processing"); setStep(0);
    const t1 = setTimeout(() => setStep(1), 800), t2 = setTimeout(() => setStep(2), 1700);
    try { const data = await dataPromise; clearTimeout(t1); clearTimeout(t2); setStep(3); setTimeout(() => { setRows(data); setStage("done"); }, 600); }
    catch (e) { clearTimeout(t1); clearTimeout(t2); setErr("We couldn't read that file. Try a clear PDF — or use the sample below."); setStage("error"); }
  }
  const trySample = () => run(new Promise((r) => setTimeout(() => r(SAMPLE_TX), 1800)), "sample-statement.pdf");
  function onFile(file) {
    if (!file) return;
    if (file.type !== "application/pdf") { setErr("Please upload a PDF file."); setStage("error"); return; }
    const reader = new FileReader();
    reader.onload = () => run(parsePDF(reader.result.split(",")[1]), file.name);
    reader.onerror = () => { setErr("Couldn't read the file."); setStage("error"); };
    reader.readAsDataURL(file);
  }
  async function parsePDF(b64) {
    const prompt = `Extract every transaction from the attached bank statement PDF. Return ONLY valid JSON (no markdown): {"transactions":[{"date":"DD MMM","description":"short","debit":number_or_null,"credit":number_or_null,"balance":number_or_null,"category":"one of: Income, Rent, Food, Groceries, Shopping, Bills, Transport, EMI, Subscription, Cash, Transfer, Bank Charge, Other","charge":true_only_if_a_bank_fee}]}. Use null where absent.`;
    const r = await fetch(ENDPOINT, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ model: "claude-sonnet-4-20250514", max_tokens: 1000, messages: [{ role: "user", content: [{ type: "document", source: { type: "base64", media_type: "application/pdf", data: b64 } }, { type: "text", text: prompt }] }] }) });
    const data = await r.json();
    let t = (data.content || []).filter((b) => b.type === "text").map((b) => b.text).join("").trim().replace(/```json/gi, "").replace(/```/g, "").trim();
    const p = JSON.parse(t.slice(t.indexOf("{"), t.lastIndexOf("}") + 1));
    if (!p.transactions || !p.transactions.length) throw new Error("empty");
    return p.transactions;
  }
  async function ask(q) {
    const query = q || question; if (!query.trim()) return;
    setQuestion(query); setAsking(true); setAnswer("");
    try {
      const r = await fetch(ENDPOINT, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ model: "claude-sonnet-4-20250514", max_tokens: 1000, messages: [{ role: "user", content: `Bank statement transactions as JSON:\n${JSON.stringify(rows)}\n\nAnswer briefly in plain English using the rupee symbol. Compute totals when needed. 1-3 short sentences.\n\nQuestion: ${query}` }] }) });
      const data = await r.json();
      setAnswer((data.content || []).filter((b) => b.type === "text").map((b) => b.text).join("").trim() || "I couldn't find an answer.");
    } catch (e) { setAnswer("Sorry, I couldn't answer that. Please try again."); }
    setAsking(false);
  }
  const reset = () => { setStage("idle"); setRows([]); setErr(""); setAnswer(""); setQuestion(""); };
  function dlExcel() { try { const ws = XLSX.utils.json_to_sheet(rows.map((t) => ({ Date: t.date, Description: t.description, Category: t.category || "", "Money Out": t.debit ?? "", "Money In": t.credit ?? "", Balance: t.balance ?? "" }))); ws["!cols"] = [{ wch: 10 }, { wch: 30 }, { wch: 14 }, { wch: 11 }, { wch: 11 }, { wch: 13 }]; const wb = XLSX.utils.book_new(); XLSX.utils.book_append_sheet(wb, ws, "Statement"); XLSX.writeFile(wb, "bank-statement.xlsx"); } catch (e) {} }

  const totalIn = rows.reduce((s, t) => s + (t.credit || 0), 0), totalOut = rows.reduce((s, t) => s + (t.debit || 0), 0);
  const range = rows.length ? `${rows[0].date} – ${rows[rows.length - 1].date}` : "";
  const issues = stage === "done" ? checkAuthenticity(rows) : [];
  const spend = (() => { const m = {}; rows.forEach((t) => { if (t.debit) m[t.category || "Other"] = (m[t.category || "Other"] || 0) + t.debit; }); return Object.entries(m).sort((a, b) => b[1] - a[1]); })();
  const maxSpend = spend.length ? spend[0][1] : 1;
  const charges = rows.filter((t) => t.charge), chargeTotal = charges.reduce((s, t) => s + (t.debit || 0), 0);
  const subs = rows.filter((t) => t.category === "Subscription");
  const sugg = ["How much did I spend on food?", "What were my total bank charges?", "List my biggest expenses"];

  return (
    <div style={{ maxWidth: 720, margin: "0 auto", padding: "26px 22px 40px" }}>
      <BackBar goHub={goHub} label="Understand Your Statement" />
      {(stage === "idle" || stage === "error") && (
        <>
          <h1 style={{ fontFamily: FD, fontWeight: 700, fontSize: 30, letterSpacing: -0.8, textAlign: "center", margin: "0 0 8px" }}>Finally understand your bank statement</h1>
          <p style={{ fontFamily: FB, fontSize: 15, color: C.inkSoft, textAlign: "center", margin: "0 auto 24px", maxWidth: 470 }}>See where your money went, catch hidden charges and wrong deductions, check it's genuine, and export to Excel.</p>
          <Dropzone onFile={onFile} drag={drag} setDrag={setDrag} inputRef={inputRef} title="Drop your bank statement PDF" sub="or click to browse · PDF up to 20 MB" />
          {err && <div style={{ marginTop: 14, background: C.roseWash, border: `1px solid ${C.rose}33`, borderRadius: 12, padding: "12px 16px", fontFamily: FB, fontSize: 13.5, color: C.rose, fontWeight: 600 }}>{err}</div>}
          <div style={{ textAlign: "center", marginTop: 16 }}><span onClick={trySample} style={{ fontFamily: FB, fontSize: 13.5, color: C.emerald, fontWeight: 700, cursor: "pointer", borderBottom: `1.5px solid ${C.emerald}55` }}>Try a sample statement →</span></div>
        </>
      )}
      {stage === "processing" && <Steps steps={STEPS} step={step} label={`Reading ${fileName}…`} />}
      {stage === "done" && (
        <div style={{ animation: "fu .45s ease both" }}>
          <div style={{ background: C.card, border: `1px solid ${C.line}`, borderRadius: 18, padding: "16px 18px", boxShadow: "0 10px 30px rgba(0,0,0,0.05)", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 14, flexWrap: "wrap" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 11 }}><CheckCircle2 size={22} color={C.emerald} /><div><div style={{ fontFamily: FD, fontWeight: 600, fontSize: 15.5 }}>{rows.length} transactions read & categorised</div><div style={{ fontFamily: FM, fontSize: 12, color: C.inkFaint }}>{fileName}</div></div></div>
            <div style={{ display: "flex", gap: 9 }}><Btn kind="ghost" small onClick={reset}><RefreshCw size={14} /> New</Btn><Btn kind="primary" small onClick={dlExcel}><FileSpreadsheet size={15} /> Excel</Btn></div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 11, marginTop: 12 }}>
            {[{ l: "Period", v: range, c: C.ink, Icon: CalendarDays }, { l: "Money in", v: inr(totalIn), c: C.emerald, Icon: TrendingUp }, { l: "Money out", v: inr(totalOut), c: C.rose, Icon: TrendingDown }].map((x) => (
              <div key={x.l} style={{ background: C.card, border: `1px solid ${C.line}`, borderRadius: 14, padding: "13px 15px" }}><div style={{ display: "flex", alignItems: "center", gap: 6 }}><x.Icon size={13} color={C.inkFaint} /><span style={{ fontFamily: FB, fontSize: 11.5, color: C.inkFaint, fontWeight: 600 }}>{x.l}</span></div><div style={{ fontFamily: FM, fontSize: 14.5, fontWeight: 600, color: x.c, marginTop: 6 }}>{x.v}</div></div>
            ))}
          </div>

          {/* WHERE YOUR MONEY WENT */}
          <Section title="Where your money went" icon={PieChart} style={{ marginTop: 12 }}>
            {spend.slice(0, 7).map(([cat, amt]) => (
              <div key={cat} style={{ marginBottom: 11 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}><span style={{ fontFamily: FB, fontSize: 12.5, fontWeight: 600, color: C.ink }}>{cat}</span><span style={{ fontFamily: FM, fontSize: 12.5, fontWeight: 600, color: cat === "Bank Charge" ? C.gold : C.ink }}>{inr(amt)}</span></div>
                <div style={{ height: 7, background: C.bg2, borderRadius: 99, overflow: "hidden" }}><div style={{ height: "100%", width: `${(amt / maxSpend) * 100}%`, background: CAT_COLOR(cat), borderRadius: 99 }} /></div>
              </div>
            ))}
          </Section>

          {/* HIDDEN CHARGES / DEDUCTIONS EXPLAINED */}
          <Section title="Deductions to review" icon={Receipt} accent={C.gold + "44"} style={{ marginTop: 12 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: C.goldWash, borderRadius: 12, padding: "11px 14px", marginBottom: 12 }}>
              <span style={{ fontFamily: FB, fontSize: 13, fontWeight: 700, color: C.gold }}>{inr(chargeTotal)} in bank charges this period</span>
              <span style={{ fontFamily: FB, fontSize: 11, fontWeight: 700, color: C.gold, background: C.card, padding: "3px 9px", borderRadius: 99 }}>EASY TO MISS</span>
            </div>
            {charges.map((t, i) => (
              <div key={i} style={{ display: "flex", gap: 10, padding: "9px 0", borderBottom: `1px solid ${C.lineSoft}` }}>
                <AlertTriangle size={15} color={C.gold} style={{ flexShrink: 0, marginTop: 2 }} />
                <div style={{ flex: 1 }}><div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ fontFamily: FB, fontSize: 13, fontWeight: 600 }}>{t.description.replace(/^\w/, (c) => c)}</span><span style={{ fontFamily: FM, fontSize: 12.5, fontWeight: 600, color: C.gold }}>{inr(t.debit)}</span></div><div style={{ fontFamily: FB, fontSize: 11.5, color: C.inkSoft, marginTop: 2 }}>{t.explain || "Bank charge."}</div></div>
              </div>
            ))}
            {subs.map((t, i) => (
              <div key={"s" + i} style={{ display: "flex", gap: 10, padding: "9px 0", borderBottom: i < subs.length - 1 ? `1px solid ${C.lineSoft}` : "none" }}>
                <Repeat size={15} color={C.emerald} style={{ flexShrink: 0, marginTop: 2 }} />
                <div style={{ flex: 1 }}><div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ fontFamily: FB, fontSize: 13, fontWeight: 600 }}>{t.description}</span><span style={{ fontFamily: FM, fontSize: 12.5, fontWeight: 600, color: C.ink }}>{inr(t.debit)}/mo</span></div><div style={{ fontFamily: FB, fontSize: 11.5, color: C.inkSoft, marginTop: 2 }}>{t.explain || "Recurring subscription."}</div></div>
              </div>
            ))}
            <p style={{ fontFamily: FB, fontSize: 11.5, color: C.inkFaint, lineHeight: 1.5, margin: "12px 0 0" }}>We show what each deduction looks like and what to check — for the exact reason a charge applied, confirm with your bank.</p>
          </Section>

          {/* FAKE-STATEMENT CHECK */}
          <div style={{ marginTop: 12, background: issues.length ? C.goldWash : C.emeraldWash, border: `1px solid ${issues.length ? C.gold + "44" : C.emerald + "33"}`, borderRadius: 16, padding: "16px 18px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>{issues.length ? <ShieldAlert size={20} color={C.gold} /> : <ShieldCheck size={20} color={C.emeraldDeep} />}<span style={{ fontFamily: FD, fontWeight: 600, fontSize: 15.5, color: issues.length ? C.gold : C.emeraldDeep }}>{issues.length ? `${issues.length} transaction(s) don't add up` : "Statement looks genuine"}</span><span style={{ marginLeft: "auto", fontFamily: FB, fontSize: 10.5, fontWeight: 700, color: issues.length ? C.gold : C.emeraldDeep, background: C.card, padding: "4px 9px", borderRadius: 99 }}>FAKE-STATEMENT CHECK</span></div>
            <p style={{ fontFamily: FB, fontSize: 12.5, color: C.inkSoft, lineHeight: 1.5, margin: "9px 0 0" }}>{issues.length ? "The running balance doesn't reconcile on these rows — a possible sign of an edited statement." : `Every balance across all ${rows.length} transactions reconciles correctly.`}</p>
          </div>

          {/* TABLE WITH CATEGORIES */}
          <div style={{ background: C.card, border: `1px solid ${C.line}`, borderRadius: 16, marginTop: 12, overflow: "hidden", boxShadow: "0 10px 30px rgba(0,0,0,0.04)" }}>
            <div style={{ display: "grid", gridTemplateColumns: "62px 1fr 76px 76px", background: C.bg2, padding: "11px 16px", borderBottom: `1px solid ${C.line}` }}>{["Date", "Description", "Out", "In"].map((h, i) => <span key={h} style={{ fontFamily: FB, fontSize: 10.5, fontWeight: 700, color: C.inkSoft, textTransform: "uppercase", letterSpacing: 0.5, textAlign: i >= 2 ? "right" : "left" }}>{h}</span>)}</div>
            <div style={{ maxHeight: 300, overflowY: "auto" }}>
              {rows.map((t, i) => (
                <div key={i} style={{ display: "grid", gridTemplateColumns: "62px 1fr 76px 76px", padding: "11px 16px", borderBottom: i < rows.length - 1 ? `1px solid ${C.lineSoft}` : "none", background: i % 2 ? "#FCFBF7" : C.card, alignItems: "center" }}>
                  <span style={{ fontFamily: FM, fontSize: 11.5, color: C.inkSoft }}>{t.date}</span>
                  <div style={{ minWidth: 0, paddingRight: 8 }}><div style={{ fontFamily: FB, fontSize: 12.5, fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{t.description}</div>{t.category && <span style={{ display: "inline-block", marginTop: 3, fontFamily: FB, fontSize: 9.5, fontWeight: 600, color: t.charge ? C.gold : C.inkFaint, background: t.charge ? C.goldWash : C.bg2, padding: "1px 7px", borderRadius: 99 }}>{t.category}</span>}</div>
                  <span style={{ fontFamily: FM, fontSize: 11.5, color: t.debit ? C.rose : C.inkFaint, textAlign: "right" }}>{t.debit ? bare(t.debit) : "—"}</span>
                  <span style={{ fontFamily: FM, fontSize: 11.5, color: t.credit ? C.emerald : C.inkFaint, textAlign: "right" }}>{t.credit ? bare(t.credit) : "—"}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ASK */}
          <div style={{ marginTop: 12, background: C.card, border: `1px solid ${C.line}`, borderRadius: 16, padding: "18px", boxShadow: "0 10px 30px rgba(0,0,0,0.04)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 9 }}><div style={{ width: 32, height: 32, borderRadius: 9, background: C.emeraldWash, display: "flex", alignItems: "center", justifyContent: "center" }}><MessageCircleQuestion size={18} color={C.emerald} /></div><div><div style={{ fontFamily: FD, fontWeight: 600, fontSize: 15.5 }}>Ask your statement</div><div style={{ fontFamily: FB, fontSize: 12, color: C.inkFaint }}>Type a question, get the answer instantly.</div></div></div>
            <div style={{ display: "flex", gap: 8, marginTop: 14 }}><input value={question} onChange={(e) => setQuestion(e.target.value)} onKeyDown={(e) => e.key === "Enter" && ask()} placeholder="e.g. What were my total bank charges?" style={{ flex: 1, fontFamily: FB, fontSize: 14, color: C.ink, background: C.bg, border: `1px solid ${C.line}`, borderRadius: 12, padding: "12px 15px" }} /><Btn kind="primary" onClick={() => ask()} disabled={asking || !question.trim()}>{asking ? <Loader2 size={16} className="sp" /> : <Send size={16} />}</Btn></div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 7, marginTop: 11 }}>{sugg.map((q) => <span key={q} onClick={() => ask(q)} style={{ fontFamily: FB, fontSize: 12, fontWeight: 600, color: C.inkSoft, background: C.bg2, border: `1px solid ${C.line}`, padding: "6px 11px", borderRadius: 99, cursor: "pointer" }}>{q}</span>)}</div>
            {(asking || answer) && <div style={{ marginTop: 14, background: C.emeraldWash, border: `1px solid ${C.emerald}22`, borderRadius: 12, padding: "14px 16px" }}>{asking ? <div style={{ display: "flex", alignItems: "center", gap: 8, fontFamily: FB, fontSize: 13.5, color: C.emeraldDeep, fontWeight: 600 }}><Loader2 size={15} className="sp" /> Reading your transactions…</div> : <div style={{ display: "flex", gap: 9 }}><Sparkles size={16} color={C.emerald} style={{ flexShrink: 0, marginTop: 2 }} /><p style={{ fontFamily: FB, fontSize: 14, lineHeight: 1.55, margin: 0, whiteSpace: "pre-wrap" }}>{answer}</p></div>}</div>}
          </div>
        </div>
      )}
    </div>
  );
}

/* ===================== TIER 2: ANALYZE A BORROWER ========================= */
function AnalyzeTool({ goHub }) {
  const [stage, setStage] = useState("idle");
  const [step, setStep] = useState(0);
  const [drag, setDrag] = useState(false);
  const inputRef = useRef(null);
  const s = SAMPLE_BORROWER, a = analyze(s);
  const STEPS = ["Reading statements", "Detecting income & EMIs", "Checking for fraud", "Building report"];
  function runDemo() { setStage("processing"); setStep(0); [setTimeout(() => setStep(1), 700), setTimeout(() => setStep(2), 1500), setTimeout(() => setStep(3), 2300), setTimeout(() => setStage("done"), 3000)]; }
  function dl() { try { const r = [["BORROWER REPORT", ""], ["Borrower", s.name], ["Period", s.period], ["Health Score", `${a.score}/100 (${a.grade})`], ["Verified income", inr(s.income)], ["Avg balance", inr(s.amb)], ["Existing EMIs", inr(s.existingEMI)], ["Bounces", s.bounces], ["Cash deposits", inr(s.cashDeposits)], ["FOIR cap", inr(a.foirCap)], ["Available capacity", inr(a.available)], ["Recommended loan", inr(a.loanAmount)]]; const ws = XLSX.utils.aoa_to_sheet(r); ws["!cols"] = [{ wch: 26 }, { wch: 24 }]; const wb = XLSX.utils.book_new(); XLSX.utils.book_append_sheet(wb, ws, "Report"); XLSX.writeFile(wb, "borrower-report.xlsx"); } catch (e) {} }
  const maxBar = Math.max(...s.months.flatMap((m) => [m.inc, m.exp]));

  return (
    <div style={{ maxWidth: 920, margin: "0 auto", padding: "26px 22px 50px" }}>
      <BackBar goHub={goHub} label="Borrower Analyzer" />
      {stage === "idle" && (
        <div style={{ maxWidth: 680, margin: "0 auto", textAlign: "center" }}>
          <h1 style={{ fontFamily: FD, fontWeight: 700, fontSize: 32, letterSpacing: -0.9, margin: "0 0 8px" }}>Analyze a borrower in 30 seconds</h1>
          <p style={{ fontFamily: FB, fontSize: 15.5, color: C.inkSoft, margin: "0 auto 24px", maxWidth: 500 }}>Upload 6 months → salary verification, average balance, existing EMIs, bounce history, fraud check, and a loan-eligibility report.</p>
          <Dropzone onFile={runDemo} drag={drag} setDrag={setDrag} inputRef={inputRef} title="Drop the borrower's statement PDFs" sub="Up to 6 months · multiple files" />
          <div style={{ marginTop: 16 }}><span onClick={runDemo} style={{ fontFamily: FB, fontSize: 13.5, color: C.emerald, fontWeight: 700, cursor: "pointer", borderBottom: `1.5px solid ${C.emerald}55` }}>See a sample borrower report →</span></div>
        </div>
      )}
      {stage === "processing" && <div style={{ maxWidth: 480, margin: "0 auto" }}><Steps steps={STEPS} step={step} label={`Analyzing ${s.name}'s statements…`} /></div>}
      {stage === "done" && (
        <div style={{ animation: "fu .45s ease both" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14, flexWrap: "wrap", gap: 10 }}>
            <span style={{ background: C.goldWash, color: C.gold, padding: "3px 9px", borderRadius: 99, fontFamily: FB, fontSize: 12, fontWeight: 700 }}>SAMPLE REPORT</span>
            <div style={{ display: "flex", gap: 9 }}><Btn kind="ghost" small onClick={() => setStage("idle")}><RefreshCw size={14} /> New borrower</Btn><Btn kind="ghost" small onClick={() => window.print()}><Printer size={14} /> PDF</Btn><Btn kind="primary" small onClick={dl}><Download size={15} /> Download</Btn></div>
          </div>
          <div style={{ background: `linear-gradient(135deg, ${C.ink}, #232A23)`, borderRadius: 20, padding: 24, color: "#fff", position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: -50, right: -30, width: 200, height: 200, borderRadius: 99, background: `${C.emerald}40`, filter: "blur(60px)" }} />
            <div style={{ position: "relative", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 20 }}>
              <div>
                <div style={{ fontFamily: FB, fontSize: 12, color: "#9FB0A4", fontWeight: 600 }}>BORROWER FINANCIAL REPORT</div>
                <div style={{ fontFamily: FD, fontWeight: 700, fontSize: 26, marginTop: 6 }}>{s.name}</div>
                <div style={{ fontFamily: FB, fontSize: 13, color: "#C2CEC5", marginTop: 6, display: "flex", gap: 14, flexWrap: "wrap" }}><span style={{ display: "flex", alignItems: "center", gap: 5 }}><CalendarDays size={13} /> {s.period}</span><span style={{ display: "flex", alignItems: "center", gap: 5 }}><Building2 size={13} /> {s.account}</span></div>
                <div style={{ marginTop: 16, display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(21,181,137,0.18)", border: `1px solid ${C.emeraldBright}55`, padding: "9px 15px", borderRadius: 12 }}><CheckCircle2 size={17} color={C.emeraldBright} /><span style={{ fontFamily: FB, fontWeight: 700, fontSize: 14 }}>Eligible · up to {inr(Math.round(a.loanAmount / 10000) * 10000)}</span></div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <svg width="100" height="100" viewBox="0 0 104 104"><circle cx="52" cy="52" r="42" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="9" /><circle cx="52" cy="52" r="42" fill="none" stroke={C.emeraldBright} strokeWidth="9" strokeLinecap="round" strokeDasharray={2 * Math.PI * 42} strokeDashoffset={2 * Math.PI * 42 * (1 - a.score / 100)} transform="rotate(-90 52 52)" /><text x="52" y="49" textAnchor="middle" fontFamily={FD} fontSize="28" fontWeight="700" fill="#fff">{a.score}</text><text x="52" y="66" textAnchor="middle" fontFamily={FB} fontSize="10" fill="#9FB0A4">/ 100</text></svg>
                <div style={{ fontFamily: FB, fontWeight: 700, fontSize: 13, color: C.emeraldBright, marginTop: 4 }}>{a.grade}</div>
                <div style={{ fontFamily: FB, fontSize: 10.5, color: "#9FB0A4" }}>Health Score</div>
              </div>
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 11, marginTop: 14 }}>
            {[{ l: "Verified income", v: inr(s.income), suf: "/mo", c: C.emerald, Icon: IndianRupee }, { l: "Avg balance", v: inr(s.amb), c: C.ink, Icon: Banknote }, { l: "Existing EMIs", v: inr(s.existingEMI), suf: "/mo", c: C.ink, Icon: Landmark }, { l: "Bounces", v: String(s.bounces), c: C.gold, Icon: AlertTriangle, warn: true }, { l: "Cash deposits", v: inr(s.cashDeposits), c: C.ink, Icon: Banknote }].map((x) => (
              <div key={x.l} style={{ background: C.card, border: `1px solid ${x.warn ? C.gold + "44" : C.line}`, borderRadius: 14, padding: "13px 14px" }}><div style={{ display: "flex", alignItems: "center", gap: 5 }}><x.Icon size={13} color={x.warn ? C.gold : C.inkFaint} /><span style={{ fontFamily: FB, fontSize: 10.5, color: C.inkFaint, fontWeight: 600 }}>{x.l}</span></div><div style={{ fontFamily: FM, fontSize: 14, fontWeight: 600, color: x.c, marginTop: 6 }}>{x.v}<span style={{ fontSize: 9.5, color: C.inkFaint }}>{x.suf || ""}</span></div></div>
            ))}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 14, marginTop: 14 }}>
            <Section title="Income vs Expense — 6 months" icon={TrendingUp}>
              <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", height: 130, gap: 8 }}>
                {s.months.map((m) => (<div key={m.m} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}><div style={{ display: "flex", alignItems: "flex-end", gap: 3, height: 104 }}><div style={{ width: 11, height: `${(m.inc / maxBar) * 104}px`, background: `linear-gradient(${C.emeraldBright}, ${C.emerald})`, borderRadius: "3px 3px 0 0" }} /><div style={{ width: 11, height: `${(m.exp / maxBar) * 104}px`, background: C.rose, borderRadius: "3px 3px 0 0", opacity: 0.85 }} /></div><span style={{ fontFamily: FB, fontSize: 11, color: C.inkFaint, fontWeight: 600 }}>{m.m}</span></div>))}
              </div>
              <div style={{ display: "flex", gap: 16, marginTop: 12, justifyContent: "center" }}><span style={{ display: "flex", alignItems: "center", gap: 6, fontFamily: FB, fontSize: 11.5, color: C.inkSoft, fontWeight: 600 }}><span style={{ width: 10, height: 10, borderRadius: 3, background: C.emerald }} /> Income</span><span style={{ display: "flex", alignItems: "center", gap: 6, fontFamily: FB, fontSize: 11.5, color: C.inkSoft, fontWeight: 600 }}><span style={{ width: 10, height: 10, borderRadius: 3, background: C.rose }} /> Expense</span></div>
            </Section>
            <Section title="Loan eligibility" icon={Gauge}>
              {[{ l: "Net monthly income", v: inr(s.income) }, { l: "FOIR cap (50%)", v: inr(a.foirCap) }, { l: "Less: existing EMI", v: "− " + inr(s.existingEMI) }, { l: "Available capacity", v: inr(a.available), hi: true }].map((x, i) => (<div key={x.l} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: i < 3 ? `1px solid ${C.lineSoft}` : "none" }}><span style={{ fontFamily: FB, fontSize: 12.5, color: x.hi ? C.ink : C.inkSoft, fontWeight: x.hi ? 700 : 500 }}>{x.l}</span><span style={{ fontFamily: FM, fontSize: 13, fontWeight: 600, color: x.hi ? C.emerald : C.ink }}>{x.v}</span></div>))}
              <div style={{ marginTop: 12, background: C.emeraldWash, borderRadius: 12, padding: "13px 14px", textAlign: "center" }}><div style={{ fontFamily: FB, fontSize: 11.5, color: C.emeraldDeep, fontWeight: 600 }}>Recommended loan (10% · 5 yr)</div><div style={{ fontFamily: FD, fontSize: 22, fontWeight: 700, color: C.emeraldDeep, marginTop: 3 }}>{inr(Math.round(a.loanAmount / 10000) * 10000)}</div></div>
            </Section>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginTop: 14 }}>
            <Section title="Salary verification" icon={Briefcase}><div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}><CheckCircle2 size={16} color={C.emerald} /><span style={{ fontFamily: FB, fontSize: 13.5, fontWeight: 700, color: C.emerald }}>Verified — regular salary</span></div><Row k="Employer" v={s.employer} /><Row k="Monthly salary" v={inr(s.income)} mono /><Row k="Credited" v={`${s.salaryMonths}/6 months · ~1st`} /></Section>
            <Section title="Existing obligations" icon={Landmark}><div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: C.bg2, borderRadius: 10, padding: "11px 13px" }}><div><div style={{ fontFamily: FB, fontSize: 13.5, fontWeight: 600 }}>{s.emiName}</div><div style={{ fontFamily: FB, fontSize: 11.5, color: C.inkFaint }}>Detected {s.emiMonths}/6 months</div></div><span style={{ fontFamily: FM, fontSize: 14, fontWeight: 600, color: C.rose }}>{inr(s.existingEMI)}/mo</span></div></Section>
            <Section title="Bounce history" icon={AlertTriangle} accent={C.gold + "33"}><div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}><ShieldAlert size={16} color={C.gold} /><span style={{ fontFamily: FB, fontSize: 13.5, fontWeight: 700, color: C.gold }}>{s.bounces} bounce — review</span></div><div style={{ fontFamily: FM, fontSize: 12, color: C.inkSoft, background: C.goldWash, padding: "10px 12px", borderRadius: 9 }}>{s.bounceDetail}</div></Section>
            <Section title="Authenticity & fraud check" icon={ShieldCheck} accent={C.emerald + "33"}><div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}><ShieldCheck size={16} color={C.emerald} /><span style={{ fontFamily: FB, fontSize: 13.5, fontWeight: 700, color: C.emeraldDeep }}>Looks genuine</span></div><div style={{ fontFamily: FB, fontSize: 12.5, color: C.inkSoft, lineHeight: 1.5 }}>All balances reconcile and no PDF tampering detected. {inr(s.cashDeposits)} cash deposits ({s.cashCount}) noted.</div></Section>
          </div>
          <div style={{ textAlign: "center", fontFamily: FB, fontSize: 11.5, color: C.inkFaint, marginTop: 16 }}>Decision-support report, not a credit guarantee. Confirm figures against your lender's policy.</div>
        </div>
      )}
    </div>
  );
}

/* ============================== HUB / ROUTER ============================== */
export default function App() {
  const [tool, setTool] = useState("hub");
  return (
    <div style={{ minHeight: "100vh", background: C.bg, color: C.ink, fontFamily: FB }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Hanken+Grotesk:wght@400;500;600;700;800&family=IBM+Plex+Mono:wght@400;500;600&display=swap');
        * { box-sizing: border-box; }
        @keyframes spin { to { transform: rotate(360deg) } }
        @keyframes fu { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:none} }
        .sp { animation: spin 1s linear infinite; }
        input:focus { outline: none; }
      `}</style>

      <div style={{ borderBottom: `1px solid ${C.line}`, background: "rgba(250,249,244,0.85)", backdropFilter: "blur(10px)", position: "sticky", top: 0, zIndex: 20 }}>
        <div style={{ maxWidth: 1000, margin: "0 auto", padding: "15px 22px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div onClick={() => setTool("hub")} style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: `linear-gradient(135deg, ${C.emeraldBright}, ${C.emerald})`, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 6px 16px ${C.emerald}33` }}><FileSpreadsheet size={20} color="#fff" /></div>
            <span style={{ fontFamily: FD, fontWeight: 700, fontSize: 19, letterSpacing: -0.3 }}>Sheetly</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <Link href="/pricing" style={{ fontFamily: FB, fontSize: 14, fontWeight: 600, color: C.inkSoft, textDecoration: "none" }}>Pricing</Link>
          <Link href="/about" style={{ fontFamily: FB, fontSize: 14, fontWeight: 600, color: C.inkSoft, textDecoration: "none" }}>About</Link>
          <div style={{ display: "flex", alignItems: "center", gap: 8, background: C.emeraldWash, padding: "6px 12px", borderRadius: 99 }}><Lock size={12} color={C.emeraldDeep} /><span style={{ fontFamily: FB, fontSize: 11.5, fontWeight: 700, color: C.emeraldDeep }}>Private & secure</span></div>
        </div>
        </div>
      </div>

      {tool === "consumer" && <ConsumerTool goHub={() => setTool("hub")} />}
      {tool === "analyze" && <AnalyzeTool goHub={() => setTool("hub")} />}

      {tool === "hub" && (
        <>
          <div style={{ maxWidth: 780, margin: "0 auto", padding: "54px 22px 0", textAlign: "center" }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 7, background: C.card, border: `1px solid ${C.line}`, padding: "7px 14px", borderRadius: 99, boxShadow: "0 2px 10px rgba(0,0,0,0.03)" }}><Sparkles size={14} color={C.emerald} /><span style={{ fontFamily: FB, fontSize: 12.5, fontWeight: 700, color: C.inkSoft }}>Bank statement intelligence</span></div>
            <h1 style={{ fontFamily: FD, fontWeight: 700, fontSize: 44, lineHeight: 1.08, letterSpacing: -1.2, margin: "22px 0 0" }}>Everything your bank<br />statement is hiding.</h1>
            <p style={{ fontFamily: FB, fontSize: 17, color: C.inkSoft, lineHeight: 1.55, margin: "18px auto 0", maxWidth: 530 }}>One engine that reads any statement — to help you understand your money, or to size up a borrower in seconds.</p>
          </div>

          <div style={{ maxWidth: 840, margin: "34px auto 0", padding: "0 22px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
            {[
              { id: "consumer", Icon: PieChart, tag: "For everyone & small businesses", t: "Understand Your Statement", d: "See where your money went, catch hidden charges and wrong deductions, check it's genuine, and export to Excel.", feats: ["Where your money went", "Hidden-charge & deduction finder", "Fake-statement check + Ask anything"] },
              { id: "analyze", Icon: Gauge, tag: "For loan agents, DSAs & CAs", t: "Analyze a Borrower", d: "Upload 6 months and get a full financial-health and loan-eligibility report in 30 seconds.", feats: ["Salary, EMIs & bounces", "Loan eligibility + health score", "Fraud check + downloadable report"] },
            ].map((x) => (
              <div key={x.id} onClick={() => setTool(x.id)} style={{ background: C.card, border: `1px solid ${C.line}`, borderRadius: 20, padding: 24, boxShadow: "0 12px 36px rgba(0,0,0,0.05)", cursor: "pointer", display: "flex", flexDirection: "column" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div style={{ width: 48, height: 48, borderRadius: 13, background: `linear-gradient(135deg, ${C.emeraldBright}, ${C.emerald})`, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 8px 20px ${C.emerald}33` }}><x.Icon size={24} color="#fff" /></div>
                  <span style={{ fontFamily: FB, fontSize: 10.5, fontWeight: 700, color: C.emeraldDeep, background: C.emeraldWash, padding: "5px 10px", borderRadius: 99 }}>{x.tag}</span>
                </div>
                <div style={{ fontFamily: FD, fontWeight: 700, fontSize: 21, marginTop: 16 }}>{x.t}</div>
                <div style={{ fontFamily: FB, fontSize: 13.5, color: C.inkSoft, lineHeight: 1.55, marginTop: 7 }}>{x.d}</div>
                <div style={{ margin: "14px 0", borderTop: `1px solid ${C.lineSoft}`, paddingTop: 14 }}>{x.feats.map((f) => <div key={f} style={{ display: "flex", alignItems: "center", gap: 8, padding: "4px 0" }}><Check size={14} color={C.emerald} /><span style={{ fontFamily: FB, fontSize: 12.5, color: C.inkSoft, fontWeight: 500 }}>{f}</span></div>)}</div>
                <div style={{ marginTop: "auto" }}><Btn kind="primary" style={{ width: "100%" }}>Open {x.t} <ArrowRight size={16} /></Btn></div>
              </div>
            ))}
          </div>

          <div style={{ maxWidth: 900, margin: "48px auto 0", padding: "0 22px" }}>
            <div style={{ textAlign: "center", fontFamily: FB, fontSize: 12.5, fontWeight: 700, color: C.inkFaint, textTransform: "uppercase", letterSpacing: 1 }}>Works with statements from</div>
            <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 10, marginTop: 16 }}>{BANKS.map((b) => <div key={b} style={{ fontFamily: FB, fontSize: 13, fontWeight: 600, color: C.inkSoft, background: C.card, border: `1px solid ${C.line}`, padding: "8px 15px", borderRadius: 99 }}>{b}</div>)}<div style={{ fontFamily: FB, fontSize: 13, fontWeight: 700, color: C.emerald, background: C.emeraldWash, padding: "8px 15px", borderRadius: 99 }}>+ many more</div></div>
          </div>

          <div style={{ maxWidth: 780, margin: "48px auto 0", padding: "0 22px 50px" }}>
            <div style={{ background: `linear-gradient(135deg, ${C.ink}, #2C322C)`, borderRadius: 22, padding: "30px", textAlign: "center", position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", top: -40, right: -20, width: 160, height: 160, borderRadius: 99, background: `${C.emerald}33`, filter: "blur(50px)" }} />
              <div style={{ position: "relative" }}>
                <div style={{ fontFamily: FB, fontSize: 13, fontWeight: 700, color: C.emeraldBright, textTransform: "uppercase", letterSpacing: 1 }}>Simple pricing</div>
                <div style={{ fontFamily: FD, fontWeight: 700, fontSize: 24, color: "#fff", marginTop: 10, letterSpacing: -0.5 }}>Personal ₹199/mo · Business from ₹49/report</div>
                <p style={{ fontFamily: FB, fontSize: 14.5, color: "#B8BEB8", marginTop: 10, maxWidth: 470, margin: "10px auto 0", lineHeight: 1.55 }}>Free to try. Individuals get the Personal plan; loan agents & CAs use the Business plan for borrower reports.</p>
              </div>
            </div>
          </div>
          {/* FOOTER */}
          <div style={{ borderTop: `1px solid ${C.line}`, background: C.bg2, padding: "28px 22px", textAlign: "center", marginTop: 0 }}>
            <div style={{ display: "flex", justifyContent: "center", gap: 28, flexWrap: "wrap" }}>
              {[['/pricing','Pricing'], ['/about','About'], ['/privacy','Privacy Policy'], ['/terms','Terms of Service']].map(([href, label]) => (
                <Link key={href} href={href} style={{ fontFamily: FB, fontSize: 13.5, fontWeight: 600, color: C.inkSoft, textDecoration: "none" }}>{label}</Link>
              ))}
            </div>
            <div style={{ fontFamily: FB, fontSize: 12.5, color: C.inkFaint, marginTop: 12 }}>© 2025 Sheetly · Made in Guwahati, Assam 🇮🇳</div>
          </div>
        </>
      )}
    </div>
  );
}