import { describe, it, expect, vi, beforeEach } from "vitest";

const { mockAdd, mockSearchDocuments, mockProfile } = vi.hoisted(() => ({
  mockAdd: vi.fn(),
  mockSearchDocuments: vi.fn(),
  mockProfile: vi.fn(),
}));

vi.mock("supermemory", () => ({
  default: class MockSuperMemory {
    add = mockAdd;
    search = { documents: mockSearchDocuments };
    profile = mockProfile;
  },
}));

vi.mock("@/env", () => ({
  env: {
    SUPERMEMORY_API_KEY: "test-supermemory-key",
  },
}));

// Must import after mocks
import { Memory } from "@/lib/memory";

describe("Memory", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset the singleton so each test gets a fresh instance
    // @ts-expect-error accessing private static for testing
    Memory.instance = undefined;
  });

  describe("getInstance", () => {
    it("returns the same instance (singleton)", () => {
      const a = Memory.getInstance();
      const b = Memory.getInstance();
      expect(a).toBe(b);
    });
  });

  describe("saveInMemory", () => {
    it("calls memory.add with correct content and containerTag", async () => {
      mockAdd.mockResolvedValue({ id: "doc_123" });

      const mem = Memory.getInstance();
      const result = await mem.saveInMemory("My journal entry", "user_1");

      expect(mockAdd).toHaveBeenCalledWith({
        content: "My journal entry",
        containerTag: "user_1",
      });
      expect(result).toEqual({ id: "doc_123" });
    });

    it("throws on failure", async () => {
      mockAdd.mockRejectedValue(new Error("API error"));

      const mem = Memory.getInstance();
      await expect(
        mem.saveInMemory("text", "user_1"),
      ).rejects.toThrow("API error");
    });
  });

  describe("recallMemory", () => {
    it("calls memory.search.documents with correct params", async () => {
      const mockResults = {
        results: [{ content: "Past entry" }],
      };
      mockSearchDocuments.mockResolvedValue(mockResults);

      const mem = Memory.getInstance();
      const result = await mem.recallMemory("search query", "user_1");

      expect(mockSearchDocuments).toHaveBeenCalledWith({
        q: "search query",
        containerTags: ["user_1"],
      });
      expect(result).toEqual(mockResults);
    });

    it("throws on failure", async () => {
      mockSearchDocuments.mockRejectedValue(new Error("Search failed"));

      const mem = Memory.getInstance();
      await expect(
        mem.recallMemory("query", "user_1"),
      ).rejects.toThrow("Search failed");
    });
  });

  describe("getUserProfile", () => {
    it("calls memory.profile with correct containerTag", async () => {
      const mockProfileData = { summary: "User is a developer" };
      mockProfile.mockResolvedValue(mockProfileData);

      const mem = Memory.getInstance();
      const result = await mem.getUserProfile("user_1");

      expect(mockProfile).toHaveBeenCalledWith({
        containerTag: "user_1",
      });
      expect(result).toEqual(mockProfileData);
    });

    it("throws on failure", async () => {
      mockProfile.mockRejectedValue(new Error("Profile error"));

      const mem = Memory.getInstance();
      await expect(
        mem.getUserProfile("user_1"),
      ).rejects.toThrow("Profile error");
    });
  });
});
