import { describe, it, expect, vi, beforeEach } from "vitest";

const { mockAuth } = vi.hoisted(() => ({
  mockAuth: vi.fn(),
}));

vi.mock("@clerk/nextjs/server", () => ({
  auth: mockAuth,
}));

vi.mock("@/env", () => ({
  env: {
    SUPERMEMORY_API_KEY: "test-supermemory-key",
    GROQ_API_KEY: "test-groq-key",
    CRON_SECRET: "test-cron",
    DATABASE_URL: "postgres://test",
    CLERK_SECRET_KEY: "test-clerk",
    CLERK_WEBHOOK_SECRET: "test-webhook",
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: "pk_test_123",
    NODE_ENV: "test",
  },
}));

import { POST } from "@/app/api/mind/documents/route";

function createRequest(body: unknown = {}) {
  return new Request("http://localhost/api/mind/documents", {
    method: "POST",
    body: JSON.stringify(body),
    headers: { "Content-Type": "application/json" },
  });
}

describe("POST /api/mind/documents", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns 401 when not authenticated", async () => {
    mockAuth.mockResolvedValue({ userId: null });

    const res = await POST(createRequest());
    expect(res.status).toBe(401);
    const body = (await res.json()) as { error: string };
    expect(body.error).toBe("Unauthorized");
  });

  it("fetches documents from SuperMemory", async () => {
    mockAuth.mockResolvedValue({ userId: "user_test_123" });

    const mockDocs = {
      documents: [{ id: "doc1", content: "Entry" }],
      pagination: { currentPage: 1, totalPages: 1, total: 1 },
    };

    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: vi.fn().mockResolvedValue(mockDocs),
      }),
    );

    const res = await POST(createRequest({ page: 1, limit: 10 }));
    expect(res.status).toBe(200);

    const body = (await res.json()) as typeof mockDocs;
    expect(body.documents).toEqual(mockDocs.documents);

    // Verify fetch was called with correct params
    expect(fetch).toHaveBeenCalledWith(
      "https://api.supermemory.ai/v3/documents/documents",
      expect.objectContaining({
        method: "POST",
        headers: expect.objectContaining({
          Authorization: "Bearer test-supermemory-key",
        }),
      }),
    );

    const fetchArgs = vi.mocked(fetch).mock.calls[0]!;
    const fetchBody = JSON.parse(fetchArgs[1]!.body as string) as {
      page: number;
      limit: number;
      containerTags: string[];
    };
    expect(fetchBody.page).toBe(1);
    expect(fetchBody.limit).toBe(10);
    expect(fetchBody.containerTags).toEqual(["user_test_123"]);
  });

  it("uses default page and limit when not provided", async () => {
    mockAuth.mockResolvedValue({ userId: "user_test_123" });

    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: vi.fn().mockResolvedValue({ documents: [] }),
      }),
    );

    await POST(createRequest({}));

    const fetchArgs = vi.mocked(fetch).mock.calls[0]!;
    const fetchBody = JSON.parse(fetchArgs[1]!.body as string) as {
      page: number;
      limit: number;
    };
    expect(fetchBody.page).toBe(1);
    expect(fetchBody.limit).toBe(100);
  });

  it("returns error status when SuperMemory API fails", async () => {
    mockAuth.mockResolvedValue({ userId: "user_test_123" });

    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: false,
        status: 500,
      }),
    );

    const res = await POST(createRequest());
    expect(res.status).toBe(500);
    const body = (await res.json()) as { error: string };
    expect(body.error).toBe("Failed to fetch documents");
  });
});
