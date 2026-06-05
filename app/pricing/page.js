import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Check } from 'lucide-react';

const C = {
  bg: "#FAF9F4", bg2: "#F2F1EA", card: "#FFFFFF", ink: "#191C19",
  inkSoft: "#565B55", inkFaint: "#969B92", line: "#E8E6DC", lineSoft: "#F0EEE6",
  emerald: "#0E8F6B", emeraldBright: "#15B589", emeraldDeep: "#0A6E53",
  emeraldWash: "#E7F4EF", gold: "#B98A2E", goldWash: "#FBF3DF",
};
const FD = "'Space Grotesk', sans-serif";
const FB = "'Hanken Grotesk', system-ui, sans-serif";
const FM = "'IBM Plex Mono', monospace";

const PERSONAL_FEATURES = [
  "Understand Your Statement tool",
  "Convert to Excel / CSV",
  "Where your money went (spending breakdown)",
  "Hidden charge & deduction finder",
  "Fake-statement detector",
  "Ask your statement (AI answers)",
  "Up to 20 statements per month",
  "Email support",
];
const BUSINESS_FEATURES = [
  "Everything in Personal",
  "Analyze a Borrower tool",
  "6-month financial-health report",
  "Verified salary detection",
  "EMI, bounce & cash-deposit analysis",
  "Loan eligibility score",
  "Downloadable borrower reports",
  "Unlimited reports",
  "Priority support",
];
const FREE_FEATURES = [
  "3 statement pages per month",
  "Convert to Excel",
  "Basic spending summary",
  "No credit card required",
];
const FAQS = [
  { q: "Is my bank statement data safe?", a: "Yes. We process your statement to extract transactions and then delete the file immediately. We never store your bank statements on our servers. Your financial data stays private." },
  { q: "Which banks are supported?", a: "We currently support HDFC, SBI, ICICI, Axis, Kotak, PNB, Bank of Baroda, Yes Bank, IDFC First, and Canara Bank. We're adding more every month." },
  { q: "Can I cancel anytime?", a: "Yes — no lock-in, no questions asked. Cancel from your account settings and you won't be charged again." },
  { q: "What's the difference between Personal and Business?", a: "Personal is for individuals and accountants who want to understand their own statements. Business is for loan agents, DSAs, and CAs who need to analyse a borrower's 6 months of statements to assess creditworthiness." },
  { q: "Is the ₹49/report option available?", a: "Yes — the Business plan also offers a pay-per-report option at ₹49 per borrower report, with no monthly commitment. Ideal if you only need occasional reports." },
];

export default function PricingPage() {
  return (
    <div style={{ minHeight: "100vh", background: C.bg, fontFamily: FB }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Hanken+Grotesk:wght@400;500;600;700;800&family=IBM+Plex+Mono:wght@400;500;600&display=swap'); * { box-sizing: border-box; }`}</style>
      <Navbar active="Pricing" />

      {/* HERO */}
      <div style={{ maxWidth: 680, margin: "0 auto", padding: "60px 22px 40px", textAlign: "center" }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 7, background: C.card, border: `1px solid ${C.line}`, padding: "6px 14px", borderRadius: 99, marginBottom: 20 }}>
          <span style={{ fontFamily: FB, fontSize: 12.5, fontWeight: 700, color: C.inkSoft }}>Simple, honest pricing</span>
        </div>
        <h1 style={{ fontFamily: FD, fontWeight: 700, fontSize: 42, lineHeight: 1.1, letterSpacing: -1.1, margin: "0 0 16px", color: C.ink }}>Pay only for what<br />you actually use</h1>
        <p style={{ fontFamily: FB, fontSize: 16.5, color: C.inkSoft, lineHeight: 1.6, margin: 0 }}>Start free. Upgrade when you're ready. No hidden fees, no lock-in.</p>
      </div>

      {/* PRICING CARDS */}
      <div style={{ maxWidth: 960, margin: "0 auto", padding: "0 22px", display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 18 }}>
        {/* FREE */}
        <div style={{ background: C.card, border: `1px solid ${C.line}`, borderRadius: 20, padding: 28, boxShadow: "0 8px 30px rgba(0,0,0,0.04)" }}>
          <div style={{ fontFamily: FB, fontSize: 12, fontWeight: 700, color: C.inkFaint, textTransform: "uppercase", letterSpacing: 1 }}>Free</div>
          <div style={{ fontFamily: FD, fontWeight: 700, fontSize: 36, color: C.ink, margin: "12px 0 4px" }}>₹0</div>
          <div style={{ fontFamily: FB, fontSize: 13, color: C.inkFaint, marginBottom: 22 }}>Forever free, no card needed</div>
          <div style={{ borderTop: `1px solid ${C.lineSoft}`, paddingTop: 20, marginBottom: 22 }}>
            {FREE_FEATURES.map(f => (
              <div key={f} style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 12 }}>
                <Check size={15} color={C.emerald} style={{ flexShrink: 0, marginTop: 2 }} />
                <span style={{ fontFamily: FB, fontSize: 13.5, color: C.inkSoft }}>{f}</span>
              </div>
            ))}
          </div>
          <a href="/" style={{ display: "block", textAlign: "center", fontFamily: FB, fontSize: 14, fontWeight: 700, color: C.ink, background: C.bg2, border: `1px solid ${C.line}`, padding: "12px", borderRadius: 12, textDecoration: "none" }}>Get started free</a>
        </div>

        {/* PERSONAL */}
        <div style={{ background: C.card, border: `2px solid ${C.emerald}`, borderRadius: 20, padding: 28, boxShadow: `0 16px 48px ${C.emerald}22`, position: "relative" }}>
          <div style={{ position: "absolute", top: -13, left: "50%", transform: "translateX(-50%)", background: C.emerald, color: "#fff", fontFamily: FB, fontSize: 11.5, fontWeight: 700, padding: "4px 14px", borderRadius: 99 }}>MOST POPULAR</div>
          <div style={{ fontFamily: FB, fontSize: 12, fontWeight: 700, color: C.emerald, textTransform: "uppercase", letterSpacing: 1 }}>Personal</div>
          <div style={{ fontFamily: FD, fontWeight: 700, fontSize: 36, color: C.ink, margin: "12px 0 4px" }}>₹199<span style={{ fontSize: 16, color: C.inkFaint }}>/mo</span></div>
          <div style={{ fontFamily: FB, fontSize: 13, color: C.inkFaint, marginBottom: 22 }}>For individuals & accountants</div>
          <div style={{ borderTop: `1px solid ${C.lineSoft}`, paddingTop: 20, marginBottom: 22 }}>
            {PERSONAL_FEATURES.map(f => (
              <div key={f} style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 12 }}>
                <Check size={15} color={C.emerald} style={{ flexShrink: 0, marginTop: 2 }} />
                <span style={{ fontFamily: FB, fontSize: 13.5, color: C.inkSoft }}>{f}</span>
              </div>
            ))}
          </div>
          <a href="/" style={{ display: "block", textAlign: "center", fontFamily: FB, fontSize: 14, fontWeight: 700, color: "#fff", background: `linear-gradient(135deg, ${C.emeraldBright}, ${C.emerald})`, padding: "13px", borderRadius: 12, textDecoration: "none", boxShadow: `0 8px 20px ${C.emerald}33` }}>Start Personal plan</a>
        </div>

        {/* BUSINESS */}
        <div style={{ background: `linear-gradient(160deg, #1C2A1E, #111A12)`, border: `1px solid #2E402F`, borderRadius: 20, padding: 28, boxShadow: "0 16px 48px rgba(0,0,0,0.15)" }}>
          <div style={{ fontFamily: FB, fontSize: 12, fontWeight: 700, color: C.emeraldBright, textTransform: "uppercase", letterSpacing: 1 }}>Business</div>
          <div style={{ fontFamily: FD, fontWeight: 700, fontSize: 36, color: "#fff", margin: "12px 0 4px" }}>₹1,999<span style={{ fontSize: 16, color: "#9FB0A4" }}>/mo</span></div>
          <div style={{ fontFamily: FB, fontSize: 13, color: "#9FB0A4", marginBottom: 4 }}>or ₹49 per report, no commitment</div>
          <div style={{ fontFamily: FB, fontSize: 12.5, color: "#9FB0A4", marginBottom: 22 }}>For loan agents, DSAs & CAs</div>
          <div style={{ borderTop: "1px solid #2E402F", paddingTop: 20, marginBottom: 22 }}>
            {BUSINESS_FEATURES.map(f => (
              <div key={f} style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 12 }}>
                <Check size={15} color={C.emeraldBright} style={{ flexShrink: 0, marginTop: 2 }} />
                <span style={{ fontFamily: FB, fontSize: 13.5, color: "#C8D9CA" }}>{f}</span>
              </div>
            ))}
          </div>
          <a href="/" style={{ display: "block", textAlign: "center", fontFamily: FB, fontSize: 14, fontWeight: 700, color: C.emeraldDeep, background: C.emeraldBright, padding: "13px", borderRadius: 12, textDecoration: "none" }}>Start Business plan</a>
        </div>
      </div>

      {/* FAQ */}
      <div style={{ maxWidth: 680, margin: "60px auto 0", padding: "0 22px" }}>
        <h2 style={{ fontFamily: FD, fontWeight: 700, fontSize: 28, textAlign: "center", letterSpacing: -0.6, marginBottom: 32 }}>Frequently asked questions</h2>
        {FAQS.map((faq, i) => (
          <div key={i} style={{ background: C.card, border: `1px solid ${C.line}`, borderRadius: 14, padding: "20px 22px", marginBottom: 12, boxShadow: "0 4px 16px rgba(0,0,0,0.03)" }}>
            <div style={{ fontFamily: FD, fontWeight: 600, fontSize: 15.5, marginBottom: 8, color: C.ink }}>{faq.q}</div>
            <div style={{ fontFamily: FB, fontSize: 14, color: C.inkSoft, lineHeight: 1.6 }}>{faq.a}</div>
          </div>
        ))}
      </div>

      {/* BOTTOM CTA */}
      <div style={{ maxWidth: 680, margin: "50px auto 0", padding: "0 22px 70px", textAlign: "center" }}>
        <div style={{ background: C.emeraldWash, border: `1px solid ${C.emerald}22`, borderRadius: 20, padding: "36px 28px" }}>
          <div style={{ fontFamily: FD, fontWeight: 700, fontSize: 24, color: C.ink, marginBottom: 10 }}>Start for free today</div>
          <div style={{ fontFamily: FB, fontSize: 15, color: C.inkSoft, marginBottom: 22 }}>No credit card required. Upgrade anytime.</div>
          <a href="/" style={{ display: "inline-block", fontFamily: FB, fontSize: 14, fontWeight: 700, color: "#fff", background: `linear-gradient(135deg, ${C.emeraldBright}, ${C.emerald})`, padding: "13px 28px", borderRadius: 12, textDecoration: "none", boxShadow: `0 8px 20px ${C.emerald}33` }}>Try Sheetly free →</a>
        </div>
      </div>

      <Footer />
    </div>
  );
}