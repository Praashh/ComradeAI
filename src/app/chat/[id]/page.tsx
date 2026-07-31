"use client";

import { useState, useRef, useEffect, useCallback, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { UserButton } from "@clerk/nextjs";
import { useConversations } from "@/lib/conversations-context";
import { api } from "@/trpc/react";
import {
  ChatCircleDots,
  Plus,
  PaperPlaneRight,
  CircleNotch,
} from "@phosphor-icons/react";
import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/app/_components/AppSidebar";
import { MobileBottomNav } from "@/app/_components/MobileBottomNav";

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
    <div className={`flex flex-col ${isUser ? "items-end" : "items-start"} mb-6`}>
      <span className={`text-[10px] font-bold tracking-widest uppercase mb-1.5 ${isUser ? "text-white/40" : "text-white/80"}`}>
        {isUser ? "YOU" : "COMRADE AI"}
      </span>
      <div
        className={`max-w-[70%] rounded-[24px] px-6 py-4 text-[0.95rem] leading-relaxed shadow-lg ${isUser
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
  "Suggest a meditation"
];

function ChatView({ conversationId }: { conversationId: number }) {
  const [input, setInput] = useState("");
  const [optimisticMessage, setOptimisticMessage] = useState<string | null>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const router = useRouter();

  const { refetch: refetchConversations } = useConversations();

  const { data, isLoading } = api.conversation.get.useQuery({ id: conversationId });
  const { data: journalsData } = api.journal.getAllJournals.useQuery();
  const latestJournal = journalsData?.journals?.[0];

  const utils = api.useUtils();
  const sendMessage = api.conversation.sendMessage.useMutation({
    onSuccess: (result) => {
      setOptimisticMessage(null);
      utils.conversation.get.setData({ id: conversationId }, (old) => {
        if (!old) return old;
        return {
          ...old,
          messages: [...old.messages, result.userMessage, result.assistantMessage],
        };
      });
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

  useEffect(() => { scrollToBottom(); }, [data?.messages, optimisticMessage, scrollToBottom]);

  useEffect(() => {
    window.scrollTo(0, 0);
    document.body.classList.add("layout-locked");
    document.documentElement.classList.add("layout-locked");
    return () => {
      document.body.classList.remove("layout-locked");
      document.documentElement.classList.remove("layout-locked");
    };
  }, []);

  const handleSend = useCallback(() => {
    const trimmed = input.trim();
    if (!trimmed || sendMessage.isPending) return;
    setOptimisticMessage(trimmed);
    setInput("");
    if (inputRef.current) inputRef.current.style.height = "auto";
    sendMessage.mutate({ conversationId, content: trimmed });
  }, [input, conversationId, sendMessage]);

  const handleSuggestionClick = (text: string) => {
    if (sendMessage.isPending) return;
    setOptimisticMessage(text);
    sendMessage.mutate({ conversationId, content: text });
  };

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); }
    },
    [handleSend],
  );

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
            <UserButton appearance={{ elements: { userButtonAvatarBox: "w-[32px] h-[32px] border border-white/20" } }} />
          </div>
        </header>

        {/* Main Content */}
        <div className="flex flex-1 min-h-0 overflow-hidden bg-[#0a0a0a]">
          {isLoading ? (
            <ChatSkeleton />
          ) : (
            <section className="flex-1 min-w-0 min-h-0 flex flex-col bg-[#0d0d0d] relative overflow-hidden">
              <div className="absolute top-0 right-0 w-[256px] h-[256px] bg-white/5 rounded-full blur-3xl pointer-events-none"></div>

              {/* Chat header */}
              <div className="shrink-0 px-6 py-4 border-b border-white/10 flex items-center gap-3 z-10 bg-[#0a0a0a]/60 backdrop-blur-md">
                <button
                  type="button"
                  onClick={() => router.push("/chat")}
                  className="material-symbols-outlined p-2 hover:bg-white/10 rounded-full text-white/70 hover:text-white transition-colors cursor-pointer"
                  title="Back to Chats"
                >
                  arrow_back
                </button>
                <h1 className="font-instrument text-xl font-normal text-white truncate">
                  {data?.conversation.title ?? "New conversation"}
                </h1>
              </div>

              {/* Messages Container */}
              <div ref={messagesContainerRef} className="flex-1 overflow-y-auto px-6 py-8 z-10">
                <div className="mx-auto max-w-2xl">
                  {latestJournal && (
                    <div className="flex justify-center mb-8">
                      <div className="inline-flex items-center gap-2 border border-white/12 bg-white/5 backdrop-blur-md rounded-full px-4 py-2 text-xs">
                        <span className="material-symbols-outlined text-sm text-white/60">link</span>
                        <span className="text-white/60 font-medium">
                          Referenced Context: <strong className="text-white font-semibold">&ldquo;{latestJournal.title ?? "Untitled Entry"}&rdquo;</strong>
                        </span>
                        <span className="text-white/20 mx-1">|</span>
                        <Link href={`/write/${latestJournal.id}`} className="text-white font-semibold underline hover:text-white/80">View Journal</Link>
                      </div>
                    </div>
                  )}

                  {data?.messages.length === 0 && !optimisticMessage && (
                    <div className="text-center py-12">
                      <ChatCircleDots size={40} weight="duotone" className="mx-auto mb-3 text-white/30" />
                      <p className="text-sm text-white/50 italic">Ask Comrade anything about your journals and thoughts.</p>
                    </div>
                  )}

                  {data?.messages.map((msg) => <MessageBubble key={msg.id} message={msg} />)}

                  {optimisticMessage && (
                    <div className="flex flex-col items-end mb-6">
                      <span className="text-[10px] font-bold tracking-widest uppercase mb-1.5 text-white/40">YOU</span>
                      <div className="max-w-[70%] rounded-[24px] rounded-br-none px-6 py-4 text-[0.95rem] leading-relaxed shadow-lg bg-white text-black font-medium">
                        <p className="whitespace-pre-wrap">{optimisticMessage}</p>
                      </div>
                    </div>
                  )}

                  {sendMessage.isPending && (
                    <div className="flex flex-col items-start mb-6">
                      <span className="text-[10px] font-bold tracking-widest uppercase mb-1.5 text-white/80">COMRADE AI</span>
                      <div className="bg-[#161618] border border-white/12 rounded-[24px] rounded-bl-none px-6 py-4 flex items-center gap-2 text-white">
                        <CircleNotch size={16} weight="bold" className="animate-spin text-white" />
                        <span className="text-sm text-white/80 italic">Comrade is thinking...</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Quick Suggestions */}
              {data?.messages && data.messages.length > 0 && !sendMessage.isPending && (
                <div className="shrink-0 flex flex-wrap gap-2 justify-center px-6 m-2 z-10">
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
                  <button type="button" className="w-8 h-8 flex items-center justify-center rounded-full text-white/60 hover:text-white hover:bg-white/10 transition-colors cursor-pointer" title="Add files">
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
                      target.style.height = `${Math.min(target.scrollHeight, 120)}px`;
                    }}
                  />
                  <button type="button" onClick={() => router.push("/talk")} className="w-8 h-8 flex items-center justify-center rounded-full text-white/60 hover:text-white hover:bg-white/10 transition-colors cursor-pointer" title="Voice Call">
                    <span className="material-symbols-outlined text-[20px]">mic</span>
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
          )}
        </div>
      </SidebarInset>
      <MobileBottomNav />
    </SidebarProvider>
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
