import mysql from "mysql2/promise";

const connection = await mysql.createConnection(process.env.DATABASE_URL);

console.log("إنشاء الجداول الجديدة...");

// جدول grades
await connection.query(`
  CREATE TABLE IF NOT EXISTS \`grades\` (
    \`id\` int AUTO_INCREMENT PRIMARY KEY,
    \`name\` varchar(100) NOT NULL,
    \`nameEn\` varchar(100) NOT NULL,
    \`order\` int NOT NULL,
    \`description\` text,
    \`createdAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    \`updatedAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  )
`);
console.log("✓ تم إنشاء جدول grades");

// جدول subjects
await connection.query(`
  CREATE TABLE IF NOT EXISTS \`subjects\` (
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
console.log("✓ تم إنشاء جدول subjects");

// جدول notebooks
await connection.query(`
  CREATE TABLE IF NOT EXISTS \`notebooks\` (
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
console.log("✓ تم إنشاء جدول notebooks");

// جدول purchases
await connection.query(`
  CREATE TABLE IF NOT EXISTS \`purchases\` (
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
console.log("✓ تم إنشاء جدول purchases");

// جدول reviews
await connection.query(`
  CREATE TABLE IF NOT EXISTS \`reviews\` (
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
console.log("✓ تم إنشاء جدول reviews");

console.log("✅ تم إنشاء جميع الجداول بنجاح!");
await connection.end();
