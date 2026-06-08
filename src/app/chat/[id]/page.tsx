"use client";

import { useState, useRef, useEffect, useCallback, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Masthead from "@/app/_components/Masthead";
import { useConversations } from "@/lib/conversations-context";
import { api } from "@/trpc/react";
import {
  ChatCircleDots,
  Plus,
  Trash,
  PaperPlaneRight,
  CircleNotch,
} from "@phosphor-icons/react";
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

function ConversationList({ activeId }: { activeId: number }) {
  const { conversations, isLoading, refetch } = useConversations();
  const deleteConversation = api.conversation.delete.useMutation({
    onSuccess: () => refetch(),
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
    <SidebarMenu>
      {conversations.map((conv) => (
        <SidebarMenuItem key={conv.id}>
          <SidebarMenuButton
            isActive={conv.id === activeId}
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
                deleteConversation.mutate({ id: conv.id });
              }}
            >
              <Trash size={14} weight="bold" />
            </button>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
}

type Message = {
  id: number;
  conversationId: number;
  role: "user" | "assistant" | "system";
  content: string;
  createdAt: Date | null;
};

function MessageBubble({ message }: { message: Message }) {
  const isUser = message.role === "user";

  return (
    <div
      className={`flex ${isUser ? "justify-end" : "justify-start"} mb-4`}
    >
      <div
        className={`max-w-[75%] rounded-lg px-4 py-3 text-[0.95rem] leading-relaxed ${
          isUser
            ? "bg-[var(--red)] text-[var(--paper)]"
            : "bg-[var(--paper-2)] text-[var(--ink)] border border-[var(--rule-soft)]"
        }`}
      >
        <p className="whitespace-pre-wrap">{message.content}</p>
      </div>
    </div>
  );
}

function ChatView({ conversationId }: { conversationId: number }) {
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const router = useRouter();

  const { refetch: refetchConversations } = useConversations();

  const { data, isLoading } = api.conversation.get.useQuery({
    id: conversationId,
  });

  const createConversation = api.conversation.create.useMutation({
    onSuccess: (data) => {
      refetchConversations();
      router.push(`/chat/${data.conversation.id}`);
    },
  });

  const utils = api.useUtils();
  const sendMessage = api.conversation.sendMessage.useMutation({
    onSuccess: () => {
      void utils.conversation.get.invalidate({ id: conversationId });
      refetchConversations();
    },
  });

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [data?.messages, scrollToBottom]);

  const handleSend = useCallback(() => {
    const trimmed = input.trim();
    if (!trimmed || sendMessage.isPending) return;

    setInput("");
    sendMessage.mutate({
      conversationId,
      content: trimmed,
    });
  }, [input, conversationId, sendMessage]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSend();
      }
    },
    [handleSend],
  );

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <span className="text-[var(--ink-3)] text-sm italic">
          Loading conversation...
        </span>
      </div>
    );
  }

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
                  <ConversationList activeId={conversationId} />
                </SidebarGroupContent>
              </SidebarGroup>
            </SidebarContent>
            <SidebarFooter className="p-4 border-t border-[var(--rule-soft)]" />
          </Sidebar>

          <main className="flex-1 min-h-0 flex flex-col">
            {/* Chat header */}
            <div className="shrink-0 px-6 py-3 border-b border-[var(--rule-soft)]">
              <h1 className="font-serif italic text-lg text-[var(--ink)] truncate">
                {data?.conversation.title ?? "New conversation"}
              </h1>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-6 py-6">
              <div className="mx-auto max-w-2xl">
                {data?.messages.length === 0 && (
                  <div className="text-center py-12">
                    <ChatCircleDots
                      size={40}
                      weight="duotone"
                      className="mx-auto mb-3 text-[var(--ink-3)]"
                    />
                    <p className="text-sm text-[var(--ink-3)] italic">
                      Ask Mira anything about your journals and thoughts.
                    </p>
                  </div>
                )}

                {data?.messages.map((msg) => (
                  <MessageBubble key={msg.id} message={msg} />
                ))}

                {sendMessage.isPending && (
                  <div className="flex justify-start mb-4">
                    <div className="bg-[var(--paper-2)] border border-[var(--rule-soft)] rounded-lg px-4 py-3 flex items-center gap-2">
                      <CircleNotch
                        size={16}
                        weight="bold"
                        className="animate-spin text-[var(--ink-3)]"
                      />
                      <span className="text-sm text-[var(--ink-3)] italic">
                        Mira is thinking...
                      </span>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>
            </div>

            {/* Input area */}
            <div className="shrink-0 border-t border-[var(--rule-soft)] px-6 py-4">
              <div className="mx-auto max-w-2xl flex gap-3 items-end">
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Type a message..."
                  rows={1}
                  className="flex-1 resize-none bg-[var(--paper-2)] border border-[var(--rule-soft)] rounded-lg px-4 py-3 text-[var(--ink)] text-[0.95rem] font-body placeholder:text-[var(--ink-3)] placeholder:italic focus:outline-none focus:border-[var(--rule)] transition-colors"
                  style={{ maxHeight: "120px" }}
                  onInput={(e) => {
                    const target = e.target as HTMLTextAreaElement;
                    target.style.height = "auto";
                    target.style.height = `${Math.min(target.scrollHeight, 120)}px`;
                  }}
                />
                <button
                  onClick={handleSend}
                  disabled={!input.trim() || sendMessage.isPending}
                  className="shrink-0 w-10 h-10 flex items-center justify-center rounded-lg bg-[var(--red)] text-[var(--paper)] hover:bg-[var(--red-d)] disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
                  title="Send message"
                >
                  <PaperPlaneRight size={18} weight="fill" />
                </button>
              </div>
            </div>
          </main>
        </div>
      </SidebarProvider>
    </div>
  );
}

export default function ChatConversationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const conversationId = Number(id);

  return <ChatView conversationId={conversationId} />;
}
