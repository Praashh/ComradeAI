"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Masthead from "@/app/_components/Masthead";
import { useConversations } from "@/lib/conversations-context";
import { api } from "@/trpc/react";
import { ChatCircleDots, Plus, Trash } from "@phosphor-icons/react";
import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

function ConversationList() {
  const { conversations, isLoading, refetch } = useConversations();
  const [deleteTarget, setDeleteTarget] = useState<{
    id: number;
    title: string;
  } | null>(null);

  const deleteConversation = api.conversation.delete.useMutation({
    onSuccess: () => {
      refetch();
      setDeleteTarget(null);
    },
  });

  if (isLoading) {
    return (
      <SidebarMenu>
        {Array.from({ length: 3 }).map((_, i) => (
          <SidebarMenuItem key={i}>
            <SidebarMenuButton disabled>
              <span className="text-[var(--ink-3)] text-xs italic">
                Loading...
              </span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    );
  }

  if (!conversations.length) {
    return (
      <p className="text-xs text-[var(--ink-3)] italic px-2 py-1">
        No conversations yet.
      </p>
    );
  }

  return (
    <>
      <SidebarMenu>
        {conversations.map((conv) => (
          <SidebarMenuItem key={conv.id}>
            <SidebarMenuButton
              render={<Link href={`/chat/${conv.id}`} />}
              className="group"
            >
              <ChatCircleDots size={16} weight="duotone" />
              <span className="flex-1 truncate">
                {conv.title ?? "New conversation"}
              </span>
              <button
                type="button"
                className="opacity-0 group-hover:opacity-100 p-0.5 rounded hover:bg-[var(--paper-3)] text-[var(--ink-3)] hover:text-[var(--red)] transition-all cursor-pointer"
                title="Delete"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setDeleteTarget({
                    id: conv.id,
                    title: conv.title ?? "New conversation",
                  });
                }}
              >
                <Trash size={14} weight="bold" />
              </button>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>

      <Dialog
        open={!!deleteTarget}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete conversation</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete &ldquo;{deleteTarget?.title}
              &rdquo;? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose render={<Button variant="outline" />}>
              Cancel
            </DialogClose>
            <Button
              variant="destructive"
              disabled={deleteConversation.isPending}
              onClick={() => {
                if (deleteTarget) {
                  deleteConversation.mutate({ id: deleteTarget.id });
                }
              }}
            >
              {deleteConversation.isPending ? "Deleting..." : "Delete"}
            </Button>
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

  return (
    <div className="chat-workspace flex flex-col h-screen overflow-hidden">
      <div className="shrink-0">
        <Masthead />
      </div>
      <SidebarProvider className="flex-1 min-h-0">
        <div className="flex flex-1 w-full relative overflow-hidden">
          <Sidebar side="left" collapsible="offcanvas">
            <SidebarHeader className="p-4 border-b border-[var(--rule-soft)]">
              <div className="flex items-center justify-between">
                <span className="font-serif italic text-lg text-[var(--ink)] tracking-wide">
                  Chats
                </span>
                <button
                  type="button"
                  className="p-0.5 rounded hover:bg-[var(--paper-3)] text-[var(--ink-3)] hover:text-[var(--ink)] transition-colors cursor-pointer"
                  title="New Chat"
                  onClick={() => createConversation.mutate({})}
                  disabled={createConversation.isPending}
                >
                  <Plus size={16} weight="bold" />
                </button>
              </div>
            </SidebarHeader>
            <SidebarContent className="p-2 gap-4">
              <SidebarGroup>
                <SidebarGroupLabel>Your Conversations</SidebarGroupLabel>
                <SidebarGroupContent>
                  <ConversationList />
                </SidebarGroupContent>
              </SidebarGroup>
            </SidebarContent>
            <SidebarFooter className="p-4 border-t border-[var(--rule-soft)]" />
          </Sidebar>

          <main className="flex-1 min-h-0 px-6 py-12 overflow-y-auto flex items-center justify-center">
            <div className="text-center">
              <ChatCircleDots
                size={48}
                weight="duotone"
                className="mx-auto mb-4 text-[var(--ink-3)]"
              />
              <p className="text-sm text-[var(--ink-3)] italic mb-4">
                Start a conversation with Mira.
              </p>
              <button
                type="button"
                onClick={() => createConversation.mutate({})}
                disabled={createConversation.isPending}
                className="sidebar-action-btn inline-flex !w-auto"
              >
                <Plus size={16} weight="bold" />
                <span>New Chat</span>
              </button>
            </div>
          </main>
        </div>
      </SidebarProvider>
    </div>
  );
}
