"use client";

import { useState } from "react";
import { api } from "@/trpc/react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface FeedbackDialogProps {
  children?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function FeedbackDialog({ children, open, onOpenChange }: FeedbackDialogProps) {
  const [type, setType] = useState<"feature" | "bug" | "general" | "improvements">("general");
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);

  const submitMutation = api.feedback.submit.useMutation({
    onSuccess: () => {
      toast.success("Feedback submitted successfully!");
      setSuccess(true);
      setMessage("");
    },
    onError: (err) => {
      toast.error(err.message ?? "Failed to submit feedback. Please try again.");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim().length < 5) {
      toast.error("Message must be at least 5 characters long");
      return;
    }
    submitMutation.mutate({ type, message });
  };

  const handleOpenChange = (isOpen: boolean) => {
    if (onOpenChange) {
      onOpenChange(isOpen);
    }
    if (!isOpen) {
      // Reset form when dialog closes
      setTimeout(() => {
        setSuccess(false);
        setType("general");
        setMessage("");
      }, 200);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      {children && (
        <DialogTrigger nativeButton={false} render={<span />}>
          {children}
        </DialogTrigger>
      )}
      <DialogContent className="!border !border-white/15 !bg-[#121212] !rounded-[28px] !p-6 !shadow-2xl !shadow-black/90 sm:!max-w-[440px] !ring-0 text-white font-satoshi">
        <DialogHeader>
          <DialogTitle className="text-xl font-medium tracking-tight text-white font-satoshi">Share Feedback</DialogTitle>
          <DialogDescription className="text-sm text-white/60 font-satoshi mt-1">
            Help us improve Comrade AI. Let us know what you think, report a bug, or suggest a new feature.
          </DialogDescription>
        </DialogHeader>

        {success ? (
          <div className="flex flex-col items-center justify-center py-6 text-center gap-3">
            <span className="material-symbols-outlined text-white text-[48px] animate-pulse">
              check_circle
            </span>
            <div>
              <h3 className="font-medium text-white text-lg">Thank You!</h3>
              <p className="text-sm text-white/60 mt-1">
                Your feedback has been received and helps us build a better companion.
              </p>
            </div>
            <DialogFooter className="w-full mt-4">
              <Button
                type="button"
                onClick={() => handleOpenChange(false)}
                className="w-full bg-white text-black hover:bg-white/90 font-satoshi font-semibold text-sm rounded-full cursor-pointer py-3 transition-all shadow-lg"
              >
                Done
              </Button>
            </DialogFooter>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-2">
            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold text-white/40 uppercase tracking-wider font-satoshi">
                Feedback Type
              </label>
              <div className="grid grid-cols-2 gap-2">
                {(["general", "bug", "feature", "improvements"] as const).map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setType(opt)}
                    className={`px-3 py-2.5 rounded-full text-xs font-medium border text-center transition-all cursor-pointer capitalize font-satoshi ${
                      type === opt
                        ? "bg-white/15 border-white text-white font-semibold shadow-sm"
                        : "bg-white/5 border-white/10 text-white/60 hover:border-white/30 hover:text-white"
                    }`}
                  >
                    {opt === "improvements" ? "improvement" : opt}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="feedback-message" className="text-xs font-semibold text-white/40 uppercase tracking-wider font-satoshi">
                Message
              </label>
              <textarea
                id="feedback-message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Describe your feedback or suggestion..."
                rows={4}
                required
                className="w-full p-3.5 rounded-[16px] border border-white/10 bg-[#181818] text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-white/30 transition-all resize-none font-satoshi"
              />
            </div>

            <DialogFooter className="mt-2">
              <Button
                type="submit"
                disabled={submitMutation.isPending}
                className="w-full bg-white text-black hover:bg-white/90 font-satoshi font-semibold text-sm rounded-full cursor-pointer py-3 transition-all shadow-lg flex items-center justify-center gap-2 border-0 disabled:opacity-50"
              >
                {submitMutation.isPending ? "Submitting..." : "Submit Feedback"}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
