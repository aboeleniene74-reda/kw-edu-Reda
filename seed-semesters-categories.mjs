import { drizzle } from "drizzle-orm/mysql2";
import { semesters, contentCategories } from "./drizzle/schema.ts";

const db = drizzle(process.env.DATABASE_URL);

async function seedSemestersAndCategories() {
  console.log("🌱 بدء إضافة الفصول والأقسام...");

  try {
    // إضافة الفصول الدراسية
    const semestersData = [
      {
        name: "الفصل الأول",
        nameEn: "First Semester",
        order: 1,
      },
      {
        name: "الفصل الثاني",
        nameEn: "Second Semester",
        order: 2,
      },
    ];

    for (const semester of semestersData) {
      await db.insert(semesters).values(semester);
      console.log(`✅ تم إضافة: ${semester.name}`);
    }

    // إضافة أقسام المحتوى السبعة
    const categoriesData = [
      {
        name: "الكتاب المدرسي",
        nameEn: "Textbook",
        order: 1,
        icon: "book-open",
        description: "الكتاب المدرسي الرسمي من وزارة التربية",
      },
      {
        name: "ملخصات الشرح",
        nameEn: "Study Summaries",
        order: 2,
        icon: "file-text",
        description: "ملخصات شاملة لجميع دروس الفصل",
      },
      {
        name: "مراجعات قصير 1",
        nameEn: "Quiz 1 Reviews",
        order: 3,
        icon: "clipboard-list",
        description: "مراجعات ونماذج للاختبار القصير الأول",
      },
      {
        name: "مراجعات قصير 2",
        nameEn: "Quiz 2 Reviews",
        order: 4,
        icon: "clipboard-check",
        description: "مراجعات ونماذج للاختبار القصير الثاني",
      },
      {
        name: "مراجعات الفاينل",
        nameEn: "Final Exam Reviews",
        order: 5,
        icon: "award",
        description: "مراجعات شاملة للاختبار النهائي",
      },
      {
        name: "نماذج اختبارات سابقة محلولة",
        nameEn: "Solved Past Papers",
        order: 6,
        icon: "check-circle",
        description: "نماذج اختبارات الأعوام السابقة مع الحلول",
      },
      {
        name: "نماذج اختبارات سابقة غير محلولة",
        nameEn: "Unsolved Past Papers",
        order: 7,
        icon: "file-question",
        description: "نماذج اختبارات للتدريب والممارسة",
      },
    ];

    for (const category of categoriesData) {
      await db.insert(contentCategories).values(category);
      console.log(`✅ تم إضافة قسم: ${category.name}`);
    }

    console.log("\n✨ تم إضافة جميع الفصول والأقسام بنجاح!");
    console.log(`📚 تم إضافة ${semestersData.length} فصول دراسية`);
    console.log(`📂 تم إضافة ${categoriesData.length} أقسام محتوى`);
  } catch (error) {
    console.error("❌ خطأ في إضافة البيانات:", error);
    process.exit(1);
  }

  process.exit(0);
}

seedSemestersAndCategories();
