import { useEffect, useState } from "react";
import {
  Crown,
  FileCheck2,
  Mail,
  MapPin,
  MessageCircle,
  ShieldCheck,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useStore } from "@/lib/store";

type PolicyKey = "terms" | "warranty" | "privacy";

const policies: Record<
  PolicyKey,
  { title: string; icon: typeof ShieldCheck; sections: { heading: string; body: string }[] }
> = {
  terms: {
    title: "الشروط والأحكام",
    icon: FileCheck2,
    sections: [
      {
        heading: "الأجهزة والضمان",
        body: "جميع الأجهزة المباعة أصلية وجديدة بتغليف العلامة التجارية، وتخضع لضمان الوكيل المعتمد وفق شروط الشركة المصنّعة داخل مملكة البحرين.",
      },
      {
        heading: "خطط التقسيط",
        body: "تخضع خطط التقسيط للموافقة النهائية والتحقق من بيانات العميل. تُعرض الدفعة الأولى والمدة والقسط الشهري بوضوح قبل إتمام الطلب.",
      },
      {
        heading: "تأكيد الطلب والدفع",
        body: "لا يصبح الطلب مؤكداً إلا بعد إتمام الدفع أو رسوم التوصيل عبر رابط Benefit المعتمد واستلام رسالة تأكيد من السيف للهواتف.",
      },
    ],
  },
  warranty: {
    title: "سياسة الضمان والاستبدال",
    icon: ShieldCheck,
    sections: [
      {
        heading: "الضمان الرسمي",
        body: "تغطي أجهزة Apple وSamsung ضمان الوكيل الرسمي بحسب مدة وشروط الشركة المصنّعة، مع ضرورة الاحتفاظ بالفاتورة والرقم التسلسلي.",
      },
      {
        heading: "عيوب فتح العلبة",
        body: "يجب الإبلاغ عن أي عيب ظاهر أو نقص في محتويات العلبة خلال 24 ساعة من الاستلام، مع إرفاق صور واضحة للجهاز والتغليف.",
      },
      {
        heading: "الفحص والاستبدال",
        body: "يخضع الجهاز للفحص الفني قبل قبول الاستبدال. لا يشمل الاستبدال الأضرار الناتجة عن السقوط أو السوائل أو سوء الاستخدام أو فتح الجهاز خارج مراكز الخدمة المعتمدة.",
      },
    ],
  },
  privacy: {
    title: "سياسة الخصوصية وأمان البيانات",
    icon: ShieldCheck,
    sections: [
      {
        heading: "حماية بياناتك",
        body: "نتعامل مع بيانات العملاء وفق قانون حماية البيانات الشخصية في مملكة البحرين (PDPL)، ونستخدمها فقط لتأكيد الطلب والتوصيل وخدمة ما بعد البيع.",
      },
      {
        heading: "الدفع الآمن",
        body: "تتم عملية الطلب عبر اتصال SSL مشفّر. لا يحتفظ المتجر ببيانات بطاقات الدفع، وتُستكمل المدفوعات عبر القنوات المعتمدة.",
      },
      {
        heading: "مشاركة المعلومات",
        body: "لا نبيع بياناتك أو نشاركها لأغراض تسويقية خارجية. قد تُشارك البيانات الضرورية فقط مع مزودي الدفع والتوصيل لإتمام طلبك.",
      },
    ],
  },
};

function PolicyModal({ policy, onClose }: { policy: PolicyKey; onClose: () => void }) {
  const content = policies[policy];
  const Icon = content.icon;

  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[80] grid place-items-center p-4 print:hidden" role="dialog" aria-modal="true" aria-labelledby="policy-title">
      <button className="absolute inset-0 cursor-default bg-foreground/45 backdrop-blur-sm" onClick={onClose} aria-label="إغلاق النافذة" />
      <section className="relative max-h-[85vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-gold/40 bg-card shadow-lift">
        <header className="sticky top-0 flex items-center justify-between gap-4 border-b border-border bg-card/95 px-5 py-4 backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-full border border-gold/40 bg-accent text-gold-foreground">
              <Icon className="h-5 w-5" />
            </span>
            <div>
              <p className="text-[10px] font-bold text-gold-foreground">السيف للهواتف · مملكة البحرين</p>
              <h2 id="policy-title" className="text-base font-extrabold text-foreground">{content.title}</h2>
            </div>
          </div>
          <Button type="button" variant="ghost" size="icon" onClick={onClose} aria-label="إغلاق">
            <X />
          </Button>
        </header>
        <div className="space-y-5 p-5 sm:p-7">
          {content.sections.map((section, index) => (
            <div key={section.heading} className="border-b border-border pb-5 last:border-0 last:pb-0">
              <div className="flex items-center gap-2">
                <span className="grid h-6 w-6 place-items-center rounded-full bg-primary text-[10px] font-extrabold text-primary-foreground">{index + 1}</span>
                <h3 className="text-sm font-extrabold text-foreground">{section.heading}</h3>
              </div>
              <p className="mt-2 text-xs leading-7 text-muted-foreground">{section.body}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export function SiteFooter() {
  const { settings } = useStore();
  const [policy, setPolicy] = useState<PolicyKey | null>(null);
  const phone = settings.storePhone || "+973 XXXXXXXX";
  const email = settings.storeEmail || "support@alsaifphones.com";
  const whatsappNumber = phone.replace(/\D/g, "");
  const whatsappHref = whatsappNumber
    ? `https://wa.me/${whatsappNumber}?text=${encodeURIComponent("مرحباً السيف للهواتف، أود الاستفسار عن أحد الأجهزة.")}`
    : undefined;

  const scrollToContact = () => {
    document.getElementById("footer-contact")?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  return (
    <>
      <footer className="border-t border-gold/25 bg-primary text-primary-foreground print:hidden">
        <div className="mx-auto max-w-6xl px-5 pb-6 pt-10 sm:px-6 sm:pt-12">
          <div className="grid gap-9 border-b border-primary-foreground/15 pb-9 md:grid-cols-[1.35fr_0.8fr_1fr] md:gap-12">
            <section>
              <div className="flex items-center gap-3">
                <span className="grid h-11 w-11 place-items-center rounded-full border border-gold/50 bg-primary-foreground/5 text-gold">
                  <Crown className="h-6 w-6" />
                </span>
                <div>
                  <p className="text-lg font-extrabold text-gold">السيف للهواتف</p>
                  <p className="text-[10px] font-semibold text-primary-foreground/55">ALSAIF PHONES · BAHRAIN</p>
                </div>
              </div>
              <p className="mt-5 max-w-md text-sm font-semibold leading-7 text-primary-foreground/75">
                السيف للهواتف - وجهتكم الرائدة لأحدث الهواتف الذكية والأجهزة الأصلية في مملكة البحرين.
              </p>
            </section>

            <nav aria-label="روابط سريعة">
              <h2 className="text-sm font-extrabold text-gold">روابط سريعة</h2>
              <div className="mt-4 flex flex-col items-start gap-3 text-xs font-semibold text-primary-foreground/70">
                <button onClick={() => setPolicy("terms")} className="transition-colors hover:text-gold">الشروط والأحكام</button>
                <button onClick={() => setPolicy("warranty")} className="transition-colors hover:text-gold">سياسة الضمان والاستبدال</button>
                <button onClick={() => setPolicy("privacy")} className="transition-colors hover:text-gold">سياسة الخصوصية وأمان البيانات</button>
                <button onClick={scrollToContact} className="transition-colors hover:text-gold">تواصل معنا</button>
              </div>
            </nav>

            <section id="footer-contact" className="scroll-mt-24">
              <h2 className="text-sm font-extrabold text-gold">تواصل معنا</h2>
              <div className="mt-4 space-y-3 text-xs font-semibold text-primary-foreground/75">
                <a href={whatsappHref} target="_blank" rel="noreferrer" className="flex items-center gap-3 transition-colors hover:text-gold" dir="ltr">
                  <MessageCircle className="h-4 w-4 text-gold" />
                  <span>{phone}</span>
                </a>
                <a href={`mailto:${email}`} className="flex items-center gap-3 transition-colors hover:text-gold" dir="ltr">
                  <Mail className="h-4 w-4 text-gold" />
                  <span className="break-all">{email}</span>
                </a>
                <p className="flex items-center gap-3">
                  <MapPin className="h-4 w-4 shrink-0 text-gold" />
                  <span>المنامة، مملكة البحرين</span>
                </p>
              </div>
            </section>
          </div>

          <div className="mt-6 rounded-full border border-gold/35 bg-primary-foreground/5 px-4 py-3 text-center text-[10px] font-bold leading-5 text-primary-foreground/75 sm:text-xs">
            ملتزمون بدعم التحول الرقمي وتجارة التجزئة التقنية • رؤية البحرين الاقتصادية 2030 🇧🇭
          </div>
        </div>
      </footer>
      {policy && <PolicyModal policy={policy} onClose={() => setPolicy(null)} />}
    </>
  );
}