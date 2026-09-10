import { useEffect, useRef, useState } from "react";
import emailjs from "@emailjs/browser";
import { Mail, ShieldCheck } from "lucide-react";
import { useStore } from "@/lib/store";

type Step = "email" | "otp";

export function AuthModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { settings, signInUser } = useStore();
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState<string[]>(["", "", "", "", "", ""]);
  const [sentCode, setSentCode] = useState("");
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [busy, setBusy] = useState(false);
  const [seconds, setSeconds] = useState(300);
  const inputs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (!open) {
      setStep("email");
      setCode(["", "", "", "", "", ""]);
      setError("");
      setInfo("");
    }
  }, [open]);

  useEffect(() => {
    if (step !== "otp") return;
    const t = setInterval(() => setSeconds((s) => (s > 0 ? s - 1 : 0)), 1000);
    return () => clearInterval(t);
  }, [step]);

  if (!open) return null;

  const mm = String(Math.floor(seconds / 60)).padStart(2, "0");
  const ss = String(seconds % 60).padStart(2, "0");

  async function sendOtp(target: string) {
    const generated = String(Math.floor(100000 + Math.random() * 900000));
    setSentCode(generated);
    setSeconds(300);
    const { emailjsServiceId, emailjsTemplateId, emailjsPublicKey } = settings;
    if (!emailjsServiceId || !emailjsTemplateId || !emailjsPublicKey) {
      throw new Error("لم يتم ضبط إعدادات البريد في لوحة الإدارة");
    }
    await emailjs.send(
      emailjsServiceId,
      emailjsTemplateId,
      { passcode: generated, email: target, to_email: target, time: "5" },
      { publicKey: emailjsPublicKey },
    );
  }

  async function submitEmail(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return setError("بريد إلكتروني غير صحيح");
    setBusy(true);
    try {
      await sendOtp(email);
      setStep("otp");
      setInfo("تم إرسال رمز التحقق إلى بريدك الإلكتروني ✉️");
    } catch (err) {
      setError(err instanceof Error ? err.message : "تعذّر إرسال رمز التحقق");
    } finally {
      setBusy(false);
    }
  }

  function setDigit(i: number, v: string) {
    const digit = v.replace(/\D/g, "").slice(-1);
    const next = [...code];
    next[i] = digit;
    setCode(next);
    if (digit && i < 5) inputs.current[i + 1]?.focus();
  }

  function verify() {
    setError("");
    if (seconds === 0) return setError("انتهت صلاحية الرمز، أعد الإرسال");
    if (code.join("") !== sentCode) return setError("الرمز غير صحيح");
    signInUser(email, "");
    setInfo("تم تسجيل الدخول بنجاح ✓");
    setTimeout(onClose, 700);
  }

  async function resend() {
    setError("");
    setBusy(true);
    try {
      await sendOtp(email);
      setInfo("تم إرسال رمز جديد ✉️");
    } catch (err) {
      setError(err instanceof Error ? err.message : "تعذّر الإرسال");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 print:hidden">
      <button
        aria-label="إغلاق"
        onClick={onClose}
        className="absolute inset-0 bg-foreground/40 backdrop-blur-sm"
      />
      <div className="relative w-full max-w-md overflow-hidden rounded-[28px] border border-border bg-card shadow-lift transition-all duration-300">
        {/* Header */}
        <div className="relative bg-primary px-6 py-7 text-primary-foreground">
          <div className="flex items-start justify-between gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-foreground/10">
              <ShieldCheck className="h-6 w-6 text-gold" />
            </div>
            <div className="text-left" dir="rtl">
              <p className="text-[11px] font-bold tracking-[0.3em] text-gold">CUSTOMER ACCESS</p>
              <h2 className="mt-1 text-2xl font-extrabold">مساحتك في السيف للهواتف</h2>
              <p className="mt-2 text-xs leading-relaxed text-primary-foreground/70">
                دخول سريع وآمن عبر رمز مؤقت يصل إلى بريدك الإلكتروني.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-4 bg-surface px-6 py-6">
          {step === "email" ? (
            <form onSubmit={submitEmail} className="space-y-4">
              <div className="flex items-center justify-end gap-2 text-xs font-bold text-muted-foreground">
                أدخل بريدك الإلكتروني للبدء
                <Mail className="h-4 w-4 text-gold" />
              </div>
              <label className="block">
                <span className="mb-1 block text-xs font-bold">البريد الإلكتروني</span>
                <input
                  type="email"
                  dir="ltr"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full rounded-2xl border-2 border-gold/50 bg-card px-4 py-3 text-sm outline-none focus:border-gold"
                />
              </label>
              <button
                disabled={busy}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-primary py-3.5 text-sm font-extrabold text-primary-foreground disabled:opacity-60"
              >
                <Mail className="h-4 w-4" />
                {busy ? "جارٍ الإرسال..." : "إرسال OTP"}
              </button>
              <p className="text-center text-[11px] leading-relaxed text-muted-foreground">
                بيانات الدخول تُحفظ محلياً في هذا المتصفح.
              </p>
            </form>
          ) : (
            <div className="space-y-4">
              <div dir="ltr" className="flex justify-center gap-2">
                {code.map((d, i) => (
                  <input
                    key={i}
                    ref={(el) => {
                      inputs.current[i] = el;
                    }}
                    value={d}
                    inputMode="numeric"
                    onChange={(e) => setDigit(i, e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Backspace" && !code[i] && i > 0)
                        inputs.current[i - 1]?.focus();
                    }}
                    className="h-12 w-10 rounded-xl border border-input bg-card text-center text-lg font-extrabold outline-none focus:border-gold"
                  />
                ))}
              </div>
              <p className="text-center text-xs font-bold text-muted-foreground">
                ينتهي الرمز خلال {mm}:{ss}
              </p>
              <button
                onClick={verify}
                className="w-full rounded-2xl bg-primary py-3.5 text-sm font-extrabold text-primary-foreground"
              >
                تأكيد الرمز
              </button>
              <button
                onClick={resend}
                disabled={busy}
                className="w-full rounded-2xl border border-border bg-card py-2.5 text-xs font-bold disabled:opacity-60"
              >
                إعادة إرسال الرمز
              </button>
            </div>
          )}

          {error && <p className="text-center text-xs font-bold text-destructive">{error}</p>}
          {!error && info && (
            <p className="text-center text-xs font-bold text-gold-foreground">{info}</p>
          )}

          <button onClick={onClose} className="w-full text-center text-xs text-muted-foreground">
            إغلاق
          </button>
        </div>
      </div>
    </div>
  );
}
