import mysql from "mysql2/promise";

const connection = await mysql.createConnection(process.env.DATABASE_URL);

console.log("حذف جدول subjects القديم...");
await connection.query("DROP TABLE IF EXISTS `subjects`");

console.log("إنشاء جدول subjects الجديد...");
await connection.query(`
  CREATE TABLE \`subjects\` (
    \`id\` int AUTO_INCREMENT PRIMARY KEY,
    \`gradeId\` int NOT NULL,
    \`name\` varchar(100) NOT NULL,
    \`nameEn\` varchar(100) NOT NULL,
    \`icon\` varchar(50),
    \`color\` varchar(50) DEFAULT 'oklch(0.48 0.18 250)',
    \`description\` text,
    \`createdAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    \`updatedAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (\`gradeId\`) REFERENCES \`grades\`(\`id\`)
  )
`);

console.log("✅ تم إصلاح جدول subjects");
await connection.end();
