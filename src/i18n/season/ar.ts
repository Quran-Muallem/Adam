import type { ExtraTexts } from '../types';

// Saison & Feste, Live-Code-Editor, kurze Labels (ar)
export const seasonAr: ExtraTexts = {
  season: {
    names: {"normal": "عادي", "spring": "الربيع", "summer": "الصيف", "autumn": "الخريف", "winter": "الشتاء", "halloween": "الهالوين", "christmas": "عيد الميلاد", "newyear": "رأس السنة", "easter": "عيد الفصح", "ramadan": "رمضان", "eidFitr": "عيد الفطر", "eidAdha": "عيد الأضحى"},
    banner: {"ramadan": "فعالية رمضان · اجمع التمر!", "eidFitr": "عيد مبارك! عيد فطر سعيد!", "eidAdha": "عيد مبارك! عيد أضحى سعيد!", "halloween": "أسبوع الهالوين · اجمع اليقطين!", "christmas": "عيد ميلاد سعيد · اجمع الهدايا!", "newyear": "سنة جديدة سعيدة!", "easter": "فصح سعيد · اجمع البيض!"},
    regions: {"auto": "تلقائي (منطقتي)", "islamic": "الأعياد الإسلامية", "european": "الأعياد الأوروبية", "world": "مواطن عالمي (كل الأعياد)"},
    regionTitle: "الأعياد والمنطقة",
    previewTitle: "معاينة المواسم",
    previewLive: (n) => `التقويم: ${n}`,
    doubleWheel: "يوم عيد: نجوم مضاعفة!",
    festBadges: "شارات الأعياد",
  },
  editor: {
    tab: "كود مباشر",
    hint: "اكتب الكود بنفسك – أو استخدم الكتل.",
    unknown: (l, w, s) => (s ? `في السطر ${l} لا أعرف «${w}» – هل تقصد «${s}»؟` : `في السطر ${l} لا أعرف «${w}».`),
    syntax: (l) => `السطر ${l}: لم أفهم تمامًا. تحقّق من الأقواس والنقطتين.`,
    notAllowed: (l, w) => `السطر ${l}: «${w}» غير متاح في هذا المستوى بعد.`,
    tooMany: (n, m) => `هذه ${n} كتل – المسموح ${m}.`,
    indent: (l) => `السطر ${l}: المسافة البادئة غير صحيحة.`,
    number: (l) => `السطر ${l}: ينقص رقم، مثل range(3).`,
    applied: "تم تطبيق الكود ✓",
    reload: "إعادة التحميل من الكتل",
  },
  home2: {"costumes": "الأزياء", "knowledge": "المعرفة", "trophies": "الكؤوس", "gift": "هدية", "play": "العب", "level": "المستوى"},
};
