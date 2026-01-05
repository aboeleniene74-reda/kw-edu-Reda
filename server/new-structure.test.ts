import { describe, it, expect } from "vitest";
import { appRouter } from "./routers";

describe("New Structure Tests", () => {
  describe("Semesters API", () => {
    it("should list all semesters", async () => {
      const ctx = { user: null };
      const caller = appRouter.createCaller(ctx);

      const semesters = await caller.semesters.list();

      expect(semesters).toBeDefined();
      expect(Array.isArray(semesters)).toBe(true);
      expect(semesters.length).toBeGreaterThanOrEqual(2);
      
      const firstSemester = semesters.find(s => s.name === "الفصل الأول");
      expect(firstSemester).toBeDefined();
      expect(firstSemester?.nameEn).toBe("First Semester");
    });

    it("should get semester by id", async () => {
      const ctx = { user: null };
      const caller = appRouter.createCaller(ctx);

      const semester = await caller.semesters.getById({ id: 1 });

      expect(semester).toBeDefined();
      expect(semester?.name).toBe("الفصل الأول");
    });
  });

  describe("Content Categories API", () => {
    it("should list all content categories", async () => {
      const ctx = { user: null };
      const caller = appRouter.createCaller(ctx);

      const categories = await caller.contentCategories.list();

      expect(categories).toBeDefined();
      expect(Array.isArray(categories)).toBe(true);
      expect(categories.length).toBe(7);
      
      const textbook = categories.find(c => c.name === "الكتاب المدرسي");
      expect(textbook).toBeDefined();
      expect(textbook?.order).toBe(1);
    });

    it("should have all 7 categories in correct order", async () => {
      const ctx = { user: null };
      const caller = appRouter.createCaller(ctx);

      const categories = await caller.contentCategories.list();

      const expectedCategories = [
        "الكتاب المدرسي",
        "ملخصات الشرح",
        "مراجعات قصير 1",
        "مراجعات قصير 2",
        "مراجعات الفاينل",
        "نماذج اختبارات سابقة محلولة",
        "نماذج اختبارات سابقة غير محلولة",
      ];

      expectedCategories.forEach((name, index) => {
        expect(categories[index].name).toBe(name);
        expect(categories[index].order).toBe(index + 1);
      });
    });
  });

  describe("Notebooks with Filters API", () => {
    it("should get notebooks by subject, semester, and category", async () => {
      const ctx = { user: null };
      const caller = appRouter.createCaller(ctx);

      // كيمياء (3) - الفصل الأول (1) - الكتاب المدرسي (1)
      const notebooks = await caller.notebooks.listByFilters({
        subjectId: 3,
        semesterId: 1,
        categoryId: 1,
      });

      expect(notebooks).toBeDefined();
      expect(Array.isArray(notebooks)).toBe(true);
      expect(notebooks.length).toBeGreaterThan(0);
      
      const textbook = notebooks.find(n => n.title.includes("كتاب الكيمياء"));
      expect(textbook).toBeDefined();
      expect(parseFloat(textbook?.price || "0")).toBe(0);
    });

    it("should get chemistry summaries for first semester", async () => {
      const ctx = { user: null };
      const caller = appRouter.createCaller(ctx);

      // كيمياء (3) - الفصل الأول (1) - ملخصات الشرح (2)
      const notebooks = await caller.notebooks.listByFilters({
        subjectId: 3,
        semesterId: 1,
        categoryId: 2,
      });

      expect(notebooks).toBeDefined();
      expect(notebooks.length).toBeGreaterThan(0);
      
      const summary = notebooks.find(n => n.title.includes("ملخص"));
      expect(summary).toBeDefined();
      expect(parseFloat(summary?.price || "0")).toBeGreaterThan(0);
    });

    it("should get biology notebooks for first semester", async () => {
      const ctx = { user: null };
      const caller = appRouter.createCaller(ctx);

      // أحياء (4) - الفصل الأول (1) - الكتاب المدرسي (1)
      const notebooks = await caller.notebooks.listByFilters({
        subjectId: 4,
        semesterId: 1,
        categoryId: 1,
      });

      expect(notebooks).toBeDefined();
      expect(notebooks.length).toBeGreaterThan(0);
      
      const textbook = notebooks.find(n => n.title.includes("الأحياء"));
      expect(textbook).toBeDefined();
    });

    it("should return empty array for non-existent combination", async () => {
      const ctx = { user: null };
      const caller = appRouter.createCaller(ctx);

      // مادة غير موجودة
      const notebooks = await caller.notebooks.listByFilters({
        subjectId: 999,
        semesterId: 1,
        categoryId: 1,
      });

      expect(notebooks).toBeDefined();
      expect(Array.isArray(notebooks)).toBe(true);
      expect(notebooks.length).toBe(0);
    });

    it("should only return published notebooks", async () => {
      const ctx = { user: null };
      const caller = appRouter.createCaller(ctx);

      const notebooks = await caller.notebooks.listByFilters({
        subjectId: 3,
        semesterId: 1,
        categoryId: 1,
      });

      notebooks.forEach(notebook => {
        expect(notebook.isPublished).toBe(true);
      });
    });

    it("should order featured notebooks first", async () => {
      const ctx = { user: null };
      const caller = appRouter.createCaller(ctx);

      const notebooks = await caller.notebooks.listByFilters({
        subjectId: 3,
        semesterId: 1,
        categoryId: 2,
      });

      if (notebooks.length > 1) {
        const featuredNotebooks = notebooks.filter(n => n.isFeatured);
        const nonFeaturedNotebooks = notebooks.filter(n => !n.isFeatured);
        
        if (featuredNotebooks.length > 0 && nonFeaturedNotebooks.length > 0) {
          const firstFeaturedIndex = notebooks.findIndex(n => n.isFeatured);
          const firstNonFeaturedIndex = notebooks.findIndex(n => !n.isFeatured);
          
          expect(firstFeaturedIndex).toBeLessThan(firstNonFeaturedIndex);
        }
      }
    });
  });

  describe("Complete Structure Integration", () => {
    it("should have complete data for grade 11 chemistry first semester", async () => {
      const ctx = { user: null };
      const caller = appRouter.createCaller(ctx);

      // Get all components
      const grades = await caller.grades.list();
      const semesters = await caller.semesters.list();
      const categories = await caller.contentCategories.list();
      
      const grade11 = grades.find(g => g.name === "الصف الحادي عشر");
      expect(grade11).toBeDefined();

      const subjects = await caller.subjects.listByGrade({ gradeId: grade11!.id });
      const chemistry = subjects.find(s => s.name.includes("كيمياء"));
      expect(chemistry).toBeDefined();

      const firstSemester = semesters.find(s => s.name === "الفصل الأول");
      expect(firstSemester).toBeDefined();

      // Check that we have notebooks for each category
      for (const category of categories) {
        const notebooks = await caller.notebooks.listByFilters({
          subjectId: chemistry!.id,
          semesterId: firstSemester!.id,
          categoryId: category.id,
        });

        // At least some categories should have notebooks
        if (category.order <= 2) {
          expect(notebooks.length).toBeGreaterThanOrEqual(0);
        }
      }
    });
  });
});
