import { drizzle } from "drizzle-orm/mysql2";
import { users } from "./drizzle/schema.ts";
import { eq } from "drizzle-orm";
import dotenv from "dotenv";

dotenv.config();

const db = drizzle(process.env.DATABASE_URL);

const allUsers = await db.select().from(users);
console.log("All users:", JSON.stringify(allUsers, null, 2));
