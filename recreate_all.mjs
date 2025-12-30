import mysql from "mysql2/promise";

const connection = await mysql.createConnection(process.env.DATABASE_URL);

console.log("حذف جميع الجداول بالترتيب الصحيح...");
await connection.query("SET FOREIGN_KEY_CHECKS = 0");
await connection.query("DROP TABLE IF EXISTS `reviews`");
await connection.query("DROP TABLE IF EXISTS `purchases`");
await connection.query("DROP TABLE IF EXISTS `notebooks`");
await connection.query("DROP TABLE IF EXISTS `subjects`");
await connection.query("DROP TABLE IF EXISTS `grades`");
await connection.query("SET FOREIGN_KEY_CHECKS = 1");

console.log("إنشاء جميع الجداول من جديد...");

// جدول grades
await connection.query(`
  CREATE TABLE \`grades\` (
    \`id\` int AUTO_INCREMENT PRIMARY KEY,
    \`name\` varchar(100) NOT NULL,
    \`nameEn\` varchar(100) NOT NULL,
    \`order\` int NOT NULL,
    \`description\` text,
    \`createdAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    \`updatedAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  )
`);

// جدول subjects
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

// جدول notebooks
await connection.query(`
  CREATE TABLE \`notebooks\` (
    \`id\` int AUTO_INCREMENT PRIMARY KEY,
    \`subjectId\` int NOT NULL,
    \`teacherId\` int,
    \`title\` varchar(255) NOT NULL,
    \`description\` text,
    \`price\` decimal(10,2) NOT NULL,
    \`pages\` int,
    \`fileUrl\` text,
    \`previewUrl\` text,
    \`coverImageUrl\` text,
    \`isPublished\` boolean NOT NULL DEFAULT false,
    \`isFeatured\` boolean NOT NULL DEFAULT false,
    \`salesCount\` int NOT NULL DEFAULT 0,
    \`rating\` decimal(3,2),
    \`createdAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    \`updatedAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (\`subjectId\`) REFERENCES \`subjects\`(\`id\`),
    FOREIGN KEY (\`teacherId\`) REFERENCES \`users\`(\`id\`)
  )
`);

// جدول purchases
await connection.query(`
  CREATE TABLE \`purchases\` (
    \`id\` int AUTO_INCREMENT PRIMARY KEY,
    \`userId\` int NOT NULL,
    \`notebookId\` int NOT NULL,
    \`price\` decimal(10,2) NOT NULL,
    \`paymentMethod\` varchar(50),
    \`transactionId\` varchar(255),
    \`status\` enum('pending', 'completed', 'failed', 'refunded') NOT NULL DEFAULT 'pending',
    \`purchasedAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`),
    FOREIGN KEY (\`notebookId\`) REFERENCES \`notebooks\`(\`id\`)
  )
`);

// جدول reviews
await connection.query(`
  CREATE TABLE \`reviews\` (
    \`id\` int AUTO_INCREMENT PRIMARY KEY,
    \`userId\` int NOT NULL,
    \`notebookId\` int NOT NULL,
    \`rating\` int NOT NULL,
    \`comment\` text,
    \`createdAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    \`updatedAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`),
    FOREIGN KEY (\`notebookId\`) REFERENCES \`notebooks\`(\`id\`)
  )
`);

console.log("✅ تم إعادة إنشاء جميع الجداول بنجاح!");
await connection.end();
