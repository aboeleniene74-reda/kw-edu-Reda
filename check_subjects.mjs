import mysql from "mysql2/promise";

const connection = await mysql.createConnection(process.env.DATABASE_URL);
const [columns] = await connection.query("DESCRIBE subjects");
console.log("أعمدة جدول subjects:");
console.log(columns);
await connection.end();
