"use client";

import { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, MessageCircle } from "lucide-react";
import { api } from "@/trpc/react";
import { cn } from "@/lib/utils";

type Message = {
  role: "user" | "assistant";
  content: string;
};

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const ask = api.chat.ask.useMutation();

  // ✅ Load session messages on client after mount
  useEffect(() => {
    const saved = sessionStorage.getItem("chatMessages");
    if (saved) {
      try {
        setMessages(JSON.parse(saved) as Message[]);
      } catch {
        setMessages([]);
      }
    }
  }, []);

  // ✅ Persist messages to session storage
  useEffect(() => {
    if (messages.length > 0) {
      sessionStorage.setItem("chatMessages", JSON.stringify(messages));
    }
  }, [messages]);

  // ✅ Auto-scroll when messages change
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const newMessage: Message = {
      role: "user",
      content: input.trim(),
    };

    setMessages((prev) => [...prev, newMessage]);
    setInput("");
    setLoading(true);

    ask.mutate(
      { message: newMessage.content },
      {
        onSuccess: (data: { text: string }) => {
          setMessages((prev) => [
            ...prev,
            { role: "assistant", content: data.text },
          ]);
          setLoading(false);
        },
        onError: () => {
          setMessages((prev) => [
            ...prev,
            {
              role: "assistant",
              content: "❌ Something went wrong. Try again later.",
            },
          ]);
          setLoading(false);
        },
      },
    );
  };

  return (
    <div className="bg-background flex h-screen flex-col text-white">
      {/* Header */}
      <div className="p-4">
        <h1 className="mb-2 flex items-center gap-2 text-xl font-semibold">
          <MessageCircle className="text-primary" /> AI Chat Assistant
        </h1>
        <p className="text-muted-foreground">
          Ask me anything! I&apos;m here to help.
        </p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 pb-[150px]">
        {messages.map((msg, idx) => (
          <div key={idx} className="mb-3">
            <div
              className={cn(
                "max-w-xs rounded-xl p-3 text-sm",
                msg.role === "user"
                  ? "bg-primary text-background ml-auto"
                  : "bg-muted text-foreground mr-auto",
              )}
            >
              {msg.content}
            </div>
          </div>
        ))}

        {loading && (
          <div className="text-muted-foreground mr-auto flex items-center gap-2 text-sm">
            <Loader2 className="h-4 w-4 animate-spin" /> Thinking...
          </div>
        )}
        <div ref={scrollRef} />
      </div>

      {/* Fixed Input Bar */}
      <div className="border-border bg-background fixed bottom-[88px] left-0 z-50 w-full border-t px-4 py-3">
        <div className="mx-auto flex max-w-2xl items-center gap-2">
          <Input
            placeholder="Type a message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            className="flex-1"
          />
          <Button
            onClick={handleSend}
            disabled={loading}
            className="rounded-full"
          >
            Send
          </Button>
        </div>
      </div>
    </div>
  );
}
