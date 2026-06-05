"use client";
import Link from 'next/link';
import { FileSpreadsheet } from 'lucide-react';

const C = {
  bg: "#FAF9F4", card: "#FFFFFF", ink: "#191C19", inkSoft: "#565B55",
  line: "#E8E6DC", emerald: "#0E8F6B", emeraldBright: "#15B589",
  emeraldDeep: "#0A6E53", emeraldWash: "#E7F4EF",
};
const FD = "'Space Grotesk', sans-serif";
const FB = "'Hanken Grotesk', system-ui, sans-serif";

export default function Navbar({ active }) {
  const links = [
    { href: '/', label: 'Home' },
    { href: '/pricing', label: 'Pricing' },
    { href: '/about', label: 'About' },
  ];
  return (
    <nav style={{ borderBottom: `1px solid ${C.line}`, background: "rgba(250,249,244,0.85)", backdropFilter: "blur(10px)", position: "sticky", top: 0, zIndex: 20 }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Hanken+Grotesk:wght@400;500;600;700;800&display=swap'); * { box-sizing: border-box; }`}</style>
      <div style={{ maxWidth: 1000, margin: "0 auto", padding: "15px 22px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Link href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: `linear-gradient(135deg, ${C.emeraldBright}, ${C.emerald})`, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 6px 16px ${C.emerald}33` }}>
            <FileSpreadsheet size={20} color="#fff" />
          </div>
          <span style={{ fontFamily: FD, fontWeight: 700, fontSize: 19, letterSpacing: -0.3, color: C.ink }}>Sheetly</span>
        </Link>
        <div style={{ display: "flex", alignItems: "center", gap: 22 }}>
          {links.map(l => (
            <Link key={l.href} href={l.href} style={{ fontFamily: FB, fontSize: 14, fontWeight: 600, color: active === l.label ? C.emerald : C.inkSoft, textDecoration: "none" }}>{l.label}</Link>
          ))}
          <Link href="/" style={{ fontFamily: FB, fontSize: 13.5, fontWeight: 700, color: "#fff", background: `linear-gradient(135deg, ${C.emeraldBright}, ${C.emerald})`, padding: "9px 18px", borderRadius: 10, textDecoration: "none", boxShadow: `0 6px 16px ${C.emerald}33` }}>Get Started</Link>
        </div>
      </div>
    </nav>
  );
}