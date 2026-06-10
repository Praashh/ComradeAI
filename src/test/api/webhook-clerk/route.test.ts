import { describe, it, expect, vi, beforeEach } from "vitest";

const { mockHeaders, mockInsert, mockDelete } = vi.hoisted(() => ({
  mockHeaders: vi.fn(),
  mockInsert: vi.fn(),
  mockDelete: vi.fn(),
}));

vi.mock("next/headers", () => ({
  headers: mockHeaders,
}));

vi.mock("@/db/drizzle", () => ({
  db: {
    insert: mockInsert,
    delete: mockDelete,
  },
}));

// Mock svix Webhook
const { mockVerify } = vi.hoisted(() => ({
  mockVerify: vi.fn(),
}));

vi.mock("svix", () => ({
  Webhook: class MockWebhook {
    verify = mockVerify;
  },
}));

import { POST } from "@/app/api/webhook/clerk/route";

function createRequest(body: unknown) {
  return new Request("http://localhost/api/webhook/clerk", {
    method: "POST",
    body: JSON.stringify(body),
    headers: { "Content-Type": "application/json" },
  });
}

describe("POST /api/webhook/clerk", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.CLERK_WEBHOOK_SECRET = "test-webhook-secret";

    // Default: headers present
    mockHeaders.mockResolvedValue({
      get: (key: string) => {
        const map: Record<string, string> = {
          "svix-id": "msg_123",
          "svix-timestamp": "1234567890",
          "svix-signature": "v1,signature",
        };
        return map[key] ?? null;
      },
    });
  });

  it("returns 400 when svix headers are missing", async () => {
    mockHeaders.mockResolvedValue({
      get: () => null,
    });

    const res = await POST(createRequest({}));
    expect(res.status).toBe(400);
    expect(await res.text()).toBe("Missing svix headers");
  });

  it("returns 400 on invalid signature", async () => {
    mockVerify.mockImplementation(() => {
      throw new Error("Invalid signature");
    });

    const res = await POST(createRequest({}));
    expect(res.status).toBe(400);
    expect(await res.text()).toBe("Invalid signature");
  });

  it("upserts user on user.created event", async () => {
    mockVerify.mockReturnValue({
      type: "user.created",
      data: {
        id: "clerk_user_123",
        email_addresses: [{ email_address: "test@example.com" }],
        first_name: "Test",
        last_name: "User",
        image_url: "https://example.com/photo.jpg",
      },
    });

    const insertChain = {
      values: vi.fn().mockReturnThis(),
      onConflictDoUpdate: vi.fn().mockResolvedValue(undefined),
    };
    mockInsert.mockReturnValue(insertChain);

    const res = await POST(createRequest({}));
    expect(res.status).toBe(200);
    expect(mockInsert).toHaveBeenCalled();
    expect(insertChain.values).toHaveBeenCalledWith(
      expect.objectContaining({
        clerkId: "clerk_user_123",
        email: "test@example.com",
        firstName: "Test",
        lastName: "User",
      }),
    );
  });

  it("upserts user on user.updated event", async () => {
    mockVerify.mockReturnValue({
      type: "user.updated",
      data: {
        id: "clerk_user_123",
        email_addresses: [{ email_address: "updated@example.com" }],
        first_name: "Updated",
        last_name: "Name",
        image_url: "https://example.com/new.jpg",
      },
    });

    const insertChain = {
      values: vi.fn().mockReturnThis(),
      onConflictDoUpdate: vi.fn().mockResolvedValue(undefined),
    };
    mockInsert.mockReturnValue(insertChain);

    const res = await POST(createRequest({}));
    expect(res.status).toBe(200);
    expect(insertChain.onConflictDoUpdate).toHaveBeenCalled();
  });

  it("returns 400 when no email is found", async () => {
    mockVerify.mockReturnValue({
      type: "user.created",
      data: {
        id: "clerk_user_123",
        email_addresses: [],
        first_name: "Test",
        last_name: "User",
        image_url: null,
      },
    });

    const res = await POST(createRequest({}));
    expect(res.status).toBe(400);
    expect(await res.text()).toBe("No email found");
  });

  it("deletes user on user.deleted event", async () => {
    mockVerify.mockReturnValue({
      type: "user.deleted",
      data: { id: "clerk_user_123" },
    });

    const deleteChain = {
      where: vi.fn().mockResolvedValue(undefined),
    };
    mockDelete.mockReturnValue(deleteChain);

    const res = await POST(createRequest({}));
    expect(res.status).toBe(200);
    expect(mockDelete).toHaveBeenCalled();
  });

  it("returns 200 for user.deleted with no id", async () => {
    mockVerify.mockReturnValue({
      type: "user.deleted",
      data: {},
    });

    const res = await POST(createRequest({}));
    expect(res.status).toBe(200);
    expect(mockDelete).not.toHaveBeenCalled();
  });
});
