import mysql from "mysql2/promise";

const connection = await mysql.createConnection(process.env.DATABASE_URL);

console.log("حذف الجداول القديمة...");

const tablesToDrop = [
  'studentAnswers',
  'quizAttempts', 
  'questions',
  'quizzes',
  'submissions',
  'assignments',
  'lessonProgress',
  'lessons'
];

for (const table of tablesToDrop) {
  try {
    await connection.query(`DROP TABLE IF EXISTS \`${table}\``);
    console.log(`✓ تم حذف جدول ${table}`);
  } catch (error) {
    console.log(`✗ خطأ في حذف ${table}:`, error.message);
  }
}

console.log("✅ تم حذف الجداول القديمة");
await connection.end();
