import { describe, it, expect, vi, beforeEach } from "vitest";
import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

const { mockMutate, mockPush, mockRefetch } = vi.hoisted(() => ({
  mockMutate: vi.fn(),
  mockPush: vi.fn(),
  mockRefetch: vi.fn(),
}));

vi.mock("@/trpc/react", () => ({
  api: {
    journal: {
      create: {
        useMutation: (opts?: {
          onSuccess?: (data: unknown) => void;
          onError?: (err: unknown) => void;
        }) => ({
          mutate: (...args: unknown[]) => {
            mockMutate(...args);
            opts?.onSuccess?.({ journal: { id: 42 } });
          },
          isPending: false,
        }),
      },
    },
  },
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush }),
}));

vi.mock("@/lib/journals-context", () => ({
  useJournals: () => ({
    journals: [],
    isLoading: false,
    refetch: mockRefetch,
  }),
}));

// Stub phosphor icons used by NewJournalDialog
vi.mock("@phosphor-icons/react", async (importOriginal) => {
  const actual = (await importOriginal()) as Record<string, unknown>;

  // Create a stub that returns a span for any icon
  const createStub = (name: string) =>
    function StubIcon(props: Record<string, unknown>) {
      return React.createElement("span", {
        "data-testid": `icon-${name}`,
        ...props,
      });
    };

  // Build stubs for all icon names used in the component
  const iconNames = [
    "MaskHappy", "Smiley", "SmileyWink", "SmileySad", "SmileyMeh", "Heart",
    "Sparkle", "Star", "Crown", "Trophy", "House", "Bed",
    "Tree", "Leaf", "Mountains", "Sun", "Moon", "CloudRain",
    "Flame", "Lightning", "Snowflake", "Globe", "BookOpen", "Notebook",
    "Pen", "Palette", "MusicNotes", "Camera", "Airplane", "Bicycle",
    "Car", "Briefcase", "Key", "Lightbulb", "Coffee", "Wine",
    "Pizza", "Gift", "Clock", "Compass", "Brain", "Medal",
    "Dog", "Cat", "Anchor", "PuzzlePiece", "Signpost", "Hourglass",
    "CircleNotch",
  ];

  const stubs: Record<string, unknown> = { ...actual };
  for (const name of iconNames) {
    stubs[name] = createStub(name);
  }

  return stubs;
});

// Stub dialog components
vi.mock("@/components/ui/dialog", () => ({
  Dialog: function MockDialog({
    children,
    open,
  }: {
    children: React.ReactNode;
    open: boolean;
  }) {
    return open ? React.createElement("div", { "data-testid": "dialog" }, children) : null;
  },
  DialogTrigger: function MockTrigger({ children }: { children: React.ReactNode }) {
    return React.createElement("span", { "data-testid": "dialog-trigger" }, children);
  },
  DialogContent: function MockContent({ children }: { children: React.ReactNode }) {
    return React.createElement("div", { "data-testid": "dialog-content" }, children);
  },
}));

// Dynamic import after all mocks
const { default: NewJournalDialog } = await import("@/app/_components/NewJournalDialog");

describe("NewJournalDialog", () => {
  const user = userEvent.setup();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders dialog content when defaultOpen is true", () => {
    render(
      <NewJournalDialog defaultOpen={true}>
        <button>New</button>
      </NewJournalDialog>,
    );
    expect(screen.getByPlaceholderText("Journal Name")).toBeInTheDocument();
  });

  it("shows error when submitting with empty title", async () => {
    render(
      <NewJournalDialog defaultOpen={true}>
        <button>New</button>
      </NewJournalDialog>,
    );

    await user.click(screen.getByText("Done"));
    expect(
      screen.getByText("Please enter a journal name."),
    ).toBeInTheDocument();
    expect(mockMutate).not.toHaveBeenCalled();
  });

  it("calls mutate with correct values on submit", async () => {
    render(
      <NewJournalDialog defaultOpen={true}>
        <button>New</button>
      </NewJournalDialog>,
    );

    await user.type(screen.getByPlaceholderText("Journal Name"), "My Journal");
    await user.click(screen.getByText("Done"));

    expect(mockMutate).toHaveBeenCalledWith({
      title: "My Journal",
      mood: undefined,
      icon: "MaskHappy",
      color: "#6E56CF",
    });
  });

  it("sets mood when clicking a quick mood button", async () => {
    render(
      <NewJournalDialog defaultOpen={true}>
        <button>New</button>
      </NewJournalDialog>,
    );

    await user.click(screen.getByText("Happy 😊"));
    await user.type(screen.getByPlaceholderText("Journal Name"), "Test");
    await user.click(screen.getByText("Done"));

    expect(mockMutate).toHaveBeenCalledWith(
      expect.objectContaining({ mood: "Happy" }),
    );
  });

  it("navigates to /write/{id} on success", async () => {
    render(
      <NewJournalDialog defaultOpen={true}>
        <button>New</button>
      </NewJournalDialog>,
    );

    await user.type(screen.getByPlaceholderText("Journal Name"), "Test");
    await user.click(screen.getByText("Done"));

    expect(mockPush).toHaveBeenCalledWith("/write/42");
  });

  it("refetches journals on success", async () => {
    render(
      <NewJournalDialog defaultOpen={true}>
        <button>New</button>
      </NewJournalDialog>,
    );

    await user.type(screen.getByPlaceholderText("Journal Name"), "Test");
    await user.click(screen.getByText("Done"));

    expect(mockRefetch).toHaveBeenCalled();
  });

  it("renders color options", () => {
    render(
      <NewJournalDialog defaultOpen={true}>
        <button>New</button>
      </NewJournalDialog>,
    );

    expect(screen.getByText("Select theme color")).toBeInTheDocument();
    expect(screen.getByTitle("Purple")).toBeInTheDocument();
    expect(screen.getByTitle("Rose")).toBeInTheDocument();
  });

  it("renders icon grid", () => {
    render(
      <NewJournalDialog defaultOpen={true}>
        <button>New</button>
      </NewJournalDialog>,
    );

    expect(screen.getByText("Select journal icon")).toBeInTheDocument();
  });

  it("renders mood input and quick mood buttons", () => {
    render(
      <NewJournalDialog defaultOpen={true}>
        <button>New</button>
      </NewJournalDialog>,
    );

    expect(
      screen.getByPlaceholderText("How are you feeling today?"),
    ).toBeInTheDocument();
    expect(screen.getByText("Calm 😌")).toBeInTheDocument();
    expect(screen.getByText("Excited ⚡")).toBeInTheDocument();
  });
});
