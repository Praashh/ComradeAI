"use client";

import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useConversations } from "@/lib/conversations-context";
import { api } from "@/trpc/react";
import {
  ChatCircleDots,
  Plus,
  Trash,
  PencilSimple,
  PaperPlaneRight,
  CircleNotch,
} from "@phosphor-icons/react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { AppShell } from "@/app/_components/AppShell";
import { useLayoutLock } from "@/hooks/use-layout-lock";
import { toast } from "sonner";

// Format timestamp helper
function formatConversationDate(dateObj?: Date | string | null) {
  if (!dateObj) return "Recently";
  const d = new Date(dateObj);
  const today = new Date();

  const isToday = d.toDateString() === today.toDateString();
  const timeStr = d.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });

  if (isToday) {
    return `Today, ${timeStr}`;
  }

  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

type Message = {
  id: number;
  conversationId: number;
  role: "user" | "assistant" | "system";
  content: string;
  createdAt: Date | string | null;
};

function MessageBubble({ message }: { message: Message }) {
  const isUser = message.role === "user";

  return (
    <div
      className={`flex flex-col ${isUser ? "items-end" : "items-start"} mb-6`}
    >
      <span
        className={`text-[10px] font-bold tracking-widest uppercase mb-1.5 ${isUser ? "text-white/40" : "text-white/80"
          }`}
      >
        {isUser ? "YOU" : "COMRADE AI"}
      </span>
      <div
        className={`max-w-[80%] sm:max-w-[70%] rounded-[24px] px-6 py-4 text-[0.95rem] leading-relaxed shadow-lg ${isUser
            ? "bg-white text-black font-medium rounded-br-none"
            : "bg-[#161618] text-white/90 rounded-bl-none border border-white/12"
          }`}
      >
        <p className="whitespace-pre-wrap">{message.content}</p>
      </div>
    </div>
  );
}

function ChatSkeleton() {
  return (
    <div className="flex-1 min-h-0 flex flex-col bg-[#0d0d0d] relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[256px] h-[256px] bg-white/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header skeleton */}
      <div className="shrink-0 px-6 py-4 border-b border-white/10 flex items-center gap-3 z-10 bg-[#0a0a0a]/60">
        <div className="w-8 h-8 rounded-full bg-white/10 animate-pulse" />
        <div className="h-5 w-44 bg-white/10 rounded-md animate-pulse" />
      </div>

      {/* Message list skeleton */}
      <div className="flex-1 overflow-y-auto px-6 py-8 z-10">
        <div className="mx-auto max-w-2xl space-y-6">
          <div className="flex flex-col items-end">
            <div className="h-3 w-10 bg-white/10 rounded animate-pulse mb-1.5" />
            <div className="max-w-[75%] rounded-[24px] rounded-br-none px-6 py-4 bg-white/20 animate-pulse w-52 h-14" />
          </div>
          <div className="flex flex-col items-start">
            <div className="h-3 w-20 bg-white/10 rounded animate-pulse mb-1.5" />
            <div className="max-w-[75%] rounded-[24px] rounded-bl-none px-6 py-4 bg-white/5 border border-white/10 animate-pulse w-80 h-20" />
          </div>
          <div className="flex flex-col items-end">
            <div className="h-3 w-10 bg-white/10 rounded animate-pulse mb-1.5" />
            <div className="max-w-[75%] rounded-[24px] rounded-br-none px-6 py-4 bg-white/20 animate-pulse w-64 h-14" />
          </div>
        </div>
      </div>

      {/* Input area skeleton */}
      <div className="shrink-0 border-t border-white/10 px-4 sm:px-6 py-3 pb-20 tablet:pb-4 bg-[#0a0a0a] z-10">
        <div className="mx-auto max-w-2xl h-[48px] bg-[#141416] border border-white/12 rounded-3xl animate-pulse" />
      </div>
    </div>
  );
}

const SUGGESTIONS = [
  "Explore the stillness",
  "I'm done for now",
  "Suggest a meditation",
];

interface ChatDashboardProps {
  activeConversationId?: number;
}

export default function ChatDashboard({
  activeConversationId,
}: ChatDashboardProps) {
  const router = useRouter();
  const {
    conversations,
    isLoading: conversationsLoading,
    refetch: refetchConversations,
  } = useConversations();

  const [searchQuery, setSearchQuery] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<{
    id: number;
    title: string;
  } | null>(null);
  const [renameTarget, setRenameTarget] = useState<{
    id: number;
    title: string;
  } | null>(null);
  const [renameInput, setRenameInput] = useState("");

  const [input, setInput] = useState("");
  const [optimisticMessage, setOptimisticMessage] = useState<string | null>(
    null,
  );
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const utils = api.useUtils();

  // Create conversation
  const createConversation = api.conversation.create.useMutation({
    onSuccess: (data) => {
      refetchConversations();
      router.push(`/chat/${data.conversation.id}`);
    },
  });

  // Delete conversation
  const deleteConversation = api.conversation.delete.useMutation({
    onSuccess: () => {
      refetchConversations();
      setDeleteTarget(null);
      if (deleteTarget?.id === activeConversationId) {
        router.push("/chat");
      }
    },
  });

  // Rename conversation
  const updateTitle = api.conversation.updateTitle.useMutation({
    onSuccess: (data) => {
      refetchConversations();
      if (activeConversationId === data.conversation.id) {
        utils.conversation.get.setData({ id: activeConversationId }, (old) => {
          if (!old) return old;
          return {
            ...old,
            conversation: data.conversation,
          };
        });
      }
      setRenameTarget(null);
    },
  });

  // Active chat query
  const { data: activeChatData, isLoading: activeChatLoading } =
    api.conversation.get.useQuery(
      { id: activeConversationId! },
      { enabled: !!activeConversationId },
    );

  // Guard: if a conversation ID was provided but the conversation doesn't exist, redirect back
  useEffect(() => {
    if (activeConversationId && !activeChatLoading && !activeChatData) {
      toast.error("Conversation not found");
      router.replace("/chat");
    }
  }, [activeConversationId, activeChatLoading, activeChatData, router]);


  const { data: journalsData } = api.journal.getAllJournals.useQuery();
  const latestJournal = journalsData?.journals?.[0];

  // Send message mutation
  const sendMessage = api.conversation.sendMessage.useMutation({
    onSuccess: (result) => {
      setOptimisticMessage(null);
      if (activeConversationId) {
        utils.conversation.get.setData({ id: activeConversationId }, (old) => {
          if (!old) return old;
          return {
            ...old,
            messages: [
              ...old.messages,
              result.userMessage,
              result.assistantMessage,
            ],
          };
        });
      }
      refetchConversations();
    },
    onError: () => setOptimisticMessage(null),
  });

  const scrollToBottom = useCallback(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTo({
        top: messagesContainerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [activeChatData?.messages, optimisticMessage, scrollToBottom]);

  const handleSend = useCallback(() => {
    const trimmed = input.trim();
    if (!trimmed || sendMessage.isPending || !activeConversationId) return;
    setOptimisticMessage(trimmed);
    setInput("");
    if (inputRef.current) inputRef.current.style.height = "auto";
    sendMessage.mutate({
      conversationId: activeConversationId,
      content: trimmed,
    });
  }, [input, activeConversationId, sendMessage]);

  const handleSuggestionClick = (text: string) => {
    if (sendMessage.isPending || !activeConversationId) return;
    setOptimisticMessage(text);
    sendMessage.mutate({
      conversationId: activeConversationId,
      content: text,
    });
  };

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSend();
      }
    },
    [handleSend],
  );

  const handleStartRename = (conv: { id: number; title: string | null }) => {
    setRenameTarget({
      id: conv.id,
      title: conv.title ?? "New conversation",
    });
    setRenameInput(conv.title ?? "New conversation");
  };

  const handleSaveRename = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!renameTarget || !renameInput.trim()) return;
    updateTitle.mutate({
      id: renameTarget.id,
      title: renameInput.trim(),
    });
  };

  const filteredConversations = useMemo(() => {
    if (!searchQuery.trim()) return conversations;
    const q = searchQuery.toLowerCase();
    return conversations.filter((c) =>
      (c.title ?? "New conversation").toLowerCase().includes(q),
    );
  }, [conversations, searchQuery]);

  useLayoutLock();

  return (
    <AppShell>
      {/* Main Workspace Frame */}
      <div className="flex flex-1 min-h-0 overflow-hidden bg-[#0a0a0a]">
        <main className="flex-1 flex flex-col tablet:flex-row overflow-hidden bg-[#0a0a0a]">
          {/* Chats Archive entries list column */}
          <section
            className={`w-full tablet:w-[320px] lg:w-[384px] shrink-0 border-r border-white/10 flex flex-col overflow-hidden bg-[#0a0a0a] ${activeConversationId
                ? "hidden tablet:flex"
                : "flex flex-1 tablet:flex-initial"
              }`}
          >
            <div className="p-4 bg-white/5 border-b border-white/10 space-y-3">
              <div className="flex justify-between items-center">
                <h2 className="font-instrument text-xl font-normal text-white">
                  Chats
                </h2>
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

              {/* Search chats */}
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-white/50 text-base">
                  search
                </span>
                <input
                  className="w-full bg-white/5 border border-white/10 rounded-full py-2 pl-9 pr-4 text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-white/30"
                  placeholder="Search chats..."
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  aria-label="Search chats"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-3 pb-28 space-y-2">
              {conversationsLoading ? (
                <div className="p-4 text-center text-sm text-white/40 italic">
                  Loading chats...
                </div>
              ) : filteredConversations.length === 0 ? (
                <div className="p-4 text-center text-sm text-white/40 italic">
                  {searchQuery ? "No matching chats." : "No conversations yet."}
                </div>
              ) : (
                filteredConversations.map((conv) => {
                  const isActive = conv.id === activeConversationId;
                  const title = conv.title ?? "New conversation";

                  return (
                    <div
                      key={conv.id}
                      onClick={() => router.push(`/chat/${conv.id}`)}
                      className={`group w-full text-left p-3.5 rounded-[18px] transition-all cursor-pointer border flex justify-between items-center gap-2 ${isActive
                          ? "bg-white/15 border-white/20 shadow-lg text-white"
                          : "bg-white/5 hover:bg-white/10 border-white/10 text-white/80"
                        }`}
                    >
                      <div className="flex-1 min-w-0 pr-1">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-[11px] text-white/40 font-satoshi">
                            {formatConversationDate(
                              conv.updatedAt ?? conv.createdAt,
                            )}
                          </span>
                        </div>
                        <h3
                          className={`font-satoshi text-sm truncate transition-colors ${isActive
                              ? "text-white font-medium"
                              : "text-white/90 group-hover:text-white"
                            }`}
                        >
                          {title}
                        </h3>
                      </div>

                      {/* Action buttons */}
                      <div className="flex items-center gap-1 shrink-0 opacity-80 group-hover:opacity-100 transition-opacity">
                        <button
                          type="button"
                          className="p-1.5 rounded-lg hover:bg-white/15 text-white/50 hover:text-white transition-all cursor-pointer"
                          title="Rename"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleStartRename(conv);
                          }}
                        >
                          <PencilSimple size={14} weight="bold" />
                        </button>
                        <button
                          type="button"
                          className="p-1.5 rounded-lg hover:bg-white/15 text-white/50 hover:text-red-400 transition-all cursor-pointer"
                          title="Delete"
                          onClick={(e) => {
                            e.stopPropagation();
                            setDeleteTarget({
                              id: conv.id,
                              title,
                            });
                          }}
                        >
                          <Trash size={14} weight="bold" />
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </section>

          {/* Active Conversation View or Empty State */}
          {activeConversationId ? (
            activeChatLoading ? (
              <ChatSkeleton />
            ) : (
              <section className="flex-1 min-w-0 min-h-0 flex flex-col bg-[#0d0d0d] relative overflow-hidden">
                <div className="absolute top-0 right-0 w-[256px] h-[256px] bg-white/5 rounded-full blur-3xl pointer-events-none" />

                {/* Chat header */}
                <div className="shrink-0 px-6 py-4 border-b border-white/10 flex items-center justify-between z-10 bg-[#0a0a0a]/60 backdrop-blur-md">
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <button
                      type="button"
                      onClick={() => router.push("/chat")}
                      className="tablet:hidden material-symbols-outlined p-2 hover:bg-white/10 rounded-full text-white/70 hover:text-white transition-colors cursor-pointer shrink-0"
                      title="Back to Chats"
                    >
                      arrow_back
                    </button>
                    <div className="flex items-center gap-2 min-w-0 flex-1">
                      <h1 className="font-instrument text-xl font-normal text-white truncate">
                        {activeChatData?.conversation.title ??
                          "New conversation"}
                      </h1>
                      <button
                        type="button"
                        onClick={() => {
                          if (activeChatData?.conversation) {
                            handleStartRename(activeChatData.conversation);
                          }
                        }}
                        className="p-1.5 rounded-lg hover:bg-white/10 text-white/50 hover:text-white transition-colors cursor-pointer shrink-0"
                        title="Rename conversation"
                      >
                        <PencilSimple size={15} weight="bold" />
                      </button>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      if (activeChatData?.conversation) {
                        setDeleteTarget({
                          id: activeChatData.conversation.id,
                          title:
                            activeChatData.conversation.title ??
                            "New conversation",
                        });
                      }
                    }}
                    className="p-2 rounded-full hover:bg-white/10 text-white/50 hover:text-red-400 transition-colors cursor-pointer shrink-0"
                    title="Delete Chat"
                  >
                    <Trash size={16} weight="bold" />
                  </button>
                </div>

                {/* Messages Container */}
                <div
                  ref={messagesContainerRef}
                  className="flex-1 overflow-y-auto px-4 sm:px-6 py-8 z-10"
                >
                  <div className="mx-auto max-w-2xl">
                    {latestJournal && (
                      <div className="flex justify-center mb-8">
                        <div className="inline-flex items-center gap-2 border border-white/12 bg-white/5 backdrop-blur-md rounded-full px-4 py-2 text-xs">
                          <span className="material-symbols-outlined text-sm text-white/60">
                            link
                          </span>
                          <span className="text-white/60 font-medium">
                            Referenced Context:{" "}
                            <strong className="text-white font-semibold">
                              &ldquo;
                              {latestJournal.title ?? "Untitled Entry"}
                              &rdquo;
                            </strong>
                          </span>
                          <span className="text-white/20 mx-1">|</span>
                          <Link
                            href={`/write/${latestJournal.id}`}
                            className="text-white font-semibold underline hover:text-white/80"
                          >
                            View Journal
                          </Link>
                        </div>
                      </div>
                    )}

                    {activeChatData?.messages.length === 0 &&
                      !optimisticMessage && (
                        <div className="text-center py-12">
                          <ChatCircleDots
                            size={40}
                            weight="duotone"
                            className="mx-auto mb-3 text-white/30"
                          />
                          <p className="text-sm text-white/50 italic">
                            Ask Comrade anything about your thoughts, memories,
                            and reflections.
                          </p>
                        </div>
                      )}

                    {activeChatData?.messages.map((msg) => (
                      <MessageBubble key={msg.id} message={msg} />
                    ))}

                    {optimisticMessage && (
                      <div className="flex flex-col items-end mb-6">
                        <span className="text-[10px] font-bold tracking-widest uppercase mb-1.5 text-white/40">
                          YOU
                        </span>
                        <div className="max-w-[80%] sm:max-w-[70%] rounded-[24px] rounded-br-none px-6 py-4 text-[0.95rem] leading-relaxed shadow-lg bg-white text-black font-medium">
                          <p className="whitespace-pre-wrap">
                            {optimisticMessage}
                          </p>
                        </div>
                      </div>
                    )}

                    {sendMessage.isPending && (
                      <div className="flex flex-col items-start mb-6">
                        <span className="text-[10px] font-bold tracking-widest uppercase mb-1.5 text-white/80">
                          COMRADE AI
                        </span>
                        <div className="bg-[#161618] border border-white/12 rounded-[24px] rounded-bl-none px-6 py-4 flex items-center gap-2 text-white">
                          <CircleNotch
                            size={16}
                            weight="bold"
                            className="animate-spin text-white"
                          />
                          <span className="text-sm text-white/80 italic">
                            Comrade is thinking...
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Quick Suggestions */}
                {activeChatData?.messages &&
                  activeChatData.messages.length > 0 &&
                  !sendMessage.isPending && (
                    <div className="shrink-0 flex flex-wrap gap-2 justify-center px-4 sm:px-6 m-2 z-10">
                      {SUGGESTIONS.map((sug, idx) => (
                        <button
                          type="button"
                          key={idx}
                          onClick={() => handleSuggestionClick(sug)}
                          className="bg-white/5 border border-white/10 hover:bg-white/15 transition-colors rounded-full px-4 py-2 text-xs font-medium text-white/80 hover:text-white cursor-pointer shadow-sm"
                        >
                          {sug}
                        </button>
                      ))}
                    </div>
                  )}

                {/* Input area */}
                <div className="shrink-0 border-t border-white/10 px-4 sm:px-6 py-3 pb-20 tablet:pb-4 bg-[#0a0a0a] z-10">
                  <div className="mx-auto max-w-2xl flex items-end gap-2 bg-[#141416] rounded-3xl px-4 py-2 shadow-xl border border-white/12">
                    <button
                      type="button"
                      className="w-8 h-8 flex items-center justify-center rounded-full text-white/60 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                      title="Add files"
                    >
                      <Plus size={18} weight="bold" />
                    </button>
                    <textarea
                      ref={inputRef}
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="Speak your mind, I'm listening..."
                      aria-label="Type a message"
                      rows={1}
                      className="flex-1 resize-none bg-transparent border-none px-2 py-1 text-white text-[0.95rem] placeholder:text-white/40 placeholder:italic focus:ring-0 focus:outline-none overflow-y-auto"
                      style={{ maxHeight: "120px" }}
                      onInput={(e) => {
                        const target = e.target as HTMLTextAreaElement;
                        target.style.height = "auto";
                        target.style.height = `${Math.min(
                          target.scrollHeight,
                          120,
                        )}px`;
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => router.push("/talk")}
                      className="w-8 h-8 flex items-center justify-center rounded-full text-white/60 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                      title="Voice Call"
                    >
                      <span className="material-symbols-outlined text-[20px]">
                        mic
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={handleSend}
                      disabled={!input.trim() || sendMessage.isPending}
                      className="w-8 h-8 flex items-center justify-center rounded-full bg-white text-black hover:bg-white/90 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer shrink-0"
                      title="Send message"
                    >
                      <PaperPlaneRight size={16} weight="fill" />
                    </button>
                  </div>
                </div>
              </section>
            )
          ) : (
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
                  Select a conversation from the list or start a new chat to
                  reflect with Comrade AI.
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
          )}
        </main>
      </div>

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

      {/* Rename Dialog */}
      <Dialog
        open={!!renameTarget}
        onOpenChange={(open) => {
          if (!open) setRenameTarget(null);
        }}
      >
        <DialogContent className="!w-[calc(100%-2rem)] sm:!w-[420px] !max-w-[420px] !rounded-[24px] !border !border-white/15 !bg-[#121212] !p-6 !shadow-2xl !shadow-black/90 !ring-0 flex flex-col gap-6 font-satoshi select-none text-white">
          <form onSubmit={handleSaveRename}>
            <DialogHeader>
              <DialogTitle className="text-xl font-medium tracking-tight text-white font-satoshi">
                Rename conversation
              </DialogTitle>
              <DialogDescription className="text-sm text-white/60 font-satoshi mt-1">
                Enter a new title for this conversation.
              </DialogDescription>
            </DialogHeader>

            <div className="py-4">
              <input
                type="text"
                value={renameInput}
                onChange={(e) => setRenameInput(e.target.value)}
                placeholder="Conversation title"
                className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-white/40 font-satoshi"
                maxLength={100}
                autoFocus
              />
            </div>

            <DialogFooter className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 pt-2">
              <DialogClose
                type="button"
                className="px-5 py-2.5 rounded-full border border-white/15 bg-white/5 text-white text-sm font-medium hover:bg-white/10 transition-colors cursor-pointer"
              >
                Cancel
              </DialogClose>
              <button
                type="submit"
                disabled={!renameInput.trim() || updateTitle.isPending}
                className="px-5 py-2.5 rounded-full bg-white text-black text-sm font-semibold hover:bg-white/90 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
              >
                {updateTitle.isPending ? "Saving..." : "Save"}
              </button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog
        open={!!deleteTarget}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null);
        }}
      >
        <DialogContent className="!w-[calc(100%-2rem)] sm:!w-[400px] !max-w-[400px] !rounded-[24px] !border !border-white/15 !bg-[#121212] !p-6 !shadow-2xl !shadow-black/90 !ring-0 flex flex-col gap-6 font-satoshi select-none text-white">
          <DialogHeader>
            <DialogTitle className="text-xl font-medium tracking-tight text-white font-satoshi">
              Delete conversation
            </DialogTitle>
            <DialogDescription className="text-sm text-white/60 font-satoshi mt-1">
              Are you sure you want to delete &ldquo;{deleteTarget?.title}&rdquo;?
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 pt-2">
            <DialogClose className="px-5 py-2.5 rounded-full border border-white/15 bg-white/5 text-white text-sm font-medium hover:bg-white/10 transition-colors cursor-pointer">
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
    </AppShell>
  );
}
