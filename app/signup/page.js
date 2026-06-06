"use client";
import { useState } from 'react';
import Link from 'next/link';
import { supabase } from '../lib/supabase';
import { FileSpreadsheet, Mail, Lock, User, Eye, EyeOff, Loader2, CheckCircle2 } from 'lucide-react';

const C = {
  bg: "#FAF9F4", bg2: "#F2F1EA", card: "#FFFFFF", ink: "#191C19",
  inkSoft: "#565B55", inkFaint: "#969B92", line: "#E8E6DC",
  emerald: "#0E8F6B", emeraldBright: "#15B589", emeraldDeep: "#0A6E53",
  emeraldWash: "#E7F4EF", rose: "#C25548", roseWash: "#FBEDEB",
};
const FD = "'Space Grotesk', sans-serif";
const FB = "'Hanken Grotesk', system-ui, sans-serif";

export default function SignupPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  async function handleSignup(e) {
    e.preventDefault();
    if (!email || !password) { setError('Please fill in all fields.'); return; }
    if (password.length < 6) { setError('Password must be at least 6 characters.'); return; }
    setLoading(true); setError('');
    const { error: err } = await supabase.auth.signUp({
      email, password,
      options: { data: { full_name: name } }
    });
    setLoading(false);
    if (err) setError(err.message);
    else setSuccess(true);
  }

  async function handleGoogle() {
    setGoogleLoading(true); setError('');
    const { error: err } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/` }
    });
    if (err) { setError(err.message); setGoogleLoading(false); }
  }

  if (success) return (
    <div style={{ minHeight: "100vh", background: C.bg, display: "flex", alignItems: "center", justifyContent: "center", padding: 24, fontFamily: FB }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Hanken+Grotesk:wght@400;500;600;700;800&display=swap'); * { box-sizing: border-box; }`}</style>
      <div style={{ width: "100%", maxWidth: 420, background: C.card, border: `1px solid ${C.line}`, borderRadius: 22, padding: "40px 32px", textAlign: "center", boxShadow: "0 20px 60px rgba(0,0,0,0.07)" }}>
        <CheckCircle2 size={48} color={C.emerald} style={{ marginBottom: 16 }} />
        <h2 style={{ fontFamily: FD, fontWeight: 700, fontSize: 24, margin: "0 0 10px", color: C.ink }}>Check your email</h2>
        <p style={{ fontFamily: FB, fontSize: 15, color: C.inkSoft, lineHeight: 1.6, margin: "0 0 24px" }}>We've sent a confirmation link to <strong>{email}</strong>. Click it to activate your account.</p>
        <Link href="/login" style={{ display: "inline-block", fontFamily: FB, fontSize: 14.5, fontWeight: 700, color: "#fff", background: `linear-gradient(135deg, ${C.emeraldBright}, ${C.emerald})`, padding: "12px 28px", borderRadius: 12, textDecoration: "none" }}>Go to login →</Link>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", background: C.bg, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "24px 16px", fontFamily: FB }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Hanken+Grotesk:wght@400;500;600;700;800&display=swap'); * { box-sizing: border-box; } input:focus { outline: none; } @keyframes spin { to { transform: rotate(360deg) } }`}</style>

      <Link href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 10, marginBottom: 32 }}>
        <div style={{ width: 40, height: 40, borderRadius: 11, background: `linear-gradient(135deg, ${C.emeraldBright}, ${C.emerald})`, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 6px 16px ${C.emerald}33` }}>
          <FileSpreadsheet size={22} color="#fff" />
        </div>
        <span style={{ fontFamily: FD, fontWeight: 700, fontSize: 22, letterSpacing: -0.4, color: C.ink }}>Sheetly</span>
      </Link>

      <div style={{ width: "100%", maxWidth: 420, background: C.card, border: `1px solid ${C.line}`, borderRadius: 22, padding: "36px 32px", boxShadow: "0 20px 60px rgba(0,0,0,0.07)" }}>
        <h1 style={{ fontFamily: FD, fontWeight: 700, fontSize: 26, letterSpacing: -0.6, margin: "0 0 6px", color: C.ink }}>Create your account</h1>
        <p style={{ fontFamily: FB, fontSize: 14.5, color: C.inkSoft, margin: "0 0 28px" }}>Free to start — no credit card needed</p>

        <button onClick={handleGoogle} disabled={googleLoading} style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 10, background: C.card, border: `1.5px solid ${C.line}`, borderRadius: 12, padding: "12px 16px", cursor: "pointer", fontFamily: FB, fontSize: 14.5, fontWeight: 600, color: C.ink, marginBottom: 20 }}>
          {googleLoading ? <Loader2 size={18} style={{ animation: "spin 1s linear infinite" }} /> : (
            <svg width="18" height="18" viewBox="0 0 18 18"><path fill="#4285F4" d="M16.51 8H8.98v3h4.3c-.18 1-.74 1.48-1.6 2.04v2.01h2.6a7.8 7.8 0 0 0 2.38-5.88c0-.57-.05-.66-.15-1.18z"/><path fill="#34A853" d="M8.98 17c2.16 0 3.97-.72 5.3-1.94l-2.6-2a4.8 4.8 0 0 1-7.18-2.54H1.83v2.07A8 8 0 0 0 8.98 17z"/><path fill="#FBBC05" d="M4.5 10.52a4.8 4.8 0 0 1 0-3.04V5.41H1.83a8 8 0 0 0 0 7.18l2.67-2.07z"/><path fill="#EA4335" d="M8.98 4.18c1.17 0 2.23.4 3.06 1.2l2.3-2.3A8 8 0 0 0 1.83 5.4L4.5 7.48a4.77 4.77 0 0 1 4.48-3.3z"/></svg>
          )}
          Continue with Google
        </button>

        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
          <div style={{ flex: 1, height: 1, background: C.line }} />
          <span style={{ fontFamily: FB, fontSize: 12, color: C.inkFaint, fontWeight: 600 }}>or sign up with email</span>
          <div style={{ flex: 1, height: 1, background: C.line }} />
        </div>

        <form onSubmit={handleSignup}>
          <div style={{ marginBottom: 14 }}>
            <label style={{ fontFamily: FB, fontSize: 13, fontWeight: 700, color: C.inkSoft, display: "block", marginBottom: 6 }}>Your name</label>
            <div style={{ position: "relative" }}>
              <User size={16} color={C.inkFaint} style={{ position: "absolute", left: 13, top: "50%", transform: "translateY(-50%)" }} />
              <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Rahul Sharma"
                style={{ width: "100%", fontFamily: FB, fontSize: 14.5, background: C.bg, border: `1.5px solid ${C.line}`, borderRadius: 11, padding: "12px 13px 12px 38px", color: C.ink }} />
            </div>
          </div>

          <div style={{ marginBottom: 14 }}>
            <label style={{ fontFamily: FB, fontSize: 13, fontWeight: 700, color: C.inkSoft, display: "block", marginBottom: 6 }}>Email</label>
            <div style={{ position: "relative" }}>
              <Mail size={16} color={C.inkFaint} style={{ position: "absolute", left: 13, top: "50%", transform: "translateY(-50%)" }} />
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com"
                style={{ width: "100%", fontFamily: FB, fontSize: 14.5, background: C.bg, border: `1.5px solid ${C.line}`, borderRadius: 11, padding: "12px 13px 12px 38px", color: C.ink }} />
            </div>
          </div>

          <div style={{ marginBottom: 22 }}>
            <label style={{ fontFamily: FB, fontSize: 13, fontWeight: 700, color: C.inkSoft, display: "block", marginBottom: 6 }}>Password</label>
            <div style={{ position: "relative" }}>
              <Lock size={16} color={C.inkFaint} style={{ position: "absolute", left: 13, top: "50%", transform: "translateY(-50%)" }} />
              <input type={showPass ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)} placeholder="Min. 6 characters"
                style={{ width: "100%", fontFamily: FB, fontSize: 14.5, background: C.bg, border: `1.5px solid ${C.line}`, borderRadius: 11, padding: "12px 40px 12px 38px", color: C.ink }} />
              <button type="button" onClick={() => setShowPass(!showPass)} style={{ position: "absolute", right: 13, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", padding: 0 }}>
                {showPass ? <EyeOff size={16} color={C.inkFaint} /> : <Eye size={16} color={C.inkFaint} />}
              </button>
            </div>
          </div>

          {error && <div style={{ background: C.roseWash, border: `1px solid ${C.rose}33`, borderRadius: 10, padding: "10px 14px", fontFamily: FB, fontSize: 13.5, color: C.rose, fontWeight: 600, marginBottom: 16 }}>{error}</div>}

          <button type="submit" disabled={loading} style={{ width: "100%", fontFamily: FB, fontSize: 15, fontWeight: 700, color: "#fff", background: `linear-gradient(135deg, ${C.emeraldBright}, ${C.emerald})`, border: "none", borderRadius: 12, padding: "13px", cursor: loading ? "default" : "pointer", opacity: loading ? 0.7 : 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, boxShadow: `0 8px 20px ${C.emerald}33` }}>
            {loading ? <><Loader2 size={17} style={{ animation: "spin 1s linear infinite" }} /> Creating account…</> : "Create free account →"}
          </button>
        </form>

        <p style={{ textAlign: "center", fontFamily: FB, fontSize: 13, color: C.inkFaint, marginTop: 16, lineHeight: 1.5 }}>
          By signing up you agree to our{" "}
          <Link href="/terms" style={{ color: C.emerald, textDecoration: "none", fontWeight: 600 }}>Terms</Link>{" "}and{" "}
          <Link href="/privacy" style={{ color: C.emerald, textDecoration: "none", fontWeight: 600 }}>Privacy Policy</Link>
        </p>

        <p style={{ textAlign: "center", fontFamily: FB, fontSize: 14, color: C.inkSoft, marginTop: 16 }}>
          Already have an account?{" "}
          <Link href="/login" style={{ color: C.emerald, fontWeight: 700, textDecoration: "none" }}>Sign in</Link>
        </p>
      </div>
    </div>
  );
}