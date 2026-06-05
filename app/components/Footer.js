import Link from 'next/link';

const C = {
  bg2: "#F2F1EA", ink: "#191C19", inkSoft: "#565B55", inkFaint: "#969B92",
  line: "#E8E6DC", emerald: "#0E8F6B", emeraldWash: "#E7F4EF",
};
const FB = "'Hanken Grotesk', system-ui, sans-serif";
const FD = "'Space Grotesk', sans-serif";

export default function Footer() {
  return (
    <footer style={{ background: C.bg2, borderTop: `1px solid ${C.line}`, padding: "40px 22px" }}>
      <div style={{ maxWidth: 1000, margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 30 }}>
          <div>
            <div style={{ fontFamily: FD, fontWeight: 700, fontSize: 18, color: C.ink, letterSpacing: -0.3 }}>Sheetly</div>
            <div style={{ fontFamily: FB, fontSize: 13, color: C.inkSoft, marginTop: 6, maxWidth: 240, lineHeight: 1.5 }}>Bank statement intelligence — for everyone who wants to understand their money.</div>
          </div>
          <div style={{ display: "flex", gap: 40, flexWrap: "wrap" }}>
            <div>
              <div style={{ fontFamily: FB, fontSize: 11.5, fontWeight: 700, color: C.inkFaint, textTransform: "uppercase", letterSpacing: 1, marginBottom: 12 }}>Product</div>
              {[['/', 'Home'], ['/pricing', 'Pricing'], ['/about', 'About']].map(([href, label]) => (
                <div key={href} style={{ marginBottom: 8 }}>
                  <Link href={href} style={{ fontFamily: FB, fontSize: 13.5, color: C.inkSoft, textDecoration: "none", fontWeight: 500 }}>{label}</Link>
                </div>
              ))}
            </div>
            <div>
              <div style={{ fontFamily: FB, fontSize: 11.5, fontWeight: 700, color: C.inkFaint, textTransform: "uppercase", letterSpacing: 1, marginBottom: 12 }}>Legal</div>
              {[['/privacy', 'Privacy Policy'], ['/terms', 'Terms of Service']].map(([href, label]) => (
                <div key={href} style={{ marginBottom: 8 }}>
                  <Link href={href} style={{ fontFamily: FB, fontSize: 13.5, color: C.inkSoft, textDecoration: "none", fontWeight: 500 }}>{label}</Link>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div style={{ borderTop: `1px solid ${C.line}`, marginTop: 30, paddingTop: 20, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10 }}>
          <span style={{ fontFamily: FB, fontSize: 12.5, color: C.inkFaint }}>© 2025 Sheetly. All rights reserved.</span>
          <span style={{ fontFamily: FB, fontSize: 12.5, color: C.inkFaint }}>Made in Guwahati, Assam 🇮🇳</span>
        </div>
      </div>
    </footer>
  );
}