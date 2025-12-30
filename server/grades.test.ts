import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

function createPublicContext(): TrpcContext {
  const ctx: TrpcContext = {
    user: null,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: () => {},
    } as TrpcContext["res"],
  };

  return ctx;
}

describe("grades.list", () => {
  it("يجب أن يعيد قائمة الصفوف الدراسية", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.grades.list();

    expect(result).toBeDefined();
    expect(Array.isArray(result)).toBe(true);
    
    if (result.length > 0) {
      expect(result[0]).toHaveProperty("id");
      expect(result[0]).toHaveProperty("name");
      expect(result[0]).toHaveProperty("nameEn");
      expect(result[0]).toHaveProperty("order");
    }
  });
});

describe("subjects.listByGrade", () => {
  it("يجب أن يعيد قائمة المواد للصف العاشر", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.subjects.listByGrade({ gradeId: 1 });

    expect(result).toBeDefined();
    expect(Array.isArray(result)).toBe(true);
    
    if (result.length > 0) {
      expect(result[0]).toHaveProperty("id");
      expect(result[0]).toHaveProperty("name");
      expect(result[0]).toHaveProperty("gradeId");
      expect(result[0].gradeId).toBe(1);
    }
  });

  it("يجب أن يعيد قائمة المواد للصف الحادي عشر مع الجيولوجيا", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.subjects.listByGrade({ gradeId: 2 });

    expect(result).toBeDefined();
    expect(Array.isArray(result)).toBe(true);
    
    // الصف الحادي عشر يجب أن يحتوي على 4 مواد (كيمياء، أحياء، فيزياء، جيولوجيا)
    if (result.length > 0) {
      expect(result.some(s => s.name === "الجيولوجيا")).toBe(true);
    }
  });
});
