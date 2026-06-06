"use client";
import { useState } from "react";
import { supabase } from "../lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FileSpreadsheet, Mail, Lock, User, Eye, EyeOff, ArrowLeft } from "lucide-react";

const C = {
  bg: "#FAF9F4", bg2: "#F2F1EA", card: "#FFFFFF", ink: "#191C19",
  inkSoft: "#565B55", inkFaint: "#969B92", line: "#E8E6DC",
  emerald: "#0E8F6B", emeraldBright: "#15B589", emeraldDeep: "#0A6E53",
  emeraldWash: "#E7F4EF", rose: "#C25548", roseWash: "#FBEDEB",
};
const FD = "'Space Grotesk', sans-serif";
const FB = "'Hanken Grotesk', system-ui, sans-serif";

function Field({ icon: Icon, placeholder, value, onChange, type = "text" }) {
  const [show, setShow] = useState(false);
  const isPassword = type === "password";
  return (
    <div style={{ position: "relative", marginBottom: 14 }}>
      <Icon size={16} color={C.inkFaint} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)" }} />
      <input
        type={isPassword && show ? "text" : type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        style={{ width: "100%", fontFamily: FB, fontSize: 15, color: C.ink, background: C.bg, border: `1.5px solid ${C.line}`, borderRadius: 12, padding: "13px 44px 13px 42px", outline: "none" }}
      />
      {isPassword && (
        <button onClick={() => setShow(!show)} style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", padding: 0 }}>
          {show ? <EyeOff size={16} color={C.inkFaint} /> : <Eye size={16} color={C.inkFaint} />}
        </button>
      )}
    </div>
  );
}

export default function LoginPage() {
  const [mode, setMode] = useState("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();

  async function handleSubmit() {
    if (!email || !password) { setError("Please enter your email and password."); return; }
    if (mode === "signup" && !name) { setError("Please enter your name."); return; }
    if (password.length < 6) { setError("Password must be at least 6 characters."); return; }
    setLoading(true); setError(""); setSuccess("");
    if (mode === "login") {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setError(error.message);
      else router.push("/");
    } else {
      const { error } = await supabase.auth.signUp({ email, password, options: { data: { full_name: name } } });
      if (error) setError(error.message);
      else setSuccess("Account created! Please check your email to confirm, then log in.");
    }
    setLoading(false);
  }

  async function handleGoogle() {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/` },
    });
    if (error) setError(error.message);
  }

  return (
    <div style={{ minHeight: "100vh", background: C.bg, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "30px 22px", fontFamily: FB }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Hanken+Grotesk:wght@400;500;600;700;800&display=swap'); * { box-sizing: border-box; } input:focus { outline: none; border-color: #0E8F6B !important; }`}</style>

      <div style={{ width: "100%", maxWidth: 420 }}>
        {/* LOGO */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <Link href="/" style={{ display: "inline-flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
            <div style={{ width: 42, height: 42, borderRadius: 12, background: `linear-gradient(135deg, ${C.emeraldBright}, ${C.emerald})`, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 8px 20px ${C.emerald}33` }}>
              <FileSpreadsheet size={22} color="#fff" />
            </div>
            <span style={{ fontFamily: FD, fontWeight: 700, fontSize: 22, color: C.ink, letterSpacing: -0.4 }}>Sheetly</span>
          </Link>
        </div>

        {/* CARD */}
        <div style={{ background: C.card, border: `1px solid ${C.line}`, borderRadius: 22, padding: "30px 28px", boxShadow: "0 16px 50px rgba(0,0,0,0.07)" }}>
          {/* TABS */}
          <div style={{ display: "flex", background: C.bg2, borderRadius: 12, padding: 4, marginBottom: 26 }}>
            {["login", "signup"].map(m => (
              <button key={m} onClick={() => { setMode(m); setError(""); setSuccess(""); }} style={{ flex: 1, fontFamily: FB, fontSize: 14, fontWeight: 700, padding: "10px", borderRadius: 9, border: "none", cursor: "pointer", background: mode === m ? C.card : "transparent", color: mode === m ? C.ink : C.inkFaint, boxShadow: mode === m ? "0 2px 8px rgba(0,0,0,0.07)" : "none" }}>
                {m === "login" ? "Log in" : "Sign up"}
              </button>
            ))}
          </div>

          <h2 style={{ fontFamily: FD, fontWeight: 700, fontSize: 22, margin: "0 0 6px", color: C.ink }}>
            {mode === "login" ? "Welcome back" : "Create your account"}
          </h2>
          <p style={{ fontFamily: FB, fontSize: 14, color: C.inkSoft, margin: "0 0 22px" }}>
            {mode === "login" ? "Log in to access your Sheetly tools." : "Free to start — no credit card needed."}
          </p>

          {/* GOOGLE BUTTON */}
          <button onClick={handleGoogle} style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 10, fontFamily: FB, fontSize: 14.5, fontWeight: 600, color: C.ink, background: C.card, border: `1.5px solid ${C.line}`, borderRadius: 12, padding: "12px", cursor: "pointer", marginBottom: 18, boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
            <svg width="18" height="18" viewBox="0 0 48 48"><path fill="#FFC107" d="M43.6 20H24v8h11.3C33.7 32.8 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.8 1.1 7.9 3l5.7-5.7C34.1 6.5 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20c11 0 19.7-8 19.7-20 0-1.3-.1-2.7-.1-4z" /><path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.5 16 19 12 24 12c3 0 5.8 1.1 7.9 3l5.7-5.7C34.1 6.5 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" /><path fill="#4CAF50" d="M24 44c5.2 0 9.9-1.8 13.5-4.8l-6.3-5.2C29.3 35.7 26.8 36.5 24 36.5c-5.2 0-9.7-3.2-11.4-7.7l-6.5 5C9.5 39.5 16.3 44 24 44z" /><path fill="#1976D2" d="M43.6 20H24v8h11.3c-.8 2.2-2.3 4.1-4.2 5.5l6.3 5.2C41.4 35.5 44 30.1 44 24c0-1.3-.1-2.7-.4-4z" /></svg>
            Continue with Google
          </button>

          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 18 }}>
            <div style={{ flex: 1, height: 1, background: C.line }} />
            <span style={{ fontFamily: FB, fontSize: 12, color: C.inkFaint, fontWeight: 600 }}>or</span>
            <div style={{ flex: 1, height: 1, background: C.line }} />
          </div>

          {/* FORM */}
          {mode === "signup" && <Field icon={User} placeholder="Your full name" value={name} onChange={e => setName(e.target.value)} />}
          <Field icon={Mail} placeholder="Email address" value={email} onChange={e => setEmail(e.target.value)} type="email" />
          <Field icon={Lock} placeholder="Password (min 6 characters)" value={password} onChange={e => setPassword(e.target.value)} type="password" />

          {error && <div style={{ background: C.roseWash, border: `1px solid ${C.rose}33`, borderRadius: 10, padding: "11px 14px", fontFamily: FB, fontSize: 13.5, color: C.rose, marginBottom: 14 }}>{error}</div>}
          {success && <div style={{ background: C.emeraldWash, border: `1px solid ${C.emerald}33`, borderRadius: 10, padding: "11px 14px", fontFamily: FB, fontSize: 13.5, color: C.emeraldDeep, marginBottom: 14 }}>{success}</div>}

          <button onClick={handleSubmit} disabled={loading} style={{ width: "100%", fontFamily: FB, fontSize: 15, fontWeight: 700, color: "#fff", background: loading ? C.emerald + "99" : `linear-gradient(135deg, ${C.emeraldBright}, ${C.emerald})`, border: "none", borderRadius: 12, padding: "14px", cursor: loading ? "default" : "pointer", boxShadow: `0 10px 24px ${C.emerald}33` }}>
            {loading ? "Please wait…" : mode === "login" ? "Log in →" : "Create account →"}
          </button>
        </div>

        <div style={{ textAlign: "center", marginTop: 18 }}>
          <Link href="/" style={{ fontFamily: FB, fontSize: 13.5, color: C.inkSoft, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 5 }}><ArrowLeft size={14} /> Back to home</Link>
        </div>
      </div>
    </div>
  );
}