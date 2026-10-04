import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { KeyRound, Mail, Loader2 } from "lucide-react";
import AuthLayout from "@/components/AuthLayout";
import { useI18n } from "@/lib/i18n";

// Session flag set once the admin completes email verification this session.
export const ADMIN_2FA_FLAG = "admin_2fa_ok";

export default function AdminVerify() {
  const { lang } = useI18n();
  const he = lang === "he";
  // loading | needsEmail | enterCode
  const [phase, setPhase] = useState("loading");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [masked, setMasked] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const ok = await base44.auth.isAuthenticated();
        if (!ok) { window.location.href = "/admin/login"; return; }
        const me = await base44.auth.me();
        if (!me || me.role !== "admin") { window.location.href = "/admin/login"; return; }
        setEmail(me.email || "");
        const res = await base44.functions.invoke("admin2fa", { action: "send" });
        if (!active) return;
        if (res.data?.needsEmail) {
          setPhase("needsEmail");
        } else {
          setMasked(res.data?.maskedEmail || "");
          setPhase("enterCode");
        }
      } catch (e) {
        if (!active) return;
        setError(e.message || "Error");
        setPhase("needsEmail");
      }
    })();
    return () => { active = false; };
  }, []);

  const registerAndSend = async (e) => {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      const res = await base44.functions.invoke("admin2fa", { action: "register", email: email.trim().toLowerCase() });
      if (res.data?.sent) {
        setMasked(res.data.maskedEmail || "");
        setCode("");
        setPhase("enterCode");
      } else {
        setError(res.data?.error || (he ? "שגיאה" : "Error"));
      }
    } catch (err) {
      setError(err.message || (he ? "שגיאה" : "Error"));
    } finally {
      setBusy(false);
    }
  };

  const resend = async () => {
    setError("");
    setBusy(true);
    try {
      const res = await base44.functions.invoke("admin2fa", { action: "send" });
      if (res.data?.needsEmail) {
        setPhase("needsEmail");
      } else if (res.data?.sent) {
        setMasked(res.data.maskedEmail || masked);
        setCode("");
      }
    } catch (err) {
      setError(err.message || (he ? "שגיאה" : "Error"));
    } finally {
      setBusy(false);
    }
  };

  const verify = async (e) => {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      const res = await base44.functions.invoke("admin2fa", { action: "verify", code: code.trim() });
      if (res.data?.verified) {
        sessionStorage.setItem(ADMIN_2FA_FLAG, "1");
        window.location.href = "/admin";
      } else {
        setError(he ? "קוד שגוי או שפג תוקפו" : "Invalid or expired code");
      }
    } catch (err) {
      setError(err.message || (he ? "שגיאה" : "Error"));
    } finally {
      setBusy(false);
    }
  };

  if (phase === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-7 h-7 text-muted-foreground animate-spin" />
      </div>
    );
  }

  return (
    <AuthLayout
      icon={KeyRound}
      title={he ? "אימות דו-שלבי" : "Two-step verification"}
      subtitle={he ? "הזנת קוד אימות שנשלח לאימייל שלך" : "Enter the code sent to your email"}
    >
      {phase === "needsEmail" ? (
        <form onSubmit={registerAndSend} className="space-y-4">
          <p className="text-sm text-muted-foreground">
            {he
              ? "כניסה ראשונה: נא להזין את כתובת האימייל שאליה יישלח קוד אימות בכל כניסה."
              : "First sign-in: enter the email where verification codes will be sent on each login."}
          </p>
          {error && <div className="mb-1 p-3 rounded-lg bg-destructive/10 text-destructive text-sm">{error}</div>}
          <div className="space-y-2">
            <Label htmlFor="vemail">{he ? "אימייל לאימות" : "Verification email"}</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" aria-hidden="true" />
              <Input id="vemail" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="pl-10 h-12" required />
            </div>
          </div>
          <Button type="submit" className="w-full h-12 font-medium" disabled={busy}>
            {busy ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : (he ? "שלח קוד" : "Send code")}
          </Button>
        </form>
      ) : (
        <form onSubmit={verify} className="space-y-4">
          <p className="text-sm text-muted-foreground">
            {he ? `קוד בן 6 ספרות נשלח לכתובת ${masked}.` : `A 6-digit code was sent to ${masked}.`}
          </p>
          {error && <div className="mb-1 p-3 rounded-lg bg-destructive/10 text-destructive text-sm">{error}</div>}
          <div className="space-y-2">
            <Label htmlFor="vcode">{he ? "קוד אימות" : "Verification code"}</Label>
            <Input
              id="vcode"
              inputMode="numeric"
              pattern="[0-9]{6}"
              maxLength={6}
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
              className="h-12 text-center text-2xl tracking-[0.4em]"
              autoFocus
              required
            />
          </div>
          <Button type="submit" className="w-full h-12 font-medium" disabled={busy || code.length !== 6}>
            {busy ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : (he ? "אימות וכניסה" : "Verify & continue")}
          </Button>
          <button type="button" onClick={resend} className="w-full text-xs text-muted-foreground hover:text-primary transition-colors" disabled={busy}>
            {he ? "שלח קוד מחדש" : "Resend code"}
          </button>
        </form>
      )}
    </AuthLayout>
  );
}