import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { ShieldCheck, FileSpreadsheet, Gauge, MessageCircleQuestion, Lock, PieChart } from 'lucide-react';

const C = {
  bg: "#FAF9F4", bg2: "#F2F1EA", card: "#FFFFFF", ink: "#191C19",
  inkSoft: "#565B55", inkFaint: "#969B92", line: "#E8E6DC", lineSoft: "#F0EEE6",
  emerald: "#0E8F6B", emeraldBright: "#15B589", emeraldDeep: "#0A6E53",
  emeraldWash: "#E7F4EF", gold: "#B98A2E", goldWash: "#FBF3DF",
};
const FD = "'Space Grotesk', sans-serif";
const FB = "'Hanken Grotesk', system-ui, sans-serif";

const STEPS = [
  { n: "01", icon: FileSpreadsheet, title: "Upload your PDF", body: "Drop any bank statement PDF — digital or scanned. We support all major Indian banks including HDFC, SBI, ICICI, Axis, Kotak, and more." },
  { n: "02", icon: PieChart, title: "We read and analyse it", body: "Our engine extracts every transaction, categorises your spending, finds hidden bank charges, and checks the statement is genuine — all in seconds." },
  { n: "03", icon: Gauge, title: "Get clear answers", body: "See where your money went, catch charges you missed, export to Excel, ask questions in plain English, or get a full borrower report if you're a loan agent." },
];
const TRUST = [
  { icon: Lock, title: "We never store your statements", body: "Your PDF is processed and deleted immediately. We never keep your bank statement on our servers — not even temporarily after processing." },
  { icon: ShieldCheck, title: "Fake-statement detection", body: "Every statement is checked by re-computing the running balance on every row. A tampered statement won't pass this check." },
  { icon: MessageCircleQuestion, title: "Honest about what we know", body: "Every extracted figure is labelled 'auto-detected, please verify.' We tell you when we're uncertain so you can double-check what matters." },
];

export default function AboutPage() {
  return (
    <div style={{ minHeight: "100vh", background: C.bg, fontFamily: FB }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Hanken+Grotesk:wght@400;500;600;700;800&display=swap'); * { box-sizing: border-box; }`}</style>
      <Navbar active="About" />

      {/* HERO */}
      <div style={{ maxWidth: 720, margin: "0 auto", padding: "60px 22px 50px", textAlign: "center" }}>
        <h1 style={{ fontFamily: FD, fontWeight: 700, fontSize: 42, lineHeight: 1.1, letterSpacing: -1.1, margin: "0 0 18px", color: C.ink }}>Bank statements are confusing.<br />We fix that.</h1>
        <p style={{ fontFamily: FB, fontSize: 17, color: C.inkSoft, lineHeight: 1.65, maxWidth: 540, margin: "0 auto" }}>Most people don't fully understand their own bank statements. Bank charges go unnoticed. Fake statements fool loan agents. And every month, thousands of Indians pay for subscriptions they forgot they had. Sheetly fixes all of this.</p>
      </div>

      {/* THE PROBLEM */}
      <div style={{ maxWidth: 900, margin: "0 auto 60px", padding: "0 22px", display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 18 }}>
        {[
          { emoji: "😤", title: "Hidden bank charges", body: "SMS alerts, minimum balance penalties, card fees — most people never notice them. They just quietly leave your account every month." },
          { emoji: "📄", title: "Unreadable PDF statements", body: "Bank statements are a wall of cryptic text — UPI/NEFT/ECS codes that mean nothing. Most people can't quickly understand where their money went." },
          { emoji: "🎭", title: "Fake statements", body: "Loan agents are shown edited PDFs all the time. A borrower who changes a few numbers can get a loan they can't repay." },
        ].map(p => (
          <div key={p.title} style={{ background: C.card, border: `1px solid ${C.line}`, borderRadius: 18, padding: 24, boxShadow: "0 8px 28px rgba(0,0,0,0.04)" }}>
            <div style={{ fontSize: 32, marginBottom: 14 }}>{p.emoji}</div>
            <div style={{ fontFamily: FD, fontWeight: 600, fontSize: 17, marginBottom: 8 }}>{p.title}</div>
            <div style={{ fontFamily: FB, fontSize: 14, color: C.inkSoft, lineHeight: 1.6 }}>{p.body}</div>
          </div>
        ))}
      </div>

      {/* HOW IT WORKS */}
      <div style={{ background: C.bg2, borderTop: `1px solid ${C.line}`, borderBottom: `1px solid ${C.line}`, padding: "60px 22px" }}>
        <div style={{ maxWidth: 860, margin: "0 auto" }}>
          <h2 style={{ fontFamily: FD, fontWeight: 700, fontSize: 30, textAlign: "center", letterSpacing: -0.7, marginBottom: 40 }}>How Sheetly works</h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 24 }}>
            {STEPS.map(s => (
              <div key={s.n} style={{ textAlign: "center" }}>
                <div style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 56, height: 56, borderRadius: 15, background: C.emeraldWash, marginBottom: 16 }}><s.icon size={26} color={C.emerald} /></div>
                <div style={{ fontFamily: FD, fontWeight: 600, fontSize: 17, marginBottom: 8 }}>{s.title}</div>
                <div style={{ fontFamily: FB, fontSize: 14, color: C.inkSoft, lineHeight: 1.6 }}>{s.body}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* TRUST */}
      <div style={{ maxWidth: 860, margin: "60px auto 0", padding: "0 22px" }}>
        <h2 style={{ fontFamily: FD, fontWeight: 700, fontSize: 30, textAlign: "center", letterSpacing: -0.7, marginBottom: 10 }}>Built for trust</h2>
        <p style={{ fontFamily: FB, fontSize: 15.5, color: C.inkSoft, textAlign: "center", marginBottom: 36 }}>Handling financial data is a serious responsibility. Here's how we take it seriously.</p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 18 }}>
          {TRUST.map(t => (
            <div key={t.title} style={{ background: C.card, border: `1px solid ${C.line}`, borderRadius: 18, padding: 24, boxShadow: "0 8px 28px rgba(0,0,0,0.04)" }}>
              <div style={{ width: 42, height: 42, borderRadius: 11, background: C.emeraldWash, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 14 }}><t.icon size={21} color={C.emerald} /></div>
              <div style={{ fontFamily: FD, fontWeight: 600, fontSize: 16, marginBottom: 8 }}>{t.title}</div>
              <div style={{ fontFamily: FB, fontSize: 14, color: C.inkSoft, lineHeight: 1.6 }}>{t.body}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ABOUT THE FOUNDER */}
      <div style={{ maxWidth: 640, margin: "60px auto 0", padding: "0 22px 70px" }}>
        <div style={{ background: C.card, border: `1px solid ${C.line}`, borderRadius: 20, padding: "32px 30px", boxShadow: "0 10px 36px rgba(0,0,0,0.05)", textAlign: "center" }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>👋</div>
          <h3 style={{ fontFamily: FD, fontWeight: 700, fontSize: 20, marginBottom: 12 }}>Built by a solo founder</h3>
          <p style={{ fontFamily: FB, fontSize: 15, color: C.inkSoft, lineHeight: 1.65, margin: "0 0 14px" }}>Sheetly is built and run by a solo founder in Guwahati, Assam. The goal is simple: give every Indian — not just the financially literate — the tools to truly understand their money.</p>
          <p style={{ fontFamily: FB, fontSize: 15, color: C.inkSoft, lineHeight: 1.65, margin: 0 }}>If you have questions, feedback, or just want to say hi, reach out at <span style={{ color: C.emerald, fontWeight: 600 }}>hello@sheetly.in</span></p>
        </div>
      </div>

      <Footer />
    </div>
  );
}