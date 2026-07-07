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
      <DialogContent className="sm:max-w-[420px] bg-surface-container-lowest border border-black/5 rounded-2xl shadow-xl">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-on-surface">Share Feedback</DialogTitle>
          <DialogDescription className="text-sm text-secondary">
            Help us improve Comrade AI. Let us know what you think, report a bug, or suggest a new feature.
          </DialogDescription>
        </DialogHeader>

        {success ? (
          <div className="flex flex-col items-center justify-center py-6 text-center gap-3">
            <span className="material-symbols-outlined text-primary text-[48px] animate-pulse">
              check_circle
            </span>
            <div>
              <h3 className="font-semibold text-on-surface">Thank You!</h3>
              <p className="text-sm text-secondary mt-1">
                Your feedback has been received and helps us build a better companion.
              </p>
            </div>
            <DialogFooter className="w-full mt-4">
              <Button
                type="button"
                onClick={() => handleOpenChange(false)}
                className="w-full bg-primary text-on-primary hover:bg-primary/95 rounded-xl cursor-pointer"
              >
                Done
              </Button>
            </DialogFooter>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-2">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-secondary uppercase tracking-wider">
                Feedback Type
              </label>
              <div className="grid grid-cols-2 gap-2">
                {(["general", "bug", "feature", "improvements"] as const).map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setType(opt)}
                    className={`px-3 py-2 rounded-xl text-xs font-medium border text-center transition-all cursor-pointer capitalize ${
                      type === opt
                        ? "bg-primary/10 border-primary text-primary"
                        : "bg-surface hover:bg-surface-container border-black/5 text-secondary"
                    }`}
                  >
                    {opt === "improvements" ? "improvement" : opt}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="feedback-message" className="text-xs font-semibold text-secondary uppercase tracking-wider">
                Message
              </label>
              <textarea
                id="feedback-message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Describe your feedback or suggestion..."
                rows={4}
                required
                className="w-full p-3 rounded-xl border border-black/10 bg-surface text-on-surface text-sm placeholder:text-secondary focus:outline-none focus:border-primary transition-all resize-none"
              />
            </div>

            <DialogFooter className="mt-2">
              <Button
                type="submit"
                disabled={submitMutation.isPending}
                className="w-full bg-primary text-on-primary hover:bg-primary/95 rounded-xl cursor-pointer py-2.5 flex items-center justify-center gap-2"
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
