import { drizzle } from "drizzle-orm/mysql2";
import { grades, subjects } from "./drizzle/schema.ts";

const db = drizzle(process.env.DATABASE_URL);

async function seed() {
  console.log("إضافة البيانات الأولية...");
  
  // إضافة الصفوف الدراسية
  await db.insert(grades).values([
    {
      name: "الصف العاشر",
      nameEn: "Grade 10",
      order: 10,
      description: "المرحلة الأولى من الثانوية العامة"
    },
    {
      name: "الصف الحادي عشر",
      nameEn: "Grade 11",
      order: 11,
      description: "المرحلة الثانية من الثانوية العامة"
    },
    {
      name: "الصف الثاني عشر",
      nameEn: "Grade 12",
      order: 12,
      description: "المرحلة النهائية من الثانوية العامة"
    }
  ]);
  
  console.log("✓ تم إضافة الصفوف الدراسية");
  
  // إضافة المواد للصف العاشر
  await db.insert(subjects).values([
    {
      gradeId: 1,
      name: "الكيمياء",
      nameEn: "Chemistry",
      icon: "flask",
      color: "oklch(0.55 0.20 180)",
      description: "مادة الكيمياء للصف العاشر"
    },
    {
      gradeId: 1,
      name: "الأحياء",
      nameEn: "Biology",
      icon: "dna",
      color: "oklch(0.60 0.18 140)",
      description: "مادة الأحياء للصف العاشر"
    },
    {
      gradeId: 1,
      name: "الفيزياء",
      nameEn: "Physics",
      icon: "atom",
      color: "oklch(0.50 0.22 260)",
      description: "مادة الفيزياء للصف العاشر"
    }
  ]);
  
  console.log("✓ تم إضافة مواد الصف العاشر");
  
  // إضافة المواد للصف الحادي عشر
  await db.insert(subjects).values([
    {
      gradeId: 2,
      name: "الكيمياء",
      nameEn: "Chemistry",
      icon: "flask",
      color: "oklch(0.55 0.20 180)",
      description: "مادة الكيمياء للصف الحادي عشر"
    },
    {
      gradeId: 2,
      name: "الأحياء",
      nameEn: "Biology",
      icon: "dna",
      color: "oklch(0.60 0.18 140)",
      description: "مادة الأحياء للصف الحادي عشر"
    },
    {
      gradeId: 2,
      name: "الفيزياء",
      nameEn: "Physics",
      icon: "atom",
      color: "oklch(0.50 0.22 260)",
      description: "مادة الفيزياء للصف الحادي عشر"
    },
    {
      gradeId: 2,
      name: "الجيولوجيا",
      nameEn: "Geology",
      icon: "mountain",
      color: "oklch(0.45 0.15 40)",
      description: "مادة الجيولوجيا للصف الحادي عشر"
    }
  ]);
  
  console.log("✓ تم إضافة مواد الصف الحادي عشر");
  
  // إضافة المواد للصف الثاني عشر
  await db.insert(subjects).values([
    {
      gradeId: 3,
      name: "الكيمياء",
      nameEn: "Chemistry",
      icon: "flask",
      color: "oklch(0.55 0.20 180)",
      description: "مادة الكيمياء للصف الثاني عشر"
    },
    {
      gradeId: 3,
      name: "الأحياء",
      nameEn: "Biology",
      icon: "dna",
      color: "oklch(0.60 0.18 140)",
      description: "مادة الأحياء للصف الثاني عشر"
    },
    {
      gradeId: 3,
      name: "الفيزياء",
      nameEn: "Physics",
      icon: "atom",
      color: "oklch(0.50 0.22 260)",
      description: "مادة الفيزياء للصف الثاني عشر"
    }
  ]);
  
  console.log("✓ تم إضافة مواد الصف الثاني عشر");
  console.log("✅ تم إضافة جميع البيانات الأولية بنجاح!");
  process.exit(0);
}

seed().catch((error) => {
  console.error("❌ خطأ في إضافة البيانات:", error);
  process.exit(1);
});
