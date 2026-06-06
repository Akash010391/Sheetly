"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { FileSpreadsheet, LogOut, ChevronDown } from "lucide-react";
import { supabase } from "../lib/supabase";

const C = {
  bg: "#FAF9F4", card: "#FFFFFF", ink: "#191C19", inkSoft: "#565B55",
  line: "#E8E6DC", emerald: "#0E8F6B", emeraldBright: "#15B589",
  emeraldDeep: "#0A6E53", emeraldWash: "#E7F4EF",
};
const FD = "'Space Grotesk', sans-serif";
const FB = "'Hanken Grotesk', system-ui, sans-serif";

export default function Navbar({ active }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => setUser(session?.user ?? null));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => setUser(session?.user ?? null));
    return () => subscription.unsubscribe();
  }, []);

  async function logout() {
    await supabase.auth.signOut();
    setUser(null);
    window.location.href = "/";
  }

  const initials = user?.user_metadata?.full_name
    ? user.user_metadata.full_name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()
    : user?.email?.slice(0, 2).toUpperCase();

  return (
    <nav style={{ borderBottom: `1px solid ${C.line}`, background: "rgba(250,249,244,0.85)", backdropFilter: "blur(10px)", position: "sticky", top: 0, zIndex: 20 }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Hanken+Grotesk:wght@400;500;600;700;800&display=swap'); * { box-sizing: border-box; }`}</style>
      <div style={{ maxWidth: 1000, margin: "0 auto", padding: "14px 22px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        {/* LOGO */}
        <Link href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: `linear-gradient(135deg, ${C.emeraldBright}, ${C.emerald})`, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 6px 16px ${C.emerald}33` }}>
            <FileSpreadsheet size={20} color="#fff" />
          </div>
          <span style={{ fontFamily: FD, fontWeight: 700, fontSize: 19, letterSpacing: -0.3, color: C.ink }}>Sheetly</span>
        </Link>

        {/* RIGHT SIDE */}
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <Link href="/pricing" style={{ fontFamily: FB, fontSize: 14, fontWeight: 600, color: active === "Pricing" ? C.emerald : C.inkSoft, textDecoration: "none" }}>Pricing</Link>
          <Link href="/about" style={{ fontFamily: FB, fontSize: 14, fontWeight: 600, color: active === "About" ? C.emerald : C.inkSoft, textDecoration: "none" }}>About</Link>

          {user ? (
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, background: C.emeraldWash, padding: "7px 12px", borderRadius: 99 }}>
                <div style={{ width: 26, height: 26, borderRadius: 99, background: C.emerald, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FD, fontSize: 11, fontWeight: 700, color: "#fff" }}>{initials}</div>
                <span style={{ fontFamily: FB, fontSize: 13, fontWeight: 600, color: C.emeraldDeep, maxWidth: 130, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{user.user_metadata?.full_name || user.email}</span>
              </div>
              <button onClick={logout} style={{ display: "flex", alignItems: "center", gap: 6, fontFamily: FB, fontSize: 13, fontWeight: 600, color: C.inkSoft, background: "none", border: `1px solid ${C.line}`, borderRadius: 99, padding: "7px 12px", cursor: "pointer" }}>
                <LogOut size={13} /> Log out
              </button>
            </div>
          ) : (
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <Link href="/login" style={{ fontFamily: FB, fontSize: 14, fontWeight: 600, color: C.inkSoft, textDecoration: "none" }}>Log in</Link>
              <Link href="/login" style={{ fontFamily: FB, fontSize: 13.5, fontWeight: 700, color: "#fff", background: `linear-gradient(135deg, ${C.emeraldBright}, ${C.emerald})`, padding: "9px 18px", borderRadius: 10, textDecoration: "none", boxShadow: `0 6px 16px ${C.emerald}33` }}>Get Started</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}