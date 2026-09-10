import { useStore } from "@/lib/store";

const GREETING = "مرحباً، أود الاستفسار عن منتجات السيف للهواتف";

export function WhatsAppFloat() {
  const { settings } = useStore();
  const digits = (settings.storePhone || "").replace(/\D/g, "");
  if (!digits) return null;

  return (
    <a
      href={`https://wa.me/${digits}?text=${encodeURIComponent(GREETING)}`}
      target="_blank"
      rel="noreferrer"
      aria-label="تواصل معنا عبر واتساب"
      className="fixed bottom-5 right-5 z-50 flex h-11 w-11 items-center justify-center rounded-full bg-[#FBF5EB] border-[1.5px] border-[#C5A880] shadow-soft transition-transform hover:scale-105 print:hidden"
    >
      <svg
        viewBox="0 0 24 24"
        className="h-5 w-5"
        fill="#6B4F35"
        aria-hidden="true"
      >
        <path d="M12 2a9.9 9.9 0 0 0-8.55 14.92L2 22l5.24-1.37A9.94 9.94 0 1 0 12 2Zm0 1.8a8.14 8.14 0 1 1-4.15 15.15l-.3-.18-3.07.8.82-3-.2-.31A8.14 8.14 0 0 1 12 3.8Zm-3.2 4.15c-.18 0-.47.07-.72.34-.24.27-.94.92-.94 2.25s.97 2.6 1.1 2.78c.13.18 1.88 3 4.66 4.1 2.31.91 2.78.73 3.28.68.5-.05 1.62-.66 1.85-1.3.23-.64.23-1.19.16-1.3-.07-.12-.25-.19-.53-.32l-1.85-.86c-.25-.12-.44-.18-.63.07-.18.25-.72.86-.88 1.04-.16.18-.32.2-.6.07a7.5 7.5 0 0 1-2.2-1.36 8.3 8.3 0 0 1-1.52-1.9c-.16-.27-.02-.42.12-.55.12-.12.27-.32.41-.48.14-.16.18-.27.27-.46.09-.18.05-.34-.02-.48l-.84-2.03c-.21-.5-.43-.5-.6-.5Z" />
      </svg>
    </a>
  );
}
