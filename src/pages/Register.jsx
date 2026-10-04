import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserPlus, Mail, Lock, Loader2 } from "lucide-react";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import AuthLayout from "@/components/AuthLayout";
import { LanguageFlagToggle } from "@/components/LanguageFlags";
import { toast } from "@/components/ui/use-toast";
import { safeReturnTo } from "@/lib/authReturnTo";
import { useI18n } from "@/lib/i18n";

export default function Register() {
  const { lang } = useI18n();
  const he = lang === "he";
  const [email, setEmail] = useState("");
  const [emailLocked, setEmailLocked] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showOtp, setShowOtp] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [resendTimer, setResendTimer] = useState(60);

  // Pre-fill email from URL param (set by the invitation email link).
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const paramEmail = (params.get("email") || params.get("to") || "").trim();
    // Ignore unresolved template variables like {{email}}.
    if (paramEmail && !paramEmail.includes("{{") && paramEmail.includes("@")) {
      setEmail(paramEmail);
      setEmailLocked(true);
    }
  }, []);

  // Start the 60s resend countdown whenever the OTP screen appears.
  useEffect(() => {
    if (showOtp) setResendTimer(60);
  }, [showOtp]);

  useEffect(() => {
    if (resendTimer <= 0) return;
    const id = setTimeout(() => setResendTimer((t) => t - 1), 1000);
    return () => clearTimeout(id);
  }, [resendTimer]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (password !== confirmPassword) {
      setError(he ? "הסיסמאות אינן תואמות" : "Passwords do not match");
      return;
    }
    setLoading(true);
    try {
      // Verify this email was invited before allowing registration.
      const checkRes = await base44.functions.invoke("checkInvitedEmail", { email: email.trim().toLowerCase() });
      if (checkRes.data?.invited === false) {
        setError(he
          ? "כתובת האימייל הזו אינה מורשית להרשמה. נא לפנות למנהל המערכת."
          : "This email is not authorized to register. Please contact the administrator.");
        setLoading(false);
        return;
      }
      await base44.auth.register({ email, password });
      setShowOtp(true);
    } catch (err) {
      setError(err.message || (he ? "ההרשמה נכשלה" : "Registration failed"));
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async () => {
    setError("");
    setLoading(true);
    try {
      const result = await base44.auth.verifyOtp({ email, otpCode });
      if (result?.access_token) {
        base44.auth.setToken(result.access_token);
      }
      window.location.href = safeReturnTo();
    } catch (err) {
      setError(err.message || (he ? "קוד אימות שגוי" : "Invalid verification code"));
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (resendTimer > 0) return;
    setError("");
    try {
      await base44.auth.resendOtp(email);
      setResendTimer(60);
      toast({
        title: he ? "הקוד נשלח" : "Code sent",
        description: he ? "בדוק את תיבת האימייל שלך לקבלת הקוד החדש." : "Check your email for the new code.",
      });
    } catch (err) {
      setError(err.message || (he ? "שליחת הקוד מחדש נכשלה" : "Failed to resend code"));
    }
  };

  if (showOtp) {
    return (
      <AuthLayout
        icon={Mail}
        title={he ? "אימות דואר אלקטרוני" : "Verify your email"}
        subtitle={he ? `שלחנו קוד ל-${email}` : `We sent a code to ${email}`}
      >
        <LanguageFlagToggle />
        {error && (
          <div className="mb-4 p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
            {error}
          </div>
        )}
        <div dir="ltr" className="flex justify-center mb-6">
          <InputOTP
            maxLength={6}
            value={otpCode}
            onChange={setOtpCode}
            autoFocus
            autoComplete="one-time-code"
          >
            <InputOTPGroup>
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
              <InputOTPSlot index={3} />
              <InputOTPSlot index={4} />
              <InputOTPSlot index={5} />
            </InputOTPGroup>
          </InputOTP>
        </div>
        <Button
          className="w-full h-12 font-medium"
          onClick={handleVerify}
          disabled={loading || otpCode.length < 6}
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              {he ? "מאמת..." : "Verifying..."}
            </>
          ) : (
            he ? "אימות" : "Verify"
          )}
        </Button>
        <div className="text-center mt-4 space-y-1">
          <p className="text-sm text-muted-foreground">
            {he ? "לא קיבלת את הקוד?" : "Didn't receive the code?"}
          </p>
          <button
            type="button"
            onClick={handleResend}
            disabled={resendTimer > 0}
            className="text-sm text-primary font-medium hover:underline disabled:opacity-50 disabled:no-underline disabled:cursor-not-allowed"
          >
            {resendTimer > 0
              ? (he ? `שליחה מחדש (${resendTimer}s)` : `Resend (${resendTimer}s)`)
              : (he ? "שליחה מחדש" : "Resend")}
          </button>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      icon={UserPlus}
      title={he ? "יצירת חשבון" : "Create your account"}
      subtitle={he ? "הירשם כדי להתחיל" : "Sign up to get started"}
      footer={
        <>
          {he ? "כבר יש לך חשבון? " : "Already have an account? "}
          <Link
            to={"/login" + (safeReturnTo() !== "/" ? "?returnTo=" + encodeURIComponent(safeReturnTo()) : "")}
            className="text-primary font-medium hover:underline"
          >
            {he ? "התחברות" : "Log in"}
          </Link>
        </>
      }
    >
      <LanguageFlagToggle />

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
              autoFocus={!emailLocked}
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={emailLocked}
              className={`pl-10 h-12 ${emailLocked ? "bg-muted text-muted-foreground cursor-not-allowed opacity-80" : ""}`}
              required
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">{he ? "סיסמה" : "Password"}</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" aria-hidden="true" />
            <Input
              id="password"
              type="password"
              autoComplete="new-password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pl-10 h-12"
              required
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="confirm">{he ? "אימות סיסמה" : "Confirm Password"}</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" aria-hidden="true" />
            <Input
              id="confirm"
              type="password"
              autoComplete="new-password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="pl-10 h-12"
              required
            />
          </div>
        </div>
        <Button type="submit" className="w-full h-12 font-medium" disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              {he ? "יוצר חשבון..." : "Creating account..."}
            </>
          ) : (
            he ? "יצירת חשבון" : "Create account"
          )}
        </Button>
      </form>
    </AuthLayout>
  );
}