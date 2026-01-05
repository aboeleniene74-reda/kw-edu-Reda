import { drizzle } from "drizzle-orm/mysql2";

const db = drizzle(process.env.DATABASE_URL);

async function applyChanges() {
  console.log("🔄 تطبيق تغييرات قاعدة البيانات...");

  try {
    // إنشاء جدول الفصول الدراسية
    await db.execute(`
      CREATE TABLE IF NOT EXISTS semesters (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        nameEn VARCHAR(100) NOT NULL,
        \`order\` INT NOT NULL,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
      )
    `);
    console.log("✅ تم إنشاء جدول semesters");

    // إنشاء جدول أقسام المحتوى
    await db.execute(`
      CREATE TABLE IF NOT EXISTS content_categories (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        nameEn VARCHAR(100) NOT NULL,
        \`order\` INT NOT NULL,
        icon VARCHAR(50),
        description TEXT,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
      )
    `);
    console.log("✅ تم إنشاء جدول content_categories");

    // إضافة الأعمدة الجديدة لجدول notebooks
    await db.execute(`
      ALTER TABLE notebooks 
      ADD COLUMN IF NOT EXISTS semesterId INT,
      ADD COLUMN IF NOT EXISTS categoryId INT,
      ADD COLUMN IF NOT EXISTS gradeId INT
    `);
    console.log("✅ تم إضافة الأعمدة الجديدة لجدول notebooks");

    console.log("\n✨ تم تطبيق جميع التغييرات بنجاح!");
  } catch (error) {
    console.error("❌ خطأ:", error.message);
  }

  process.exit(0);
}

applyChanges();
