import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import * as db from "./db";

// Middleware للتحقق من صلاحيات المعلم أو المدير
const teacherProcedure = publicProcedure.use(({ ctx, next }) => {
  if (!ctx.user) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "يجب تسجيل الدخول للوصول إلى هذه الميزة",
    });
  }
  if (ctx.user.role !== "teacher" && ctx.user.role !== "admin") {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "يجب أن تكون معلماً أو مديراً للوصول إلى هذه الميزة",
    });
  }
  return next({ ctx });
});

// Middleware للتحقق من تسجيل الدخول فقط
const protectedProcedure = publicProcedure.use(({ ctx, next }) => {
  if (!ctx.user) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "يجب تسجيل الدخول للوصول إلى هذه الميزة",
    });
  }
  return next({ ctx });
});

export const appRouter = router({
  system: systemRouter,
  
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),

  // ============= Grades (الصفوف الدراسية) =============
  grades: router({
    list: publicProcedure.query(async () => {
      return await db.getAllGrades();
    }),
    
    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return await db.getGradeById(input.id);
      }),
      
    create: teacherProcedure
      .input(z.object({
        name: z.string(),
        nameEn: z.string(),
        order: z.number(),
        description: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        await db.createGrade(input);
        return { success: true };
      }),
  }),

  // ============= Subjects (المواد الدراسية) =============
  subjects: router({
    listByGrade: publicProcedure
      .input(z.object({ gradeId: z.number() }))
      .query(async ({ input }) => {
        return await db.getSubjectsByGrade(input.gradeId);
      }),
      
    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return await db.getSubjectById(input.id);
      }),
      
    create: teacherProcedure
      .input(z.object({
        gradeId: z.number(),
        name: z.string(),
        nameEn: z.string(),
        icon: z.string().optional(),
        color: z.string().optional(),
        description: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        await db.createSubject(input);
        return { success: true };
      }),
  }),

  // ============= Notebooks (المذكرات) =============
  notebooks: router({
    listBySubject: publicProcedure
      .input(z.object({ subjectId: z.number() }))
      .query(async ({ input }) => {
        return await db.getNotebooksBySubject(input.subjectId);
      }),
      
    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return await db.getNotebookById(input.id);
      }),
      
    listAll: teacherProcedure.query(async () => {
      return await db.getAllNotebooks();
    }),
      
    create: teacherProcedure
      .input(z.object({
        subjectId: z.number(),
        title: z.string(),
        description: z.string().optional(),
        price: z.string(),
        pages: z.number().optional(),
        fileUrl: z.string().optional(),
        previewUrl: z.string().optional(),
        coverImageUrl: z.string().optional(),
        isPublished: z.boolean().default(false),
        isFeatured: z.boolean().default(false),
      }))
      .mutation(async ({ input, ctx }) => {
        await db.createNotebook({
          ...input,
          teacherId: ctx.user!.id,
        });
        return { success: true };
      }),
  }),

  // ============= Purchases (المشتريات) =============
  purchases: router({
    myPurchases: protectedProcedure.query(async ({ ctx }) => {
      return await db.getUserPurchases(ctx.user!.id);
    }),
    
    checkPurchased: protectedProcedure
      .input(z.object({ notebookId: z.number() }))
      .query(async ({ input, ctx }) => {
        const purchased = await db.checkUserPurchased(ctx.user!.id, input.notebookId);
        return { purchased };
      }),
      
    create: protectedProcedure
      .input(z.object({
        notebookId: z.number(),
        price: z.string(),
        paymentMethod: z.string().optional(),
        transactionId: z.string().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        await db.createPurchase({
          ...input,
          userId: ctx.user!.id,
          status: "pending",
        });
        return { success: true };
      }),
  }),

  // ============= Reviews (التقييمات) =============
  reviews: router({
    listByNotebook: publicProcedure
      .input(z.object({ notebookId: z.number() }))
      .query(async ({ input }) => {
        return await db.getNotebookReviews(input.notebookId);
      }),
      
    create: protectedProcedure
      .input(z.object({
        notebookId: z.number(),
        rating: z.number().min(1).max(5),
        comment: z.string().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        await db.createReview({
          ...input,
          userId: ctx.user!.id,
        });
        return { success: true };
      }),
  }),
});

export type AppRouter = typeof appRouter;
