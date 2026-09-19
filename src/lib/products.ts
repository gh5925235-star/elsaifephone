import iphoneImg from "@/assets/iphone.jpg";
import samsungImg from "@/assets/samsung.jpg";
import consoleImg from "@/assets/console.jpg";
import audioImg from "@/assets/audio.jpg";
import iphoneProImg from "@/assets/iphone-pro.jpg";
import iphoneStdImg from "@/assets/iphone-standard.jpg";
import samsungFoldImg from "@/assets/samsung-fold.jpg";
import samsungFlipImg from "@/assets/samsung-flip.jpg";
import ps5ProImg from "@/assets/ps5-pro.jpg";
import ps5SlimImg from "@/assets/ps5-slim.jpg";
import airpodsProImg from "@/assets/airpods-pro.jpg";
import airpodsMaxImg from "@/assets/airpods-max.jpg";
import sgGray from "@/assets/sg-titanium-gray.jpg";
import sgBlack from "@/assets/sg-titanium-black.jpg";
import sgAmber from "@/assets/sg-amber-yellow.jpg";
import sgViolet from "@/assets/sg-cobalt-violet.jpg";
import cDesertTi from "@/assets/c-desert-titanium.jpg";
import cNaturalTi from "@/assets/c-natural-titanium.jpg";
import cWhiteTi from "@/assets/c-white-titanium.jpg";
import cBlueTi from "@/assets/c-blue-titanium.jpg";
import cUltramarine from "@/assets/c-ultramarine.jpg";
import cTeal from "@/assets/c-teal.jpg";
import cPink from "@/assets/c-pink.jpg";
import cWhite from "@/assets/c-white.jpg";
import cBlack from "@/assets/c-black.jpg";
import cBlackTi from "@/assets/c-black-titanium.jpg";
import c17Orange from "@/assets/c17-cosmic-orange.jpg";
import c17DeepBlue from "@/assets/c17-deep-blue.jpg";
import c17Silver from "@/assets/c17-silver.jpg";
import c17SpaceBlack from "@/assets/c17-space-black.jpg";
import c18Cherry from "@/assets/c18-dark-cherry.jpg";
import c18Sierra from "@/assets/c18-sierra-blue.jpg";
import c18Glacier from "@/assets/c18-glacier-silver.jpg";
import c18Graphite from "@/assets/c18-graphite.jpg";
import s18Cherry from "@/assets/s18-dark-cherry.jpg";
import s18Sierra from "@/assets/s18-sierra-blue.jpg";
import s18Glacier from "@/assets/s18-glacier-silver.jpg";
import s18Graphite from "@/assets/s18-graphite.jpg";
import cPastelBlue from "@/assets/c-pastel-blue.jpg";
import cPastelGreen from "@/assets/c-pastel-green.jpg";
import cPastelYellow from "@/assets/c-pastel-yellow.jpg";
import cPastelPink from "@/assets/c-pastel-pink.jpg";
import ipadProBlack from "@/assets/ipad-pro-space-black.jpg";
import ipadProSilver from "@/assets/ipad-pro-silver.jpg";
import ipadAirGray from "@/assets/ipad-air-space-gray.jpg";
import ipadAirStarlight from "@/assets/ipad-air-starlight.jpg";
import ipadAirBlue from "@/assets/ipad-air-blue.jpg";
import ipadAirPurple from "@/assets/ipad-air-purple.jpg";
import ipad10Silver from "@/assets/ipad-10-silver.jpg";
import ipad10Blue from "@/assets/ipad-10-blue.jpg";
import ipad10Pink from "@/assets/ipad-10-pink.jpg";
import ipad10Yellow from "@/assets/ipad-10-yellow.jpg";
import watchUltraNatural from "@/assets/watch-ultra-natural.jpg";
import watchUltraBlack from "@/assets/watch-ultra-black.jpg";
import watchMidnight from "@/assets/watch-midnight.jpg";
import watchStarlight from "@/assets/watch-starlight.jpg";
import watchSilver from "@/assets/watch-silver.jpg";
import watchJetBlack from "@/assets/watch-jet-black.jpg";
import gwatchGray from "@/assets/gwatch-titanium-gray.jpg";
import gwatchWhite from "@/assets/gwatch-titanium-white.jpg";
import gwatchSilver from "@/assets/gwatch-titanium-silver.jpg";
import apmaxSpaceGray from "@/assets/apmax-space-gray.jpg";
import apmaxSilver from "@/assets/apmax-silver.jpg";
import apmaxSkyBlue from "@/assets/apmax-sky-blue.jpg";
import apmaxPink from "@/assets/apmax-pink.jpg";
import apmaxGreen from "@/assets/apmax-green.jpg";
import apmaxMidnight from "@/assets/apmax-midnight.jpg";
import apmaxStarlight from "@/assets/apmax-starlight.jpg";
import mbaMidnight from "@/assets/mba-midnight.jpg";
import mbaStarlight from "@/assets/mba-starlight.jpg";
import mbaSpaceGray from "@/assets/mba-space-gray.jpg";
import mbaSilver from "@/assets/mba-silver.jpg";
import mbpSpaceBlack from "@/assets/mbp-space-black.jpg";
import mbpSilver from "@/assets/mbp-silver.jpg";
import dualsenseWhite from "@/assets/dualsense-white.jpg";
import dualsenseBlack from "@/assets/dualsense-black.jpg";
import dualsenseRed from "@/assets/dualsense-red.jpg";
import chargerBundle from "@/assets/charger-bundle.jpg";
import magsafeBattery from "@/assets/magsafe-battery.jpg";
import airpodsProUsbc from "@/assets/airpods-pro-usbc.jpg";
import ipadMiniStarlight from "@/assets/ipad-mini-starlight.jpg";
import ipadMiniGray from "@/assets/ipad-mini-space-gray.jpg";
import ipad9Silver from "@/assets/ipad-9-silver.jpg";
import ipad9Gray from "@/assets/ipad-9-space-gray.jpg";
import gwatch6Black from "@/assets/gwatch6-classic-black.jpg";
import gwatch6Silver from "@/assets/gwatch6-classic-silver.jpg";
import sonyBlack from "@/assets/sony-xm5-black.jpg";
import sonySilver from "@/assets/sony-xm5-silver.jpg";
import airpods3Img from "@/assets/airpods-3.jpg";
import switchOled from "@/assets/switch-oled.jpg";
import pulse3d from "@/assets/pulse-3d.jpg";
import controllerCharger from "@/assets/controller-charger.jpg";
import carCharger from "@/assets/car-charger.jpg";
import magsafeWallet from "@/assets/magsafe-wallet.jpg";
import watchRoseGold from "@/assets/watch-rose-gold.jpg";
import watchSlateTi from "@/assets/watch-slate-titanium.jpg";
import watchGoldTi from "@/assets/watch-gold-titanium.jpg";
import watchNaturalTi from "@/assets/watch-natural-titanium.jpg";

export type Category =
  | "iphone"
  | "samsung"
  | "tablet"
  | "watch"
  | "audio"
  | "laptop"
  | "gaming"
  | "accessories";

export type Variant = { storage: string; price: number; down?: number };

export type ColorOption = { name: string; hex: string; image: string };

export type Product = {
  id: string;
  name: string;
  category: Category;
  image: string;
  available?: boolean;
  colors?: ColorOption[];
  variants: Variant[];
  /** شارة تسويقية تظهر على بطاقة المنتج */
  badge?: string;
};

/** شارات المنتجات الأحدث */
const productBadges: Record<string, string> = {
  "watch-s10": "وصل حديثاً ⚡",
  "watch-ultra-2": "الأحدث من Apple",
};


export const categories: { id: Category; label: string; icon: string }[] = [
  { id: "iphone", label: "آيفون", icon: "" },
  { id: "samsung", label: "سامسونج", icon: "" },
  { id: "tablet", label: "آيباد واللوحيات", icon: "" },
  { id: "watch", label: "الساعات الذكية", icon: "" },
  { id: "audio", label: "الصوتيات", icon: "" },
  { id: "laptop", label: "ماك بوك ولابتوب", icon: "" },
  { id: "gaming", label: "الألعاب", icon: "" },
  { id: "accessories", label: "الإكسسوارات", icon: "" },
];

const img: Record<Category, string> = {
  iphone: iphoneImg,
  samsung: samsungImg,
  gaming: consoleImg,
  audio: audioImg,
  tablet: ipadProBlack,
  watch: watchUltraNatural,
  laptop: mbaMidnight,
  accessories: chargerBundle,
};

function imageFor(id: string, category: Category): string {
  if (id === "ps5-pro") return ps5ProImg;
  if (id.startsWith("ps5")) return ps5SlimImg;
  if (id === "airpods-max") return apmaxSpaceGray;
  if (id === "airpods-pro-2") return airpodsProUsbc;
  if (id.startsWith("airpods")) return airpodsProImg;
  if (id === "zfold6") return samsungFoldImg;
  if (id === "zflip6") return samsungFlipImg;
  if (id === "charger-bundle") return chargerBundle;
  if (id === "magsafe-battery") return magsafeBattery;
  if (id === "airpods-3") return airpods3Img;
  if (id === "switch-oled") return switchOled;
  if (id === "pulse-3d") return pulse3d;
  if (id === "controller-charger") return controllerCharger;
  if (id === "car-charger") return carCharger;
  if (id === "magsafe-wallet") return magsafeWallet;
  if (category === "samsung") return sgGray;
  if (category === "iphone") return id.includes("pro") ? iphoneProImg : iphoneStdImg;
  return img[category];
}

// ألوان الإطلاق الرسمية لكل موديل
const proTitanium16: ColorOption[] = [
  { name: "تيتانيوم صحراوي", hex: "#C5A88B", image: cDesertTi },
  { name: "تيتانيوم طبيعي", hex: "#9E9992", image: cNaturalTi },
  { name: "تيتانيوم أبيض", hex: "#F2F1ED", image: cWhiteTi },
  { name: "تيتانيوم أسود", hex: "#3C3B37", image: cBlackTi },
];

const std16: ColorOption[] = [
  { name: "ألترامارين", hex: "#4A6382", image: cUltramarine },
  { name: "أخضر فيروزي", hex: "#82A19B", image: cTeal },
  { name: "وردي", hex: "#E5A5B5", image: cPink },
  { name: "أبيض", hex: "#F5F5F7", image: cWhite },
  { name: "أسود", hex: "#2C2C2E", image: cBlack },
];

const proTitanium15: ColorOption[] = [
  { name: "تيتانيوم طبيعي", hex: "#9E9992", image: cNaturalTi },
  { name: "تيتانيوم أزرق", hex: "#2C3847", image: cBlueTi },
  { name: "تيتانيوم أبيض", hex: "#F2F1ED", image: cWhiteTi },
  { name: "تيتانيوم أسود", hex: "#3C3B37", image: cBlackTi },
];

const std15: ColorOption[] = [
  { name: "أسود", hex: "#2C2C2E", image: cBlack },
  { name: "أزرق", hex: "#D0D9E1", image: cPastelBlue },
  { name: "أخضر", hex: "#D4E2D4", image: cPastelGreen },
  { name: "أصفر", hex: "#F5E8C7", image: cPastelYellow },
  { name: "وردي", hex: "#F9D8DA", image: cPastelPink },
];

const samsungColors: ColorOption[] = [
  { name: "رمادي تيتانيوم", hex: "#7C7C80", image: sgGray },
  { name: "أسود تيتانيوم", hex: "#1C1C1E", image: sgBlack },
  { name: "أصفر عنبري", hex: "#F0A92B", image: sgAmber },
  { name: "بنفسجي كوبالت", hex: "#6E5BC6", image: sgViolet },
];


const pro17: ColorOption[] = [
  { name: "برتقالي كوني", hex: "#E85D26", image: c17Orange },
  { name: "أزرق داكن", hex: "#1A2634", image: c17DeepBlue },
  { name: "فضي تيتانيوم", hex: "#E2E2E6", image: c17Silver },
  { name: "أسود فضائي", hex: "#222224", image: c17SpaceBlack },
];

const pro18: ColorOption[] = [
  { name: "كرز داكن", hex: "#4E1F2E", image: c18Cherry },
  { name: "أزرق سماوي جليدي", hex: "#8CA9C4", image: c18Sierra },
  { name: "فضي جليدي", hex: "#EEEEF2", image: c18Glacier },
  { name: "رمادي داكن", hex: "#36373A", image: c18Graphite },
];

const std18: ColorOption[] = [
  { name: "كرز داكن", hex: "#4E1F2E", image: s18Cherry },
  { name: "أزرق سماوي جليدي", hex: "#8CA9C4", image: s18Sierra },
  { name: "فضي جليدي", hex: "#EEEEF2", image: s18Glacier },
  { name: "رمادي داكن", hex: "#36373A", image: s18Graphite },
];

const ipadProColors: ColorOption[] = [
  { name: "أسود فضائي", hex: "#2A2A2C", image: ipadProBlack },
  { name: "فضي", hex: "#E3E4E6", image: ipadProSilver },
];

const ipadAirColors: ColorOption[] = [
  { name: "رمادي فضائي", hex: "#54565A", image: ipadAirGray },
  { name: "ستارلايت", hex: "#EFE6D8", image: ipadAirStarlight },
  { name: "أزرق", hex: "#8FA9C4", image: ipadAirBlue },
  { name: "بنفسجي", hex: "#B3A8CE", image: ipadAirPurple },
];

const ipad10Colors: ColorOption[] = [
  { name: "فضي", hex: "#E3E4E6", image: ipad10Silver },
  { name: "أزرق", hex: "#7FA8C9", image: ipad10Blue },
  { name: "وردي", hex: "#EAB1B4", image: ipad10Pink },
  { name: "أصفر", hex: "#EFCB6A", image: ipad10Yellow },
];

const watchUltraColors: ColorOption[] = [
  { name: "تيتانيوم طبيعي", hex: "#B8B0A6", image: watchUltraNatural },
  { name: "تيتانيوم أسود", hex: "#2B2B2D", image: watchUltraBlack },
];

const watchColors: ColorOption[] = [
  { name: "منتصف الليل", hex: "#1F2430", image: watchMidnight },
  { name: "ستارلايت", hex: "#EFE6D8", image: watchStarlight },
  { name: "فضي", hex: "#E3E4E6", image: watchSilver },
  { name: "أسود لامع", hex: "#101012", image: watchJetBlack },
];

/** ألوان Apple Watch Series 10 (ألمنيوم + تيتانيوم) */
const watchS10Colors: ColorOption[] = [
  { name: "أسود لامع (ألمنيوم)", hex: "#101012", image: watchJetBlack },
  { name: "ذهبي وردي (ألمنيوم)", hex: "#E5B0A5", image: watchRoseGold },
  { name: "فضي (ألمنيوم)", hex: "#E3E4E6", image: watchSilver },
  { name: "إردوازي تيتانيوم", hex: "#4A4E54", image: watchSlateTi },
  { name: "ذهبي تيتانيوم", hex: "#D8BC85", image: watchGoldTi },
  { name: "طبيعي تيتانيوم", hex: "#C2BDB6", image: watchNaturalTi },
];

const gwatchColors: ColorOption[] = [
  { name: "رمادي تيتانيوم", hex: "#7C7C80", image: gwatchGray },
  { name: "أبيض تيتانيوم", hex: "#EDEDEF", image: gwatchWhite },
  { name: "فضي تيتانيوم", hex: "#C9CACC", image: gwatchSilver },
];

const airpodsMaxColors: ColorOption[] = [
  { name: "رمادي فضائي", hex: "#54565A", image: apmaxSpaceGray },
  { name: "فضي", hex: "#E3E4E6", image: apmaxSilver },
  { name: "أزرق سماوي", hex: "#A9C6DC", image: apmaxSkyBlue },
  { name: "وردي", hex: "#EAB1B4", image: apmaxPink },
  { name: "أخضر", hex: "#A9C3A5", image: apmaxGreen },
  { name: "منتصف الليل", hex: "#1F2430", image: apmaxMidnight },
  { name: "ستارلايت", hex: "#EFE6D8", image: apmaxStarlight },
];

const mbaColors: ColorOption[] = [
  { name: "منتصف الليل", hex: "#1F2430", image: mbaMidnight },
  { name: "ستارلايت", hex: "#EFE6D8", image: mbaStarlight },
  { name: "رمادي فضائي", hex: "#54565A", image: mbaSpaceGray },
  { name: "فضي", hex: "#E3E4E6", image: mbaSilver },
];

const mbpColors: ColorOption[] = [
  { name: "أسود فضائي", hex: "#2A2A2C", image: mbpSpaceBlack },
  { name: "فضي", hex: "#E3E4E6", image: mbpSilver },
];

const dualsenseColors: ColorOption[] = [
  { name: "أبيض", hex: "#F5F5F7", image: dualsenseWhite },
  { name: "أسود منتصف الليل", hex: "#1B1B1D", image: dualsenseBlack },
  { name: "أحمر كوني", hex: "#B4232A", image: dualsenseRed },
];

const ipadMiniColors: ColorOption[] = [
  { name: "ستارلايت", hex: "#EFE6D8", image: ipadMiniStarlight },
  { name: "رمادي فضائي", hex: "#54565A", image: ipadMiniGray },
];

const ipad9Colors: ColorOption[] = [
  { name: "فضي", hex: "#E3E4E6", image: ipad9Silver },
  { name: "رمادي فضائي", hex: "#54565A", image: ipad9Gray },
];

const gwatch6Colors: ColorOption[] = [
  { name: "أسود", hex: "#1B1B1D", image: gwatch6Black },
  { name: "فضي", hex: "#D9DADC", image: gwatch6Silver },
];

const sonyColors: ColorOption[] = [
  { name: "أسود", hex: "#1B1B1D", image: sonyBlack },
  { name: "فضي بيج", hex: "#DBD5C7", image: sonySilver },
];

const colorSets: Record<string, ColorOption[]> = {
  "ip18-plus": std18,
  ip18: std18,
  "ip18-pro-max": pro18,
  "ip18-pro": pro18,
  "ip17-pro-max": pro17,
  "ip17-pro": pro17,
  "ip17-air": std16,
  ip17: std16,
  "ip16-pro-max": proTitanium16,
  "ip16-pro": proTitanium16,
  "ip16-plus": std16,
  ip16: std16,
  "ip15-pro-max": proTitanium15,
  "ip15-pro": proTitanium15,
  "ip15-plus": std15,
  ip15: std15,
  "ip14-pro-max": proTitanium15,
  ip14: std15,
  ip13: std15,
  "ipad-pro-11": ipadProColors,
  "ipad-pro-13": ipadProColors,
  "ipad-air-11": ipadAirColors,
  "ipad-air-13": ipadAirColors,
  "ipad-10": ipad10Colors,
  "watch-ultra-2": watchUltraColors,
  "watch-s10": watchS10Colors,
  "watch-s9": watchColors,
  "gwatch-ultra": gwatchColors,
  "gwatch-7": gwatchColors,
  "airpods-max": airpodsMaxColors,
  "mba-13": mbaColors,
  "mba-15": mbaColors,
  "mbp-14": mbpColors,
  "mbp-16": mbpColors,
  dualsense: dualsenseColors,
  "ipad-mini-6": ipadMiniColors,
  "ipad-9": ipad9Colors,
  "watch-se-2": watchColors,
  "gwatch-6-classic": gwatch6Colors,
  "sony-xm5": sonyColors,
  "mba-13-m2": mbaColors,
  "mbp-16-max": mbpColors,
};

function colorsFor(id: string, category: Category): ColorOption[] | undefined {
  if (colorSets[id]) return colorSets[id]!.map((c) => ({ ...c }));
  if (category === "samsung" && id !== "zfold6" && id !== "zflip6")
    return samsungColors.map((c) => ({ ...c }));
  return undefined;
}

function p(
  id: string,
  name: string,
  category: Category,
  variants: [string, number][],
): Product {
  const colors = colorsFor(id, category);
  const usesColorImage = category !== "gaming" || id === "dualsense";
  return {
    id,
    name,
    category,
    image: usesColorImage && colors?.[0] ? colors[0].image : imageFor(id, category),
    ...(productBadges[id] ? { badge: productBadges[id]! } : {}),
    ...(colors ? { colors } : {}),
    variants: variants.map(([storage, price]) => ({ storage, price })),
  };
}

export const products: Product[] = [
  // iPhone 18
  p("ip18-pro-max", "iPhone 18 Pro Max", "iphone", [["256GB", 604], ["512GB", 712], ["1TB", 909]]),
  p("ip18-pro", "iPhone 18 Pro", "iphone", [["256GB", 570], ["512GB", 670], ["1TB", 869]]),
  p("ip18-plus", "iPhone 18 Plus", "iphone", [["128GB", 519], ["256GB", 569], ["512GB", 659]]),
  p("ip18", "iPhone 18", "iphone", [["128GB", 469], ["256GB", 519], ["512GB", 609]]),
  // iPhone 17
  p("ip17-pro-max", "iPhone 17 Pro Max", "iphone", [["256GB", 649], ["512GB", 749], ["1TB", 869]]),
  p("ip17-pro", "iPhone 17 Pro", "iphone", [["256GB", 579], ["512GB", 679], ["1TB", 799]]),
  p("ip17-air", "iPhone 17 Air", "iphone", [["256GB", 509], ["512GB", 609]]),
  p("ip17", "iPhone 17", "iphone", [["128GB", 419], ["256GB", 469], ["512GB", 559]]),
  // iPhone 16
  p("ip16-pro-max", "iPhone 16 Pro Max", "iphone", [["256GB", 579], ["512GB", 669], ["1TB", 779]]),
  p("ip16-pro", "iPhone 16 Pro", "iphone", [["128GB", 499], ["256GB", 539], ["512GB", 629]]),
  p("ip16-plus", "iPhone 16 Plus", "iphone", [["128GB", 429], ["256GB", 479]]),
  p("ip16", "iPhone 16", "iphone", [["128GB", 379], ["256GB", 429], ["512GB", 509]]),
  // iPhone 15
  p("ip15-pro-max", "iPhone 15 Pro Max", "iphone", [["256GB", 499], ["512GB", 589]]),
  p("ip15-pro", "iPhone 15 Pro", "iphone", [["128GB", 439], ["256GB", 479]]),
  p("ip15-plus", "iPhone 15 Plus", "iphone", [["128GB", 379], ["256GB", 419]]),
  p("ip15", "iPhone 15", "iphone", [["128GB", 329], ["256GB", 369]]),
  // iPhone 14 / 13
  p("ip14-pro-max", "iPhone 14 Pro Max", "iphone", [["128GB", 399], ["256GB", 439]]),
  p("ip14", "iPhone 14", "iphone", [["128GB", 279], ["256GB", 319]]),
  p("ip13", "iPhone 13", "iphone", [["128GB", 229], ["256GB", 259]]),
  // Samsung
  p("s25-ultra", "Galaxy S25 Ultra", "samsung", [["256GB", 549], ["512GB", 629], ["1TB", 729]]),
  p("s25-plus", "Galaxy S25+", "samsung", [["256GB", 449], ["512GB", 519]]),
  p("s25", "Galaxy S25", "samsung", [["128GB", 379], ["256GB", 419]]),
  p("s24-ultra", "Galaxy S24 Ultra", "samsung", [["256GB", 469], ["512GB", 539]]),
  p("zfold6", "Galaxy Z Fold 6", "samsung", [["256GB", 689], ["512GB", 769]]),
  p("zflip6", "Galaxy Z Flip 6", "samsung", [["256GB", 429], ["512GB", 489]]),
  // Gaming
  p("ps5-pro", "PlayStation 5 Pro", "gaming", [["2TB", 289]]),
  p("ps5-slim", "PlayStation 5 Slim", "gaming", [["1TB", 209], ["Digital", 179]]),
  // Audio
  p("airpods-pro-3", "AirPods Pro 3", "audio", [["USB-C", 109]]),
  p("airpods-4-anc", "AirPods 4 (ANC)", "audio", [["USB-C", 79]]),
  p("airpods-4", "AirPods 4", "audio", [["USB-C", 59]]),
  p("airpods-max", "AirPods Max", "audio", [["USB-C", 219]]),
  p("airpods-pro-2", "AirPods Pro 2 (USB-C)", "audio", [["USB-C", 89]]),
  // آيباد واللوحيات
  p("ipad-pro-11", 'iPad Pro (M4) 11"', "tablet", [["256GB", 289], ["512GB", 339], ["1TB", 429]]),
  p("ipad-pro-13", 'iPad Pro (M4) 13"', "tablet", [["256GB", 379], ["512GB", 439], ["1TB", 529]]),
  p("ipad-air-11", 'iPad Air (M2) 11"', "tablet", [["128GB", 239], ["256GB", 279]]),
  p("ipad-air-13", 'iPad Air (M2) 13"', "tablet", [["128GB", 319], ["256GB", 359]]),
  p("ipad-10", "iPad الجيل العاشر", "tablet", [["64GB", 139], ["256GB", 179]]),
  // الساعات الذكية
  p("watch-ultra-2", "Apple Watch Ultra 2", "watch", [
    ["49mm - Trail Loop", 319],
    ["49mm - Alpine Loop", 329],
    ["49mm - Ocean Band", 325],
  ]),
  p("watch-s10", "Apple Watch Series 10", "watch", [
    ["42mm ألمنيوم", 165],
    ["46mm ألمنيوم", 179],
    ["42mm تيتانيوم", 285],
    ["46mm تيتانيوم", 299],
  ]),
  p("watch-s9", "Apple Watch Series 9", "watch", [["41mm", 149], ["45mm", 169]]),
  p("gwatch-ultra", "Galaxy Watch Ultra", "watch", [["47mm", 249]]),
  p("gwatch-7", "Galaxy Watch 7", "watch", [["40mm", 129], ["44mm", 149]]),
  // ماك بوك ولابتوب
  p("mba-13", 'MacBook Air (M3) 13"', "laptop", [["256GB", 409], ["512GB", 479]]),
  p("mba-15", 'MacBook Air (M3) 15"', "laptop", [["256GB", 489], ["512GB", 559]]),
  p("mbp-14", 'MacBook Pro 14"', "laptop", [["512GB", 749], ["1TB", 899]]),
  p("mbp-16", 'MacBook Pro 16"', "laptop", [["512GB", 999], ["1TB", 1149]]),
  // الألعاب
  p("dualsense", "ذراع تحكم DualSense اللاسلكي", "gaming", [["إصدار قياسي", 26]]),
  // الإكسسوارات وحزم الشحن
  p("charger-bundle", "حزمة شاحن سريع + كيبل USB-C مجدول", "accessories", [
    ["20W", 12],
    ["35W", 19],
  ]),
  p("magsafe-battery", "بطارية MagSafe لاسلكية", "accessories", [["5000mAh", 39]]),
  // إضافات جديدة
  p("ipad-mini-6", "iPad mini 6", "tablet", [["64GB", 179], ["256GB", 229]]),
  p("ipad-9", "iPad الجيل التاسع", "tablet", [["64GB", 119], ["256GB", 159]]),
  p("watch-se-2", "Apple Watch SE 2", "watch", [["40mm", 99], ["44mm", 119]]),
  p("gwatch-6-classic", "Galaxy Watch 6 Classic", "watch", [["43mm", 159], ["47mm", 179]]),
  p("sony-xm5", "Sony WH-1000XM5", "audio", [["إصدار قياسي", 139]]),
  p("airpods-3", "AirPods 3", "audio", [["Lightning", 65]]),
  p("mba-13-m2", 'MacBook Air (M2) 13"', "laptop", [["256GB", 349], ["512GB", 419]]),
  p("mbp-16-max", 'MacBook Pro 16" (M3 Max)', "laptop", [["1TB", 1499], ["2TB", 1699]]),
  p("switch-oled", "Nintendo Switch OLED", "gaming", [["64GB", 129]]),
  p("pulse-3d", "سماعة PlayStation Pulse 3D", "gaming", [["إصدار قياسي", 39]]),
  p("controller-charger", "شاحن يدات تحكم مزدوج", "gaming", [["إصدار قياسي", 25]]),
  p("car-charger", "شاحن سيارة سريع USB-C", "accessories", [["45W", 15]]),
  p("magsafe-wallet", "محفظة جلدية MagSafe", "accessories", [["جلد طبيعي", 22]]),
];

export const bhd = (n: number) =>
  `${n.toLocaleString("en-US", { minimumFractionDigits: 3, maximumFractionDigits: 3 })} د.ب`;

// ===== المواصفات والوصف لكل فئة/موديل =====

export type ProductSpecs = {
  overview: string;
  specs: { label: string; text: string }[];
};

const boxWarranty: { label: string; text: string }[] = [
  { label: "التغليف", text: "الجهاز الأصلي بتغليف المصنع وسدادة الأمان الرسمية." },
  { label: "الملحقات", text: "الملحقات الأصلية كاملة." },
  { label: "الضمان", text: "ضمان رسمي معتمد لمدة سنة كاملة في مملكة البحرين." },
];

const iphoneProSpecs: ProductSpecs = {
  overview: "أحدث إصدارات آبل بتصميم التيتانيوم الفاخر وأقوى معالجات السلسلة الاحترافية.",
  specs: [
    { label: "الشاشة", text: "شاشة Super Retina XDR مع ProMotion 120Hz وسطوع فائق تحت الشمس." },
    { label: "المعالج", text: "معالجات آبل المتطورة A-Series Pro مع دعم تقنيات الذكاء الاصطناعي الفائق." },
    { label: "الكاميرا", text: "نظام كاميرات احترافي بدقة 48 ميجابكسل مع تقريب بصري فائق وتصوير سينمائي 4K." },
    { label: "البطارية", text: "بطارية تدوم طوال اليوم مع دعم الشحن السريع والشحن اللاسلكي MagSafe ومنفذ Type-C." },
  ],
};

const iphoneAirSpecs: ProductSpecs = {
  overview: "أنحف وأخف آيفون في تاريخ آبل بتصميم ثوري فائق النحافة والأناقة.",
  specs: [
    { label: "الشاشة", text: "شاشة 6.5 إنش Super Retina XDR بانسيابية فائقة وحواف نحيفة جداً." },
    { label: "المعالج", text: "معالج A19 المتطور لأداء فائق مع توفير استثنائي للطاقة." },
    { label: "التصميم والكاميرا", text: "كاميرا Fusion متطورة 48 ميجابكسل مدمجة في جسم تيتانيوم فائق الرشاقة." },
    { label: "البطارية", text: "بطارية ذكية تدعم الشحن السريع اللاسلكي MagSafe ومنفذ Type-C." },
  ],
};

const iphoneStdSpecs: ProductSpecs = {
  overview: "التوازن المثالي بين القوة والأناقة مع أحدث ألوان العصر والذكاء الاصطناعي.",
  specs: [
    { label: "الشاشة", text: "شاشة Super Retina XDR ساطعة بألوان نابضة بالحياة." },
    { label: "المعالج", text: "معالج آبل القوي مع دعم زر التحكم بالكاميرا (Camera Control)." },
    { label: "الكاميرا", text: "نظام كاميرات مزدوج متطور 48 ميجابكسل يدعم الصور المكانية والفائقة الاتساع." },
  ],
};

const samsungSpecs: ProductSpecs = {
  overview: "قمة هواتف الأندرويد بشاشات ديناميكية مبتكرة ومزايا Galaxy AI المتطورة.",
  specs: [
    { label: "الشاشة", text: "Dynamic AMOLED 2X فائقة الدقة والسطوع مع حماية Armor Glass." },
    { label: "المعالج", text: "معالج Snapdragon 8 Gen الفائق لأداء ألعاب وإنتاجية سلس للغاية." },
    { label: "المزايا", text: "دعم القلم الذكي S-Pen (للألترا) والتصميم القابل للطي المتين (للفولد والفليب)." },
  ],
};

const audioSpecs: ProductSpecs = {
  overview: "تجربة استماع فاخرة مع صوت نقي ومحيطي وتصميم مريح للارتداء اليومي.",
  specs: [
    {
      label: "المواصفات",
      text: "ميزة عزل الضوضاء النشط الاحترافي (ANC)، وضع شفافية الصوت، صوت مكاني مخصص مع تتبع ديناميكي للرأس، وبطارية استماع طويلة.",
    },
  ],
};

const airpodsPro3Specs: ProductSpecs = {
  overview: "الجيل الأحدث من سماعات الأذن اللاسلكية الاحترافية مع راحة استثنائية وثبات تام.",
  specs: [
    {
      label: "المواصفات",
      text: "الجيل المطور من عزل الضوضاء النشط (ANC)، مقاومة الماء والعرق، علبة شحن ذكية تدعم تحديد الموقع وسماعة مدمجة، ومنفذ Type-C.",
    },
  ],
};

const gamingSpecs: ProductSpecs = {
  overview: "منصة ألعاب سوني الترفيهية الفاخرة لعيش أقوى التجارب التفاعلية.",
  specs: [
    {
      label: "المواصفات",
      text: "دعم تشغيل الألعاب بدقة 4K حتى 120 إطاراً في الثانية، تقنية تتبع الأشعة (Ray Tracing)، وسيط تخزين SSD فائق السرعة، مع ذراع التحكم اللاسلكي DualSense.",
    },
  ],
};

const tabletSpecs: ProductSpecs = {
  overview: "أجهزة آيباد بشاشات فاخرة وأداء احترافي للعمل والترفيه والإبداع.",
  specs: [
    { label: "الشاشة", text: "شاشة Liquid Retina عالية الدقة بألوان واسعة وسطوع ممتاز." },
    { label: "المعالج", text: "معالجات آبل من فئة M لأداء فائق في التطبيقات الاحترافية." },
    { label: "المزايا", text: "دعم قلم Apple Pencil ولوحات المفاتيح الذكية، وكاميرا أمامية بزاوية واسعة." },
  ],
};

const watchSpecs: ProductSpecs = {
  overview: "ساعات ذكية فاخرة لمتابعة الصحة واللياقة والإشعارات بأناقة يومية.",
  specs: [
    { label: "الشاشة", text: "شاشة Always-On عالية السطوع وواضحة تحت الشمس." },
    { label: "الصحة", text: "قياس معدل النبض والأكسجين وتخطيط القلب وتتبع النوم والتمارين." },
    { label: "المتانة", text: "هيكل متين مقاوم للماء مع بطارية تدوم طويلاً وشحن سريع." },
  ],
};

const laptopSpecs: ProductSpecs = {
  overview: "أجهزة ماك بوك بأداء استثنائي وعمر بطارية طويل وتصميم نحيف فاخر.",
  specs: [
    { label: "المعالج", text: "شرائح Apple Silicon بمعمارية موفرة للطاقة وأداء عالي." },
    { label: "الشاشة", text: "شاشة Liquid Retina بدقة عالية وألوان دقيقة." },
    { label: "البطارية", text: "عمر بطارية يصل إلى يوم كامل من العمل مع شحن سريع." },
  ],
};

const accessorySpecs: ProductSpecs = {
  overview: "ملحقات وشواحن أصلية تحافظ على أداء جهازك وسلامة بطاريته.",
  specs: [
    { label: "المواصفات", text: "شحن سريع آمن مع حماية من الحرارة الزائدة وتوافق كامل مع الأجهزة الحديثة." },
  ],
};

export function specsFor(p: Product): ProductSpecs {
  if (p.category === "samsung") return samsungSpecs;
  if (p.category === "gaming") return gamingSpecs;
  if (p.category === "tablet") return tabletSpecs;
  if (p.category === "watch") return watchSpecs;
  if (p.category === "laptop") return laptopSpecs;
  if (p.category === "accessories") return accessorySpecs;
  if (p.category === "audio") return p.id === "airpods-pro-3" ? airpodsPro3Specs : audioSpecs;
  // iphone
  if (p.id === "ip17-air") return iphoneAirSpecs;
  if (p.id.includes("pro")) return iphoneProSpecs;
  return iphoneStdSpecs;
}

export const boxAndWarranty = boxWarranty;
