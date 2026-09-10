import type { Category } from "./products";

export type NavLeaf = { label: string; category: Category | "all"; query: string };
export type NavGroup = { label: string; icon: string; children: (NavLeaf | NavBranch)[] };
export type NavBranch = { label: string; children: NavLeaf[] };

export const isBranch = (n: NavLeaf | NavBranch): n is NavBranch =>
  (n as NavBranch).children !== undefined;

const gen = (n: number): NavBranch => ({
  label: `iPhone ${n}`,
  children: [
    { label: `iPhone ${n}`, category: "iphone", query: `iphone ${n}` },
    { label: `iPhone ${n} Plus`, category: "iphone", query: `iphone ${n} plus` },
    { label: `iPhone ${n} Pro`, category: "iphone", query: `iphone ${n} pro` },
    { label: `iPhone ${n} Pro Max`, category: "iphone", query: `iphone ${n} pro max` },
    { label: `iPhone ${n} Air`, category: "iphone", query: `iphone ${n} air` },
  ],
});

export const navTree: NavGroup[] = [
  {
    label: "Apple iPhone",
    icon: "📱",
    children: [
      { label: "كل أجهزة آيفون", category: "iphone", query: "" },
      gen(18),
      gen(17),
      gen(16),
      gen(15),
      gen(14),
      gen(13),
    ],
  },
  {
    label: "Samsung Galaxy",
    icon: "🌌",
    children: [
      { label: "كل أجهزة سامسونج", category: "samsung", query: "" },
      {
        label: "سلسلة S",
        children: [
          { label: "Galaxy S25 Ultra", category: "samsung", query: "s25 ultra" },
          { label: "Galaxy S25+", category: "samsung", query: "s25+" },
          { label: "Galaxy S25", category: "samsung", query: "s25" },
          { label: "Galaxy S24 Ultra", category: "samsung", query: "s24 ultra" },
        ],
      },
      {
        label: "Z Fold و Z Flip",
        children: [
          { label: "Galaxy Z Fold", category: "samsung", query: "fold" },
          { label: "Galaxy Z Flip", category: "samsung", query: "flip" },
        ],
      },
    ],
  },
  {
    label: "PlayStation",
    icon: "🎮",
    children: [
      { label: "كل أجهزة الألعاب", category: "gaming", query: "" },
      { label: "PS5 Pro", category: "gaming", query: "pro" },
      { label: "PS5 Slim", category: "gaming", query: "slim" },
      { label: "Nintendo Switch OLED", category: "gaming", query: "switch" },
      { label: "يد التحكم DualSense", category: "gaming", query: "dualsense" },
      { label: "سماعة Pulse 3D", category: "gaming", query: "pulse" },
      { label: "شاحن يدات التحكم", category: "gaming", query: "شاحن يدات" },
    ],
  },
  {
    label: "أجهزة آيباد واللوحيات",
    icon: "📱",
    children: [
      { label: "كل الأجهزة اللوحية", category: "tablet", query: "" },
      { label: "iPad Pro (M4)", category: "tablet", query: "ipad pro" },
      { label: "iPad Air (M2)", category: "tablet", query: "ipad air" },
      { label: "iPad mini 6", category: "tablet", query: "mini" },
      { label: "iPad الجيل العاشر", category: "tablet", query: "الجيل العاشر" },
      { label: "iPad الجيل التاسع", category: "tablet", query: "الجيل التاسع" },
    ],
  },
  {
    label: "الساعات الذكية",
    icon: "⌚",
    children: [
      { label: "كل الساعات", category: "watch", query: "" },
      { label: "Apple Watch Ultra 2", category: "watch", query: "ultra" },
      { label: "Apple Watch Series 10", category: "watch", query: "series 10" },
      { label: "Apple Watch Series 9", category: "watch", query: "series 9" },
      { label: "Apple Watch SE 2", category: "watch", query: "se 2" },
      { label: "Galaxy Watch", category: "watch", query: "galaxy watch" },
      { label: "Galaxy Watch 6 Classic", category: "watch", query: "classic" },
    ],
  },
  {
    label: "الصوتيات الفاخرة",
    icon: "🎧",
    children: [
      { label: "كل الصوتيات", category: "audio", query: "" },
      { label: "AirPods 3", category: "audio", query: "airpods 3" },
      { label: "AirPods 4", category: "audio", query: "airpods 4" },
      { label: "AirPods Pro", category: "audio", query: "airpods pro" },
      { label: "AirPods Max", category: "audio", query: "airpods max" },
      { label: "Sony WH-1000XM5", category: "audio", query: "sony" },
    ],
  },
  {
    label: "ماك بوك ولابتوب",
    icon: "💻",
    children: [
      { label: "كل الأجهزة", category: "laptop", query: "" },
      { label: "MacBook Air (M3)", category: "laptop", query: "macbook air (m3)" },
      { label: "MacBook Air (M2)", category: "laptop", query: "macbook air (m2)" },
      { label: "MacBook Pro 14", category: "laptop", query: "pro 14" },
      { label: "MacBook Pro 16", category: "laptop", query: "pro 16" },
    ],
  },
  {
    label: "الإكسسوارات وحزم الشحن",
    icon: "🔌",
    children: [
      { label: "كل الإكسسوارات", category: "accessories", query: "" },
      { label: "الشواحن والكيبلات", category: "accessories", query: "شاحن" },
      { label: "شاحن السيارة", category: "accessories", query: "سيارة" },
      { label: "بطاريات MagSafe", category: "accessories", query: "magsafe" },
      { label: "محفظة MagSafe", category: "accessories", query: "محفظة" },
    ],
  },
];
