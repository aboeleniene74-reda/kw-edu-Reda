import { describe, it, expect } from "vitest";

/**
 * SEO Configuration Tests
 * يتحقق من أن إعدادات SEO صحيحة ومتسقة
 */

// نقرأ ملف seo.ts كنص للتحقق من المحتوى
import { readFileSync } from "fs";
import { resolve } from "path";

const seoContent = readFileSync(resolve(__dirname, "../client/src/lib/seo.ts"), "utf-8");

describe("SEO Configuration", () => {
  it("should have correct site name", () => {
    expect(seoContent).toContain('const SITE_NAME = "مذكرة و مدرس"');
  });

  it("should have core keywords for Kuwait education", () => {
    const requiredKeywords = [
      "مذكرات ثانوي الكويت",
      "ملخصات ثانوي الكويت",
      "مراجعات ثانوي الكويت",
      "نماذج اختبارات ثانوي الكويت",
      "تحميل مذكرات الكويت",
    ];
    for (const keyword of requiredKeywords) {
      expect(seoContent).toContain(keyword);
    }
  });

  it("should have subject-specific keywords", () => {
    const subjects = ["كيمياء", "أحياء", "فيزياء", "جيولوجيا"];
    for (const subject of subjects) {
      expect(seoContent).toContain(`مذكرة ${subject} الكويت`);
    }
  });

  it("should have grade-specific keywords", () => {
    const grades = ["الصف العاشر", "الصف الحادي عشر", "الصف الثاني عشر"];
    for (const grade of grades) {
      expect(seoContent).toContain(`${grade} الكويت`);
    }
  });

  it("should have review type keywords", () => {
    const reviewTypes = ["مراجعة فاينل", "مراجعة قصير", "مراجعة نهائية"];
    for (const type of reviewTypes) {
      expect(seoContent).toContain(`${type} الكويت`);
    }
  });

  it("should have brand keywords", () => {
    expect(seoContent).toContain("مايسترو العلوم");
    expect(seoContent).toContain("مذكرة و مدرس");
  });

  it("should have Kuwait geographic targeting", () => {
    expect(seoContent).toContain("geo.region");
    expect(seoContent).toContain("KW");
    expect(seoContent).toContain("geo.placename");
    expect(seoContent).toContain("الكويت");
  });

  it("should have Open Graph locale for Kuwait", () => {
    expect(seoContent).toContain("ar_KW");
  });

  it("should have page-specific SEO configs", () => {
    expect(seoContent).toContain("pageSEO");
    expect(seoContent).toContain("about:");
    expect(seoContent).toContain("privacy:");
    expect(seoContent).toContain("terms:");
    expect(seoContent).toContain("sessions:");
    expect(seoContent).toContain("faq:");
  });

  it("should have dynamic SEO functions for all page types", () => {
    expect(seoContent).toContain("getGradeSEO");
    expect(seoContent).toContain("getSubjectSEO");
    expect(seoContent).toContain("getCategorySEO");
    expect(seoContent).toContain("getSemesterSEO");
  });

  it("should have sessions page SEO with online tutoring keywords", () => {
    expect(seoContent).toContain("حصص أونلاين الكويت");
    expect(seoContent).toContain("دروس خصوصية الكويت");
  });

  it("should have default SEO with comprehensive description", () => {
    expect(seoContent).toContain("defaultSEO");
    expect(seoContent).toContain("مذكرات المرحلة الثانوية في الكويت");
  });
});

// التحقق من index.html
const indexContent = readFileSync(resolve(__dirname, "../client/index.html"), "utf-8");

describe("index.html SEO", () => {
  it("should have correct title", () => {
    expect(indexContent).toContain("مذكرة و مدرس");
  });

  it("should have meta description", () => {
    expect(indexContent).toContain('name="description"');
  });

  it("should have meta keywords", () => {
    expect(indexContent).toContain('name="keywords"');
  });

  it("should have Open Graph tags", () => {
    expect(indexContent).toContain('property="og:title"');
    expect(indexContent).toContain('property="og:description"');
    expect(indexContent).toContain('property="og:type"');
  });

  it("should have Arabic language and RTL direction", () => {
    expect(indexContent).toContain('lang="ar"');
    expect(indexContent).toContain('dir="rtl"');
  });

  it("should have Kuwait geographic meta tags", () => {
    expect(indexContent).toContain("geo.region");
    expect(indexContent).toContain("KW");
  });

  it("should have structured data (JSON-LD)", () => {
    expect(indexContent).toContain("application/ld+json");
    expect(indexContent).toContain("EducationalOrganization");
  });
});

// التحقق من robots.txt
const robotsContent = readFileSync(resolve(__dirname, "../client/public/robots.txt"), "utf-8");

describe("robots.txt", () => {
  it("should allow all public pages", () => {
    expect(robotsContent).toContain("Allow: /");
    expect(robotsContent).toContain("Allow: /grade/");
  });

  it("should disallow admin pages", () => {
    expect(robotsContent).toContain("Disallow: /admin/");
    expect(robotsContent).toContain("Disallow: /api/");
  });

  it("should have sitemap reference", () => {
    expect(robotsContent).toContain("Sitemap:");
  });
});
