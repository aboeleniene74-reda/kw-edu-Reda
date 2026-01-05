import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createPublicContext(): { ctx: TrpcContext } {
  const ctx: TrpcContext = {
    user: null,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };

  return { ctx };
}

describe("ratings and comments API", () => {
  it("should get average site rating", async () => {
    const { ctx } = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.siteRatings.average();

    expect(result).toHaveProperty("average");
    expect(result).toHaveProperty("count");
    expect(typeof result.average).toBe("number");
    expect(typeof result.count).toBe("number");
  });

  it("should create site rating", async () => {
    const { ctx } = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.siteRatings.create({
      rating: 5,
      comment: "موقع ممتاز",
      visitorName: "زائر تجريبي",
    });

    expect(result).toEqual({ success: true });
  });
});

describe("session ratings API", () => {
  it("should get average session rating", async () => {
    const { ctx } = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    // Use session ID 1 (assuming it exists from seed data)
    const result = await caller.sessionRatings.average({ sessionId: 1 });

    expect(result).toHaveProperty("average");
    expect(result).toHaveProperty("count");
    expect(typeof result.average).toBe("number");
    expect(typeof result.count).toBe("number");
  });

  it("should create session rating", async () => {
    const { ctx } = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.sessionRatings.create({
      sessionId: 1,
      rating: 5,
      review: "حصة ممتازة ومفيدة",
      studentName: "طالب تجريبي",
    });

    expect(result).toEqual({ success: true });
  });

  it("should get session ratings list", async () => {
    const { ctx } = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.sessionRatings.getBySession({ sessionId: 1 });

    expect(Array.isArray(result)).toBe(true);
  });
});

describe("live comments API", () => {
  it("should create live comment", async () => {
    const { ctx } = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.liveComments.create({
      sessionId: 1,
      comment: "سؤال تجريبي",
      studentName: "طالب",
    });

    expect(result).toEqual({ success: true });
  });

  it("should get live comments for session", async () => {
    const { ctx } = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.liveComments.getBySession({ sessionId: 1 });

    expect(Array.isArray(result)).toBe(true);
  });
});
