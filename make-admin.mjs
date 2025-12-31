import { drizzle } from "drizzle-orm/mysql2";
import { users } from "./drizzle/schema.ts";
import { eq } from "drizzle-orm";
import dotenv from "dotenv";

dotenv.config();

const db = drizzle(process.env.DATABASE_URL);

// Get owner's openId from environment
const ownerOpenId = process.env.OWNER_OPEN_ID;
console.log("Owner OpenID:", ownerOpenId);

if (!ownerOpenId) {
  console.error("OWNER_OPEN_ID not found in environment");
  process.exit(1);
}

// Update user role to admin
const result = await db
  .update(users)
  .set({ role: "admin" })
  .where(eq(users.openId, ownerOpenId));

console.log("User updated to admin successfully!");

// Verify the update
const user = await db.select().from(users).where(eq(users.openId, ownerOpenId));
console.log("Updated user:", JSON.stringify(user, null, 2));
