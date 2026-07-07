"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { UserButton } from "@clerk/nextjs";
import { useConversations } from "@/lib/conversations-context";
import { api } from "@/trpc/react";
import { ChatCircleDots, Plus, Trash } from "@phosphor-icons/react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/app/_components/AppSidebar";

function ConversationList({ activeId }: { activeId?: number }) {
  const { conversations, isLoading, refetch } = useConversations();
  const router = useRouter();
  const [deleteTarget, setDeleteTarget] = useState<{
    id: number;
    title: string;
  } | null>(null);

  const deleteConversation = api.conversation.delete.useMutation({
    onSuccess: () => {
      refetch();
      setDeleteTarget(null);
      router.push("/chat");
    },
  });

  if (isLoading) {
    return (
      <div className="p-4 text-center text-sm text-secondary italic">
        Loading chats...
      </div>
    );
  }

  if (!conversations.length) {
    return (
      <p className="text-sm text-secondary italic px-md py-sm">
        No conversations yet.
      </p>
    );
  }

  return (
    <>
      <div className="space-y-[8px]">
        {conversations.map((conv) => {
          const isActive = conv.id === activeId;
          return (
            <div
              key={conv.id}
              className={`relative p-md rounded-2xl transition-all cursor-pointer border ${
                isActive
                  ? "bg-surface-container-lowest border-black/5 card-shadow"
                  : "bg-surface hover:bg-surface-container border-transparent"
              }`}
            >
              <Link href={`/chat/${conv.id}`} className="absolute inset-0 rounded-2xl">
                <span className="sr-only">Open {conv.title ?? "New conversation"}</span>
              </Link>
              <div className="relative flex justify-between items-center mb-[4px]">
                <h3 className={`font-title-md text-title-md truncate flex-1 transition-colors ${isActive ? "text-primary font-semibold" : ""}`}>
                  {conv.title ?? "New conversation"}
                </h3>
                <button
                  type="button"
                  className="relative z-10 p-1 rounded hover:bg-surface-container text-secondary hover:text-primary transition-all cursor-pointer shrink-0 ml-2"
                  title="Delete"
                  onClick={(e) => {
                    e.stopPropagation();
                    setDeleteTarget({
                      id: conv.id,
                      title: conv.title ?? "New conversation",
                    });
                  }}
                >
                  <Trash size={14} weight="bold" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <Dialog
        open={!!deleteTarget}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null);
        }}
      >
        <DialogContent className="!w-[calc(100%-2rem)] sm:!w-[400px] !max-w-[400px] !rounded-[12px] !border !border-[var(--rule-soft)] !p-6 !shadow-[0_8px_40px_rgba(33,28,22,0.12)] !ring-0 flex flex-col gap-6 font-body select-none">
          <DialogHeader>
            <DialogTitle>Delete conversation</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete &ldquo;{deleteTarget?.title}
              &rdquo;? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose
              className="px-5 py-2.5 rounded-full border border-black/10 bg-surface-container text-on-surface text-sm font-medium hover:bg-surface-container-high transition-colors cursor-pointer"
            >
              Cancel
            </DialogClose>
            <button
              type="button"
              disabled={deleteConversation.isPending}
              onClick={() => {
                if (deleteTarget) {
                  deleteConversation.mutate({ id: deleteTarget.id });
                }
              }}
              className="px-5 py-2.5 rounded-full bg-red text-white text-sm font-semibold hover:bg-red-d transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {deleteConversation.isPending ? "Deleting..." : "Delete"}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default function ChatPage() {
  const router = useRouter();
  const { refetch } = useConversations();
  const createConversation = api.conversation.create.useMutation({
    onSuccess: (data) => {
      refetch();
      router.push(`/chat/${data.conversation.id}`);
    },
  });

  useEffect(() => {
    window.scrollTo(0, 0);
    document.body.classList.add("layout-locked");
    document.documentElement.classList.add("layout-locked");
    return () => {
      document.body.classList.remove("layout-locked");
      document.documentElement.classList.remove("layout-locked");
    };
  }, []);

  return (
    <SidebarProvider className="landing-theme layout-locked h-dvh overflow-hidden bg-background text-on-background">
      <AppSidebar />
      <SidebarInset className="!h-dvh !max-h-dvh flex flex-col overflow-hidden">
        {/* Top Shell Navigation */}
        <header className="w-full shrink-0 z-50 bg-surface/70 backdrop-blur-xl border-b border-black/5 flex justify-between items-center px-md py-sm shadow-sm">
          <div className="flex items-center gap-2">
            <SidebarTrigger />
            <Link href="/" className="font-display-md text-display-md font-semibold text-primary tablet:hidden">
              Comrade AI
            </Link>
          </div>
          <div className="flex items-center gap-md">
            <div className="hidden tablet:flex gap-md items-center">
              <Link href="/write" className="text-secondary hover:text-primary transition-colors font-body-md">
                Journal
              </Link>
              <Link href="/chat" className="text-primary border-b-2 border-primary font-body-md">
                Chat
              </Link>
              <Link href="/talk" className="text-secondary hover:text-primary transition-colors font-body-md">
                Voice
              </Link>
            </div>
            <div className="flex items-center">
              <UserButton
                appearance={{
                  elements: {
                    userButtonAvatarBox: "w-[32px] h-[32px] border border-black/5",
                  },
                }}
              />
            </div>
          </div>
        </header>

        {/* Main Workspace Frame */}
        <div className="flex flex-1 min-h-0 overflow-hidden bg-background">
          {/* Chats Archive entries list column */}
          <section className="w-full tablet:w-[320px] lg:w-[384px] shrink-0 border-r border-black/5 flex flex-col overflow-hidden">
            <div className="p-md bg-surface/30">
              <div className="flex justify-between items-center mb-sm">
                <h2 className="font-headline-lg text-headline-lg">Chats</h2>
                <button
                  type="button"
                  className="p-1 rounded hover:bg-surface-container text-secondary hover:text-primary transition-colors cursor-pointer"
                  title="New Chat"
                  onClick={() => createConversation.mutate({})}
                  disabled={createConversation.isPending}
                >
                  <Plus size={20} weight="bold" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-sm pb-[40px]">
              <ConversationList />
            </div>
          </section>

          {/* Empty state chat view */}
          <section className="flex-1 min-w-0 flex flex-col items-center justify-center bg-surface-container-lowest/50 p-lg text-center relative">
            <div className="absolute top-0 right-0 w-[256px] h-[256px] bg-primary/5 rounded-full blur-3xl -mr-[128px] -mt-[128px] pointer-events-none"></div>
            <div className="max-w-md z-10">
              <ChatCircleDots
                size={64}
                className="mx-auto mb-md text-primary/40"
                weight="duotone"
              />
              <h3 className="font-display-md text-display-md text-on-background mb-sm">
                Ask Comrade
              </h3>
              <p className="font-body-lg text-secondary mb-lg">
                Select a conversation from the sidebar or start a new chat with Comrade AI.
              </p>
              <button
                type="button"
                onClick={() => createConversation.mutate({})}
                disabled={createConversation.isPending}
                className="bg-primary text-on-primary font-semibold px-[24px] py-[12px] rounded-full hover:shadow-lg hover:shadow-primary/20 transition-all active:scale-95 cursor-pointer"
              >
                New Chat
              </button>
            </div>
          </section>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
