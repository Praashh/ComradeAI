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
import { MobileBottomNav } from "@/app/_components/MobileBottomNav";

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
      <div className="p-4 text-center text-sm text-white/40 italic">
        Loading chats...
      </div>
    );
  }

  if (!conversations.length) {
    return (
      <p className="text-sm text-white/40 italic p-3 text-center">
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
              className={`relative p-3.5 rounded-[18px] transition-all cursor-pointer border ${
                isActive
                  ? "bg-white/15 border-white/20 shadow-lg text-white"
                  : "bg-white/5 hover:bg-white/10 border-white/10 text-white/80"
              }`}
            >
              <Link href={`/chat/${conv.id}`} className="absolute inset-0 rounded-[18px]">
                <span className="sr-only">Open {conv.title ?? "New conversation"}</span>
              </Link>
              <div className="relative flex justify-between items-center">
                <h3 className={`font-satoshi text-sm truncate flex-1 transition-colors ${isActive ? "text-white font-medium" : "text-white/80"}`}>
                  {conv.title ?? "New conversation"}
                </h3>
                <button
                  type="button"
                  className="relative z-10 p-1.5 rounded-lg hover:bg-white/10 text-white/50 hover:text-white transition-all cursor-pointer shrink-0 ml-2"
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
        <DialogContent className="!w-[calc(100%-2rem)] sm:!w-[400px] !max-w-[400px] !rounded-[24px] !border !border-white/15 !bg-[#121212] !p-6 !shadow-2xl !shadow-black/90 !ring-0 flex flex-col gap-6 font-satoshi select-none text-white">
          <DialogHeader>
            <DialogTitle className="text-xl font-medium tracking-tight text-white font-satoshi">Delete conversation</DialogTitle>
            <DialogDescription className="text-sm text-white/60 font-satoshi mt-1">
              Are you sure you want to delete &ldquo;{deleteTarget?.title}&rdquo;? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 pt-2">
            <DialogClose
              className="px-5 py-2.5 rounded-full border border-white/15 bg-white/5 text-white text-sm font-medium hover:bg-white/10 transition-colors cursor-pointer"
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
              className="px-5 py-2.5 rounded-full bg-red text-white text-sm font-semibold hover:bg-red-d transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
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
    <SidebarProvider className="landing-theme layout-locked h-dvh overflow-hidden bg-[#0a0a0a] text-white">
      <AppSidebar />
      <SidebarInset className="!h-dvh !max-h-dvh flex flex-col overflow-hidden bg-[#0a0a0a]">
        {/* Top Shell Navigation */}
        <header className="w-full shrink-0 z-50 bg-[#0a0a0a]/80 backdrop-blur-xl border-b border-white/10 flex justify-between items-center px-4 py-3 sm:px-6 shadow-sm">
          <div className="flex items-center gap-2">
            <SidebarTrigger />
            <Link href="/" className="font-instrument text-xl font-normal text-white tablet:hidden">
              ComradeAI
            </Link>
          </div>
          <div className="flex items-center">
            <UserButton
              appearance={{
                elements: {
                  userButtonAvatarBox: "w-[32px] h-[32px] border border-white/20",
                },
              }}
            />
          </div>
        </header>

        {/* Main Workspace Frame */}
        <div className="flex flex-1 min-h-0 overflow-hidden bg-[#0a0a0a]">
          {/* Chats Archive entries list column */}
          <section className="w-full tablet:w-[320px] lg:w-[384px] shrink-0 border-r border-white/10 flex flex-col overflow-hidden bg-[#0a0a0a] flex-1 tablet:flex-initial">
            <div className="p-4 bg-white/5 border-b border-white/10">
              <div className="flex justify-between items-center">
                <h2 className="font-instrument text-xl font-normal text-white">Chats</h2>
                <button
                  type="button"
                  className="p-1.5 rounded-full hover:bg-white/10 text-white/70 hover:text-white transition-colors cursor-pointer"
                  title="New Chat"
                  onClick={() => createConversation.mutate({})}
                  disabled={createConversation.isPending}
                >
                  <Plus size={18} weight="bold" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-3 pb-28 space-y-2">
              <ConversationList />
            </div>
          </section>

          {/* Empty state chat view */}
          <section className="hidden tablet:flex flex-1 min-w-0 flex-col items-center justify-center bg-[#0d0d0d] p-8 text-center relative">
            <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-white/5 rounded-full blur-3xl pointer-events-none" />
            <div className="max-w-md z-10">
              <ChatCircleDots
                size={56}
                className="mx-auto mb-4 text-white/30"
                weight="duotone"
              />
              <h3 className="font-instrument text-[32px] font-normal text-white mb-2">
                Ask Comrade
              </h3>
              <p className="font-satoshi text-sm text-white/60 mb-6 leading-relaxed">
                Select a conversation from the list or start a new chat to reflect with Comrade AI.
              </p>
              <button
                type="button"
                onClick={() => createConversation.mutate({})}
                disabled={createConversation.isPending}
                className="font-satoshi bg-white text-black font-semibold px-6 py-2.5 rounded-full hover:bg-white/90 transition-all active:scale-95 cursor-pointer shadow-lg"
              >
                New Chat
              </button>
            </div>
          </section>
        </div>
      </SidebarInset>

      {/* Mobile Bottom Navigation Bar */}
      <MobileBottomNav />

      {/* Mobile Floating Action Button */}
      <button
        type="button"
        onClick={() => createConversation.mutate({})}
        disabled={createConversation.isPending}
        className="tablet:hidden fixed right-6 bottom-20 w-14 h-14 bg-white text-black rounded-full shadow-xl flex items-center justify-center z-50 cursor-pointer hover:scale-105 active:scale-95 transition-transform"
        title="New Chat"
      >
        <Plus size={24} weight="bold" />
      </button>
    </SidebarProvider>
  );
}
