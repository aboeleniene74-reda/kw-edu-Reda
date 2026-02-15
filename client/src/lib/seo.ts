/**
 * SEO Helper Functions
 * إدارة meta tags و SEO للصفحات - محسّن لعمليات البحث في الكويت
 */

interface SEOConfig {
  title: string;
  description: string;
  keywords?: string[];
  ogImage?: string;
  ogType?: string;
  canonical?: string;
}

const SITE_NAME = "مذكرة و مدرس";
const LOGO_URL = "https://files.manuscdn.com/user_upload_by_module/session_file/310519663268166641/tHLPNnKQWHaTsRgR.png";

export function updateSEO(config: SEOConfig) {
  // Update title - format: Page Title | Site Name
  document.title = `${config.title} | ${SITE_NAME}`;

  // Update or create meta tags
  updateMetaTag("description", config.description);
  
  if (config.keywords && config.keywords.length > 0) {
    updateMetaTag("keywords", config.keywords.join(", "));
  }

  // Open Graph tags
  updateMetaTag("og:title", `${config.title} | ${SITE_NAME}`, "property");
  updateMetaTag("og:description", config.description, "property");
  updateMetaTag("og:type", config.ogType || "website", "property");
  updateMetaTag("og:site_name", SITE_NAME, "property");
  updateMetaTag("og:locale", "ar_KW", "property");
  updateMetaTag("og:image", config.ogImage || LOGO_URL, "property");
  updateMetaTag("og:image:alt", config.title, "property");

  // Geographic targeting for Kuwait
  updateMetaTag("geo.region", "KW");
  updateMetaTag("geo.placename", "الكويت");
  updateMetaTag("geo.position", "29.3759;47.9774");
  updateMetaTag("ICBM", "29.3759, 47.9774");
  
  // Language and region
  updateMetaTag("language", "Arabic");
  updateMetaTag("content-language", "ar-KW");
  
  // Twitter Card tags
  updateMetaTag("twitter:card", "summary_large_image");
  updateMetaTag("twitter:title", `${config.title} | ${SITE_NAME}`);
  updateMetaTag("twitter:description", config.description);
  updateMetaTag("twitter:image", config.ogImage || LOGO_URL);

  // Canonical URL
  if (config.canonical) {
    updateLinkTag("canonical", config.canonical);
  }
}

function updateMetaTag(name: string, content: string, attribute: string = "name") {
  let element = document.querySelector(`meta[${attribute}="${name}"]`);
  
  if (!element) {
    element = document.createElement("meta");
    element.setAttribute(attribute, name);
    document.head.appendChild(element);
  }
  
  element.setAttribute("content", content);
}

function updateLinkTag(rel: string, href: string) {
  let element = document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement;
  
  if (!element) {
    element = document.createElement("link");
    element.setAttribute("rel", rel);
    document.head.appendChild(element);
  }
  
  element.href = href;
}

// ===== الكلمات المفتاحية الأساسية =====
// كلمات مفتاحية مخصصة من صاحب الموقع - تستهدف عمليات البحث في الكويت

const CORE_KEYWORDS = [
  // العلامة التجارية
  "مذكرة ومدرس",
  "مذكرة و مدرس",
  "مدرس كيمياء - أحياء - جيولوجيا",
  "فارس العلوم",
  "سهم التفوق",
  "مذكرات المرشد",
  "الساحر",
  "ساحر العلوم",
  "مذكرات علا",

  // مذكرة الزبدة
  "مذكرة الزبدة جيولوجيا",
  "ملخص الزبدة جيولوجيا",
  "مذكرة الزبدة أحياء 11 الفصل الثاني",
  "مذكرة الزبدة أحياء الفصل الأول",
  "مذكرة الزبدة كيمياء 11 الفصل الأول",
  "مذكرة الزبدة كيمياء 11 الفصل الثاني",
  "مذكرة الزبدة أحياء 10 الفصل الأول",
  "مذكرة الزبدة أحياء 10 الفصل الثاني",
  "مذكرة الزبدة كيمياء 10 الفصل الأول",
  "مذكرة الزبدة كيمياء 10 الفصل الثاني",

  // مدرس خصوصي وحضوري
  "مدرس جيولوجيا خصوصي بالكويت",
  "مدرس جيولوجيا حضوري بالكويت",
  "مدرس كيمياء خصوصي بالكويت",
  "مدرس كيمياء حضوري بالكويت",
  "مدرس أحياء خصوصي بالكويت",
  "مدرس أحياء حضوري بالكويت",
  "أفضل مدرس جيولوجيا بالكويت",
  "أفضل مدرس أحياء بالكويت",
  "أفضل مدرس كيمياء بالكويت",

  // بنك أسئلة
  "بنك أسئلة كيمياء 11 الفصل الثاني الكويت",
  "بنك أسئلة كيمياء 11 الفصل الاول",
  "بنك أسئلة أحياء 11 الفصل الأول",
  "بنك أسئلة أحياء 11 الفصل الثاني",
  "بنك أسئلة احياء 10 الفصل الاول",
  "بنك اسئلة احياء 10 الفصل الثاني",
  "بنك أسئلة كيمياء 10 الفصل الاول",
  "بنك أسئلة كيمياء 10 الفصل الثاني",

  // نماذج اختبارات
  "نماذج اختبارات سابقة محلولة",
  "نماذج اختبارات سابقه",
  "أفضل مذكرات ثانوي مذكره ومدرس",

  // حسب الصف والفصل
  "صف 10 الفصل الاول",
  "صف 10 الفصل الثاني",
  "صف 11 الفصل الاول",
  "صف 11 الفصل الثاني",
];

// Default SEO config for home page
export const defaultSEO: SEOConfig = {
  title: "مدرس كيمياء - أحياء - جيولوجيا | مذكرات ثانوي الكويت",
  description: "مذكرة و مدرس - مدرس كيمياء - أحياء - جيولوجيا. مذكرة الزبدة، بنك أسئلة، نماذج اختبارات سابقة محلولة. مدرس خصوصي وحضوري بالكويت للصف العاشر والحادي عشر. إعداد فارس العلوم ☎ 99457080",
  keywords: CORE_KEYWORDS,
  ogType: "website"
};

// SEO configs for different pages
export const pageSEO = {
  about: {
    title: "من نحن - فارس العلوم",
    description: "مذكرة و مدرس - مدرس كيمياء - أحياء - جيولوجيا. أفضل مدرس كيمياء وأحياء وجيولوجيا خصوصي وحضوري بالكويت. مذكرة الزبدة، سهم التفوق، مذكرات المرشد. إعداد فارس العلوم",
    keywords: [
      "فارس العلوم",
      "مذكرة و مدرس",
      "أفضل مدرس كيمياء بالكويت",
      "أفضل مدرس أحياء بالكويت",
      "أفضل مدرس جيولوجيا بالكويت",
      "مدرس كيمياء خصوصي بالكويت",
      "مدرس أحياء خصوصي بالكويت",
      "مدرس جيولوجيا خصوصي بالكويت",
      "سهم التفوق",
      "مذكرات المرشد",
      "ساحر العلوم",
    ]
  },
  
  privacy: {
    title: "سياسة الخصوصية",
    description: "سياسة الخصوصية وحماية البيانات في مذكرة و مدرس - نلتزم بحماية معلوماتك الشخصية وفقاً لأعلى معايير الأمان",
    keywords: ["سياسة الخصوصية", "حماية البيانات", "مذكرة و مدرس"]
  },
  
  terms: {
    title: "شروط الاستخدام",
    description: "شروط وأحكام استخدام مذكرة و مدرس - اقرأ الشروط والأحكام قبل استخدام المنصة التعليمية",
    keywords: ["شروط الاستخدام", "أحكام الاستخدام", "مذكرة و مدرس"]
  },
  
  sessions: {
    title: "حصص دراسية خصوصي وحضوري بالكويت",
    description: "مدرس كيمياء خصوصي بالكويت، مدرس أحياء حضوري بالكويت، مدرس جيولوجيا خصوصي بالكويت. احجز حصتك مع فارس العلوم - أفضل مدرس كيمياء وأحياء وجيولوجيا بالكويت ☎ 99457080",
    keywords: [
      "مدرس كيمياء خصوصي بالكويت",
      "مدرس كيمياء حضوري بالكويت",
      "مدرس أحياء خصوصي بالكويت",
      "مدرس أحياء حضوري بالكويت",
      "مدرس جيولوجيا خصوصي بالكويت",
      "مدرس جيولوجيا حضوري بالكويت",
      "أفضل مدرس كيمياء بالكويت",
      "أفضل مدرس أحياء بالكويت",
      "أفضل مدرس جيولوجيا بالكويت",
      "فارس العلوم",
      "مذكرة و مدرس",
    ]
  },

  faq: {
    title: "الأسئلة الشائعة",
    description: "الأسئلة الشائعة حول مذكرة و مدرس - مذكرة الزبدة، بنك أسئلة، نماذج اختبارات سابقة، مدرس خصوصي وحضوري بالكويت. فارس العلوم ☎ 99457080",
    keywords: [
      "مذكرة و مدرس",
      "فارس العلوم",
      "مذكرة الزبدة",
      "نماذج اختبارات سابقة محلولة",
      "أفضل مذكرات ثانوي مذكره ومدرس",
    ]
  },
};

// Dynamic SEO for grade pages
export function getGradeSEO(gradeName: string): SEOConfig {
  return {
    title: `مذكرات ${gradeName} في الكويت`,
    description: `مذكرة الزبدة، بنك أسئلة، نماذج اختبارات سابقة محلولة - ${gradeName} في الكويت. مدرس كيمياء وأحياء وجيولوجيا خصوصي وحضوري. إعداد فارس العلوم ☎ 99457080`,
    keywords: [
      `مذكرة الزبدة ${gradeName}`,
      `بنك أسئلة ${gradeName} الكويت`,
      `نماذج اختبارات ${gradeName} الكويت`,
      `مذكرات ${gradeName} الكويت`,
      "مذكرة و مدرس",
      "فارس العلوم",
      "أفضل مذكرات ثانوي مذكره ومدرس",
      "سهم التفوق",
      "مذكرات المرشد",
    ]
  };
}

// Dynamic SEO for subject pages
export function getSubjectSEO(subjectName: string, gradeName: string, semesterName: string): SEOConfig {
  return {
    title: `مذكرات ${subjectName} - ${gradeName} - ${semesterName}`,
    description: `مذكرة الزبدة ${subjectName} ${gradeName} ${semesterName}، بنك أسئلة ${subjectName}، نماذج اختبارات سابقة محلولة. مدرس ${subjectName} خصوصي وحضوري بالكويت. إعداد فارس العلوم ☎ 99457080`,
    keywords: [
      `مذكرة الزبدة ${subjectName} ${gradeName}`,
      `بنك أسئلة ${subjectName} ${gradeName} الكويت`,
      `نماذج اختبارات ${subjectName} ${gradeName}`,
      `مدرس ${subjectName} خصوصي بالكويت`,
      `مدرس ${subjectName} حضوري بالكويت`,
      `أفضل مدرس ${subjectName} بالكويت`,
      "مذكرة و مدرس",
      "فارس العلوم",
      "سهم التفوق",
    ]
  };
}

// Dynamic SEO for category content pages
export function getCategorySEO(categoryName: string, subjectName: string, gradeName: string): SEOConfig {
  return {
    title: `${categoryName} - ${subjectName} - ${gradeName}`,
    description: `${categoryName} مادة ${subjectName} ${gradeName} في الكويت - مذكرة الزبدة، بنك أسئلة، نماذج اختبارات سابقة محلولة. تحميل ومعاينة مجاناً. إعداد فارس العلوم ☎ 99457080`,
    keywords: [
      `${categoryName} ${subjectName} ${gradeName} الكويت`,
      `مذكرة الزبدة ${subjectName}`,
      `بنك أسئلة ${subjectName} الكويت`,
      `نماذج اختبارات ${subjectName}`,
      "مذكرة و مدرس",
      "فارس العلوم",
      "أفضل مذكرات ثانوي مذكره ومدرس",
    ]
  };
}

// Dynamic SEO for semester pages
export function getSemesterSEO(gradeName: string, semesterName: string): SEOConfig {
  return {
    title: `مذكرات ${gradeName} - ${semesterName} في الكويت`,
    description: `مذكرة الزبدة، بنك أسئلة، نماذج اختبارات سابقة محلولة - ${gradeName} ${semesterName} في الكويت. مدرس كيمياء وأحياء وجيولوجيا خصوصي وحضوري. إعداد فارس العلوم ☎ 99457080`,
    keywords: [
      `مذكرات ${gradeName} ${semesterName} الكويت`,
      `مذكرة الزبدة ${gradeName} ${semesterName}`,
      `بنك أسئلة ${gradeName} ${semesterName}`,
      `نماذج اختبارات ${gradeName} ${semesterName}`,
      "مذكرة و مدرس",
      "فارس العلوم",
      "سهم التفوق",
    ]
  };
}
