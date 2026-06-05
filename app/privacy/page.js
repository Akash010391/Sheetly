import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const C = {
  bg: "#FAF9F4", bg2: "#F2F1EA", card: "#FFFFFF", ink: "#191C19",
  inkSoft: "#565B55", inkFaint: "#969B92", line: "#E8E6DC",
  emerald: "#0E8F6B", emeraldWash: "#E7F4EF",
};
const FD = "'Space Grotesk', sans-serif";
const FB = "'Hanken Grotesk', system-ui, sans-serif";

const SECTIONS = [
  {
    title: "1. The short version",
    body: `We take your privacy seriously. Your bank statement is uploaded to extract transaction data and then deleted immediately. We never store your bank statements on our servers. We never sell your data to anyone. Ever.`,
  },
  {
    title: "2. What data we collect",
    body: `When you use Sheetly, we collect:
• Your email address (when you create an account)
• Your name (optional, for your account)
• Usage data — which tools you use and how often (to improve the product)
• Payment information — handled entirely by Razorpay. We never see or store your card or bank details.

What we do NOT collect or store:
• Your bank statements (deleted immediately after processing)
• Your transaction history
• Your account numbers or financial account details`,
  },
  {
    title: "3. How your bank statement is processed",
    body: `When you upload a bank statement PDF:
1. It is sent securely (HTTPS/TLS encrypted) to our server.
2. We extract the transaction data from it using AI.
3. The extracted data is returned to your browser.
4. The original PDF is deleted from our server immediately.

We do not store, analyse, or retain your bank statement for any purpose beyond the immediate extraction. The file exists on our server for seconds, not minutes.`,
  },
  {
    title: "4. How we use your data",
    body: `We use your data only to:
• Provide the Sheetly service to you
• Send you account-related emails (receipts, password resets)
• Improve the product based on usage patterns (anonymised)

We do not use your data for advertising, profiling, or any purpose you haven't consented to.`,
  },
  {
    title: "5. Data security",
    body: `All data is transmitted over HTTPS. Passwords are hashed and never stored in plain text. Payment processing is handled by Razorpay, which is PCI-DSS compliant. We apply industry-standard security practices throughout.

Despite our best efforts, no system is 100% secure. If you believe your account has been compromised, contact us immediately at hello@sheetly.in.`,
  },
  {
    title: "6. Cookies",
    body: `We use minimal cookies — only what's needed to keep you logged in and remember your preferences. We do not use advertising cookies or third-party tracking.`,
  },
  {
    title: "7. Third-party services",
    body: `We use the following third-party services:
• Supabase — for authentication and account data storage
• Razorpay — for payment processing
• Vercel — for hosting
• Anthropic Claude — for AI-powered extraction (your statement text is processed but not retained by Anthropic for training without consent)

Each of these services has their own privacy policy.`,
  },
  {
    title: "8. Your rights",
    body: `You have the right to:
• Access the data we hold about you
• Correct inaccurate data
• Delete your account and all associated data
• Export your data

To exercise any of these rights, email us at hello@sheetly.in.`,
  },
  {
    title: "9. Contact",
    body: `For any privacy-related questions or concerns:
Email: hello@sheetly.in
We aim to respond within 48 hours.`,
  },
];

export default function PrivacyPage() {
  return (
    <div style={{ minHeight: "100vh", background: C.bg, fontFamily: FB }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Hanken+Grotesk:wght@400;500;600;700;800&display=swap'); * { box-sizing: border-box; }`}</style>
      <Navbar />

      <div style={{ maxWidth: 720, margin: "0 auto", padding: "60px 22px 80px" }}>
        <div style={{ marginBottom: 40 }}>
          <h1 style={{ fontFamily: FD, fontWeight: 700, fontSize: 38, letterSpacing: -0.9, margin: "0 0 12px", color: C.ink }}>Privacy Policy</h1>
          <div style={{ fontFamily: FB, fontSize: 13.5, color: C.inkFaint }}>Last updated: June 2025</div>
          <div style={{ marginTop: 16, background: C.emeraldWash, border: `1px solid ${C.emerald}33`, borderRadius: 12, padding: "14px 18px" }}>
            <div style={{ fontFamily: FB, fontSize: 14.5, color: "#0A6E53", fontWeight: 600, lineHeight: 1.55 }}>🔒 The most important thing: we never store your bank statements. Your PDF is deleted from our servers immediately after processing. We will never sell your data.</div>
          </div>
        </div>

        {SECTIONS.map((s, i) => (
          <div key={i} style={{ marginBottom: 36 }}>
            <h2 style={{ fontFamily: FD, fontWeight: 600, fontSize: 18, color: C.ink, marginBottom: 10 }}>{s.title}</h2>
            <div style={{ fontFamily: FB, fontSize: 14.5, color: C.inkSoft, lineHeight: 1.75, whiteSpace: "pre-line" }}>{s.body}</div>
          </div>
        ))}
      </div>

      <Footer />
    </div>
  );
}