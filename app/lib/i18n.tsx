"use client";

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { Locale } from "./anatomy-data";

/** Renders a count in Eastern Arabic-Indic numerals, matching the digits used
 *  throughout the Arabic organ data (e.g. "٢٥٠–٣٥٠ غراماً"). */
function arabicDigits(n: number) {
  return n.toLocaleString("ar-EG");
}

/** Arabic noun-count agreement for "organ" (عضو): dual and 3–10 take the
 *  plural form, 11+ reverts to singular-with-number per standard usage. */
function arabicOrganCount(n: number) {
  if (n === 0) return "لا أعضاء";
  if (n === 1) return "عضو واحد";
  if (n === 2) return "عضوان";
  if (n >= 3 && n <= 10) return `${arabicDigits(n)} أعضاء`;
  return `${arabicDigits(n)} عضواً`;
}

const en = {
  dir: "ltr" as "ltr" | "rtl",
  brandName: "Organ Guide",
  brandMark: "✦",
  brandHome: "Organ Guide home",
  tagline: "Learn anatomy like an artist",
  nav: { explore: "Explore", systems: "Systems", lessons: "Lessons", library: "Library", notes: "Notes" },
  searchPlaceholder: "Search organs, topics…",
  profileInitials: "OG",
  openLearnerProfile: "Open learner profile",
  openLibrary: "Open organ library",
  closeLibrary: "Close library",
  savedOrgans: "Saved organs",
  organLibrary: "Organ library",
  viewAll: "View all organs",
  curiosity: { line1: "Learning is", line2: "an act of curiosity.", sub: "Keep exploring!" },
  theOrgan: (name: string) => `The ${name}`,
  keyFacts: "Key facts",
  facts: { size: "Size", weight: "Weight", daily: "Daily", location: "Location", bloodSupply: "Blood supply", function: "Function" },
  medicalImportance: "Medical importance",
  didYouKnow: "Did you know",
  viewLesson: "View lesson",
  animate: "Animate",
  quiz: "Quiz",
  compare: "Compare",
  comparing: "Comparing",
  reference: "Reference",
  primaryRole: "Primary role",
  scale: "Scale",
  closeComparison: "Close comparison",
  microscopicView: "Microscopic view",
  exploreTissue: "Explore tissue",
  compareOrgans: "Compare organs",
  openComparison: "Open comparison",
  functionAnimation: "Function animation",
  playFunctionAnimation: (name: string) => `Play the ${name.toLowerCase()} function animation`,
  playAnimation: "Play animation",
  clinicalNotes: "Clinical notes",
  commonConditions: "Common conditions",
  seeAll: "See all",
  whereItWorks: "Where it works",
  seeInBody: (name: string) => `See where the ${name.toLowerCase()} sits in the body`,
  seeSystem: "See the system",
  learningResources: (name: string) => `${name} learning resources`,
  organThumbnail: (name: string) => `${name} thumbnail`,
  organIllustration: (name: string) => `${name} anatomical illustration`,
  microscopicAlt: (name: string) => `${name} microscopic tissue view`,
  comparisonAlt: (label: string) => `${label} anatomical comparison`,
  close: "Close",
  guidedDiscovery: "Guided discovery",
  modalTitles: {
    quiz: (name: string) => `${name} quick quiz`,
    animation: (name: string) => `${name} in motion`,
    system: (name: string) => `${name} in the body`,
    lesson: (name: string) => `Inside the ${name.toLowerCase()}`,
  },
  quizQuestion: (name: string) => `Which statement best describes the ${name.toLowerCase()}?`,
  quizOptions: [
    "It plays a specialized role in maintaining the body",
    "It works completely independently",
    "It is active only during sleep",
  ],
  continueExploring: "Continue exploring",
  systemLabel: "System",
  systemTrace: (location: string, name: string) => `${location}. Trace how the ${name.toLowerCase()} connects to the rest of the body.`,
  systemFigureAlt: (name: string, system: string) => `${name} shown in place within the ${system.toLowerCase()}`,
  lessonBody: "Follow the highlighted structures, rotate the specimen, and connect form with function. This short study moment is designed to build a durable mental model.",
  lessonIllustrationAlt: (name: string) => `${name} illustration`,
  viewer: {
    ariaLabel: (name: string) => `${name} interactive viewer`,
    toolsAriaLabel: "3D viewer tools",
    tools: { rotate: "Rotate", zoom: "Zoom", isolate: "Isolate", section: "Cross-section", layers: "Layers", compare: "Compare", reset: "Reset" },
    tipAriaLabel: "Viewer instructions",
    tip: "Tip",
    tipBody: ["Drag to rotate", "Scroll to zoom", "Click a dot to learn more"],
    preparing: (name: string) => `Preparing the ${name.toLowerCase()}`,
    autoRotate: "Auto rotate",
    caption: "3D specimen · click a dot to explore",
  },
  langSwitchLabel: "العربية",
  langSwitchAria: "Switch to Arabic",
  sections: {
    systems: {
      title: "Body systems",
      subtitle: "Every organ belongs to a system — explore them grouped by how the body organises itself.",
      organCount: (n: number) => `${n} ${n === 1 ? "organ" : "organs"}`,
    },
    lessons: {
      title: "Lessons",
      subtitle: "One guided lesson per organ. Open a lesson to study it — your progress is saved on this device.",
      progress: (done: number, total: number) => `${done} of ${total} lessons complete`,
      start: "Start lesson",
      review: "Review lesson",
      completed: "Completed",
    },
    library: {
      title: "Organ library",
      subtitle: "The full illustrated reference — every organ, one card each.",
      searchPlaceholder: "Filter the library…",
      viewIn3d: "View in 3D",
      empty: "No organs match your search.",
    },
    notes: {
      title: "My notes",
      subtitle: "Jot down what you want to remember about each organ — notes are saved on this device.",
      organLabel: "Organ",
      placeholder: "Write a note…",
      save: "Save note",
      empty: "No notes yet — write your first one above.",
      delete: "Delete note",
      savedOn: "Saved",
      countLabel: (n: number) => `${n} saved ${n === 1 ? "note" : "notes"}`,
    },
  },
  contact: {
    email: "Email",
    phone: "Phone",
    linkedin: "LinkedIn",
    whatsapp: "WhatsApp",
  },
  profileMenu: {
    title: "Your learning",
    lessonsLabel: "Lessons",
    lessonsProgress: (done: number, total: number) => `${done} of ${total} complete`,
    notesLabel: "Notes",
    notesCount: (n: number) => `${n} saved ${n === 1 ? "note" : "notes"}`,
    goToLessons: "Go to lessons",
    goToNotes: "Go to notes",
    reset: "Clear saved progress",
    resetConfirm: "Clear all saved lesson progress and notes on this device? This can't be undone.",
  },
};

const ar: typeof en = {
  dir: "rtl",
  brandName: "دليل الأعضاء",
  brandMark: "✦",
  brandHome: "الصفحة الرئيسية لدليل الأعضاء",
  tagline: "تعلّم علم التشريح كفنان",
  nav: { explore: "استكشاف", systems: "الأجهزة", lessons: "دروس", library: "المكتبة", notes: "ملاحظات" },
  searchPlaceholder: "ابحث عن عضو أو موضوع…",
  profileInitials: "د أ",
  openLearnerProfile: "فتح الملف الشخصي للمتعلم",
  openLibrary: "فتح مكتبة الأعضاء",
  closeLibrary: "إغلاق المكتبة",
  savedOrgans: "الأعضاء المحفوظة",
  organLibrary: "مكتبة الأعضاء",
  viewAll: "عرض جميع الأعضاء",
  curiosity: { line1: "التعلّم هو", line2: "فعلُ فضول.", sub: "واصل الاستكشاف!" },
  theOrgan: (name: string) => name,
  keyFacts: "حقائق أساسية",
  facts: { size: "الحجم", weight: "الوزن", daily: "يومياً", location: "الموقع", bloodSupply: "التروية الدموية", function: "الوظيفة" },
  medicalImportance: "الأهمية الطبية",
  didYouKnow: "هل تعلم",
  viewLesson: "عرض الدرس",
  animate: "تحريك",
  quiz: "اختبار",
  compare: "مقارنة",
  comparing: "مقارنة",
  reference: "المرجع",
  primaryRole: "الدور الأساسي",
  scale: "الحجم",
  closeComparison: "إغلاق المقارنة",
  microscopicView: "منظر مجهري",
  exploreTissue: "استكشاف النسيج",
  compareOrgans: "مقارنة الأعضاء",
  openComparison: "فتح المقارنة",
  functionAnimation: "رسوم الوظيفة المتحركة",
  playFunctionAnimation: (name: string) => `تشغيل الرسوم المتحركة لوظيفة ${name}`,
  playAnimation: "تشغيل الرسوم المتحركة",
  clinicalNotes: "ملاحظات سريرية",
  commonConditions: "الحالات الشائعة",
  seeAll: "عرض الكل",
  whereItWorks: "أين يعمل",
  seeInBody: (name: string) => `مكان ${name} داخل الجسم`,
  seeSystem: "عرض الجهاز",
  learningResources: (name: string) => `موارد تعليمية عن ${name}`,
  organThumbnail: (name: string) => `صورة مصغّرة لـ${name}`,
  organIllustration: (name: string) => `رسم تشريحي لـ${name}`,
  microscopicAlt: (name: string) => `منظر مجهري لنسيج ${name}`,
  comparisonAlt: (label: string) => `مقارنة تشريحية: ${label}`,
  close: "إغلاق",
  guidedDiscovery: "اكتشاف موجَّه",
  modalTitles: {
    quiz: (name: string) => `اختبار سريع عن ${name}`,
    animation: (name: string) => `${name} في حركة`,
    system: (name: string) => `${name} داخل الجسم`,
    lesson: (name: string) => `داخل ${name}`,
  },
  quizQuestion: (name: string) => `أي عبارة تصف ${name} بشكل أفضل؟`,
  quizOptions: [
    "يؤدي دوراً متخصصاً في الحفاظ على الجسم",
    "يعمل بشكل مستقل تماماً",
    "ينشط فقط أثناء النوم",
  ],
  continueExploring: "متابعة الاستكشاف",
  systemLabel: "الجهاز",
  systemTrace: (location: string, name: string) => `${location}. تتبّع كيف يتصل ${name} ببقية أعضاء الجسم.`,
  systemFigureAlt: (name: string, system: string) => `${name} في موضعه ضمن ${system}`,
  lessonBody: "تتبّع البنى المميّزة، وأدر العيّنة، واربط الشكل بالوظيفة. لحظة الدراسة القصيرة هذه مصمَّمة لبناء نموذج ذهني راسخ.",
  lessonIllustrationAlt: (name: string) => `رسم توضيحي لـ${name}`,
  viewer: {
    ariaLabel: (name: string) => `عارض ثلاثي الأبعاد تفاعلي لـ${name}`,
    toolsAriaLabel: "أدوات العارض ثلاثي الأبعاد",
    tools: { rotate: "تدوير", zoom: "تكبير", isolate: "عزل", section: "مقطع عرضي", layers: "طبقات", compare: "مقارنة", reset: "إعادة ضبط" },
    tipAriaLabel: "تعليمات العارض",
    tip: "نصيحة",
    tipBody: ["اسحب للتدوير", "مرّر للتكبير", "انقر نقطة لمعرفة المزيد"],
    preparing: (name: string) => `يتم تجهيز ${name}`,
    autoRotate: "دوران تلقائي",
    caption: "عيّنة ثلاثية الأبعاد · انقر نقطة للاستكشاف",
  },
  langSwitchLabel: "English",
  langSwitchAria: "التبديل إلى الإنجليزية",
  sections: {
    systems: {
      title: "أجهزة الجسم",
      subtitle: "كل عضو ينتمي إلى جهاز — استكشف الأعضاء مجمّعة حسب الجهاز الذي تنتمي إليه.",
      organCount: arabicOrganCount,
    },
    lessons: {
      title: "الدروس",
      subtitle: "درس موجَّه واحد لكل عضو. افتح درساً لدراسته — يُحفَظ تقدّمك على هذا الجهاز.",
      progress: (done: number, total: number) => `اكتمل ${arabicDigits(done)} من ${arabicDigits(total)} دروس`,
      start: "ابدأ الدرس",
      review: "مراجعة الدرس",
      completed: "مكتمل",
    },
    library: {
      title: "مكتبة الأعضاء",
      subtitle: "المرجع التوضيحي الكامل — كل عضو في بطاقة مستقلة.",
      searchPlaceholder: "تصفية المكتبة…",
      viewIn3d: "عرض ثلاثي الأبعاد",
      empty: "لا توجد أعضاء مطابقة لبحثك.",
    },
    notes: {
      title: "ملاحظاتي",
      subtitle: "دوّن ما تريد تذكّره عن كل عضو — تُحفظ الملاحظات على هذا الجهاز.",
      organLabel: "العضو",
      placeholder: "اكتب ملاحظة…",
      save: "حفظ الملاحظة",
      empty: "لا توجد ملاحظات بعد — اكتب أول ملاحظة أعلاه.",
      delete: "حذف الملاحظة",
      savedOn: "حُفظت في",
      countLabel: (n: number) => `${arabicDigits(n)} ${n === 1 ? "ملاحظة محفوظة" : "ملاحظات محفوظة"}`,
    },
  },
  contact: {
    email: "البريد الإلكتروني",
    phone: "الهاتف",
    linkedin: "لينكدإن",
    whatsapp: "واتساب",
  },
  profileMenu: {
    title: "تعلّمك",
    lessonsLabel: "الدروس",
    lessonsProgress: (done: number, total: number) => `اكتمل ${arabicDigits(done)} من ${arabicDigits(total)}`,
    notesLabel: "الملاحظات",
    notesCount: (n: number) => `${arabicDigits(n)} ${n === 1 ? "ملاحظة محفوظة" : "ملاحظات محفوظة"}`,
    goToLessons: "الذهاب إلى الدروس",
    goToNotes: "الذهاب إلى الملاحظات",
    reset: "مسح التقدم المحفوظ",
    resetConfirm: "هل تريد مسح كل تقدم الدروس والملاحظات المحفوظة على هذا الجهاز؟ لا يمكن التراجع عن هذا.",
  },
};

export const dictionaries: Record<Locale, typeof en> = { en, ar };

type I18nContextValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: typeof en;
  dir: "ltr" | "rtl";
};

const I18nContext = createContext<I18nContextValue | null>(null);

// Locale starts as English on every load, matching the server-rendered HTML —
// restoring a saved locale from localStorage before first paint would make
// the client's initial render diverge from the server's for the entire page
// (every string on the page is locale-dependent, not just a CSS class), so
// the switch stays a same-session, explicit choice via the visible toggle.
export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>("en");

  const t = dictionaries[locale];
  const dir = t.dir;

  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = dir;
    document.documentElement.setAttribute("data-theme", locale);
  }, [locale, dir]);

  const value = useMemo(() => ({ locale, setLocale, t, dir }), [locale, t, dir]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) throw new Error("useI18n must be used within I18nProvider");
  return context;
}

/** Lowercases only for languages that use case; Arabic text passes through unchanged. */
export function lowerFor(locale: Locale, text: string) {
  return locale === "en" ? text.toLowerCase() : text;
}
