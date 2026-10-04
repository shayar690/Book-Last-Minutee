import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ShieldCheck, Mail, Lock, Loader2 } from "lucide-react";
import AuthLayout from "@/components/AuthLayout";
import GoogleIcon from "@/components/GoogleIcon";
import { useI18n } from "@/lib/i18n";

// Dedicated staff login — company employees & administrators only.
// After a successful login the user is sent straight to the admin panel.
export default function AdminLogin() {
  const { lang, localePath } = useI18n();
  const dest = "/admin/verify";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);

  const he = lang === "he";

  // If already authenticated, skip the form and go to the panel.
  useEffect(() => {
    let active = true;
    // A fresh login must always re-run 2FA — clear any prior session flag.
    sessionStorage.removeItem("admin_2fa_ok");
    base44.auth.isAuthenticated().then((ok) => {
      if (ok && active) window.location.href = dest;
      else if (active) setChecking(false);
    }).catch(() => active && setChecking(false));
    return () => { active = false; };
  }, [dest]);

  // Make sure the SDK's internal post-login redirect also lands on the panel.
  useEffect(() => {
    const url = new URL(window.location.href);
    if (!url.searchParams.get("returnTo")) {
      url.searchParams.set("returnTo", dest);
      window.history.replaceState({}, "", url);
    }
  }, [dest]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await base44.auth.loginViaEmailPassword(email, password);
      window.location.href = dest;
    } catch (err) {
      setError(err.message || (he ? "אימייל או סיסמה שגויים" : "Invalid email or password"));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = () => {
    base44.auth.loginWithProvider("google", dest);
  };

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-7 h-7 text-muted-foreground animate-spin" />
      </div>
    );
  }

  return (
    <AuthLayout
      icon={ShieldCheck}
      title={he ? "כניסת עובדים" : "Staff Portal"}
      subtitle={he ? "כניסה לעובדי החברה ולמנהלים בלבד" : "Company employees & administrators only"}
      footer={
        <span className="text-muted-foreground">
          {he ? "אין לך גישה? " : "No access? "}
          <Link to={localePath("/")} className="text-primary font-medium hover:underline">
            {he ? "חזרה לאתר" : "Back to site"}
          </Link>
        </span>
      }
    >
      <Button
        variant="outline"
        className="w-full h-12 text-sm font-medium mb-6"
        onClick={handleGoogle}
      >
        <GoogleIcon className="w-5 h-5 mr-2" />
        {he ? "המשך עם Google" : "Continue with Google"}
      </Button>

      <div className="relative mb-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-card px-3 text-muted-foreground">{he ? "או" : "or"}</span>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">{he ? "אימייל" : "Email"}</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" aria-hidden="true" />
            <Input
              id="email"
              type="email"
              autoComplete="email"
              autoFocus
              placeholder="you@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="pl-10 h-12"
              required
            />
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">{he ? "סיסמה" : "Password"}</Label>
            <Link to="/forgot-password" className="text-xs text-primary hover:underline">
              {he ? "שכחת סיסמה?" : "Forgot password?"}
            </Link>
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" aria-hidden="true" />
            <Input
              id="password"
              type="password"
              autoComplete="current-password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pl-10 h-12"
              required
            />
          </div>
        </div>
        <Button type="submit" className="w-full h-12 font-medium" disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              {he ? "מתחבר..." : "Logging in..."}
            </>
          ) : (
            he ? "כניסה" : "Log in"
          )}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        {he ? "כניסה ראשונה? " : "First sign-in? "}
        <a href={`/register?returnTo=${encodeURIComponent("/admin/verify")}`} className="text-primary font-medium hover:underline">
          {he ? "יצירת סיסמה" : "Create your password"}
        </a>
      </p>

      <p className="mt-3 text-center text-xs text-muted-foreground">
        {he
          ? "הגישה לפאנל הניהול מוגבלת לעובדים מורשים בלבד."
          : "Access to the admin panel is restricted to authorized staff only."}
      </p>
    </AuthLayout>
  );
}