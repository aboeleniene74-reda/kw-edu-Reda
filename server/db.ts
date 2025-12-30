import { eq, and, desc } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { 
  InsertUser, 
  users, 
  grades, 
  subjects, 
  notebooks, 
  purchases, 
  reviews,
  InsertGrade,
  InsertSubject,
  InsertNotebook,
  InsertPurchase,
  InsertReview
} from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

// ============= User Functions =============

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

// ============= Grade Functions =============

export async function getAllGrades() {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(grades).orderBy(grades.order);
}

export async function getGradeById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db.select().from(grades).where(eq(grades.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function createGrade(grade: InsertGrade) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.insert(grades).values(grade);
}

// ============= Subject Functions =============

export async function getSubjectsByGrade(gradeId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(subjects).where(eq(subjects.gradeId, gradeId));
}

export async function getSubjectById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db.select().from(subjects).where(eq(subjects.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function createSubject(subject: InsertSubject) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.insert(subjects).values(subject);
}

// ============= Notebook Functions =============

export async function getNotebooksBySubject(subjectId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return await db
    .select()
    .from(notebooks)
    .where(and(
      eq(notebooks.subjectId, subjectId),
      eq(notebooks.isPublished, true)
    ))
    .orderBy(desc(notebooks.isFeatured), desc(notebooks.createdAt));
}

export async function getNotebookById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db.select().from(notebooks).where(eq(notebooks.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function createNotebook(notebook: InsertNotebook) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.insert(notebooks).values(notebook);
}

export async function getAllNotebooks() {
  const db = await getDb();
  if (!db) return [];
  
  return await db
    .select()
    .from(notebooks)
    .orderBy(desc(notebooks.createdAt));
}

// ============= Purchase Functions =============

export async function createPurchase(purchase: InsertPurchase) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.insert(purchases).values(purchase);
}

export async function getUserPurchases(userId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return await db
    .select()
    .from(purchases)
    .where(eq(purchases.userId, userId))
    .orderBy(desc(purchases.purchasedAt));
}

export async function checkUserPurchased(userId: number, notebookId: number) {
  const db = await getDb();
  if (!db) return false;
  
  const result = await db
    .select()
    .from(purchases)
    .where(and(
      eq(purchases.userId, userId),
      eq(purchases.notebookId, notebookId),
      eq(purchases.status, "completed")
    ))
    .limit(1);
    
  return result.length > 0;
}

// ============= Review Functions =============

export async function createReview(review: InsertReview) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.insert(reviews).values(review);
}

export async function getNotebookReviews(notebookId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return await db
    .select()
    .from(reviews)
    .where(eq(reviews.notebookId, notebookId))
    .orderBy(desc(reviews.createdAt));
}
