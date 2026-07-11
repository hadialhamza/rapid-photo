"use client";

import React, { useState, useEffect } from "react";
import { Modal } from "./Modal";
import { Button } from "./Button";
import { Trash2, Loader2, CheckCircle2, AlertCircle } from "lucide-react";

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  title?: string;
  description?: string;
}

type DeleteState = "idle" | "deleting" | "success" | "error";

export function DeleteConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title = "Confirm Deletion",
  description = "Are you sure you want to delete this item? This action cannot be undone.",
}: DeleteConfirmModalProps) {
  const [state, setState] = useState<DeleteState>("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleConfirm = async () => {
    setState("deleting");
    try {
      await onConfirm();
      setState("success");
    } catch (err: unknown) {
      console.error("Delete action failed:", err);
      const message =
        err instanceof Error
          ? err.message
          : "Failed to delete item. Please try again.";
      setErrorMsg(message);
      setState("error");
    }
  };

  // Close modal automatically after success animation
  useEffect(() => {
    if (state === "success") {
      const timer = setTimeout(() => {
        onClose();
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [state, onClose]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={state === "deleting" ? () => {} : onClose} // Prevent closing while deleting
      maxWidth="max-w-sm"
      showCloseButton={state !== "deleting"}
    >
      <div className="text-center space-y-4 mt-2">
        {state === "idle" && (
          <>
            <div className="w-12 h-12 bg-error/10 text-error rounded-full flex items-center justify-center mx-auto animate-bounce">
              <Trash2 className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h2 className="text-lg font-bold font-heading text-foreground">
                {title}
              </h2>
              <p className="text-xs text-muted leading-relaxed">
                {description}
              </p>
            </div>
            <div className="flex items-center gap-3 pt-2">
              <Button
                variant="outline"
                size="sm"
                className="flex-1 cursor-pointer"
                onClick={onClose}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                size="sm"
                className="flex-1 cursor-pointer"
                onClick={handleConfirm}
              >
                Delete
              </Button>
            </div>
          </>
        )}

        {state === "deleting" && (
          <div className="py-6 flex flex-col items-center justify-center space-y-4">
            <Loader2 className="w-10 h-10 text-primary animate-spin" />
            <div className="space-y-1">
              <h2 className="text-lg font-bold font-heading text-foreground">
                Deleting Photo
              </h2>
              <p className="text-xs text-muted">
                Permanently removing from storage...
              </p>
            </div>
          </div>
        )}

        {state === "success" && (
          <div className="py-6 flex flex-col items-center justify-center space-y-4 animate-in zoom-in-95 duration-300">
            <div className="w-12 h-12 bg-success/10 text-success rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h2 className="text-lg font-bold font-heading text-foreground">
                Successfully Deleted
              </h2>
              <p className="text-xs text-muted">The image has been purged.</p>
            </div>
          </div>
        )}

        {state === "error" && (
          <>
            <div className="w-12 h-12 bg-error/10 text-error rounded-full flex items-center justify-center mx-auto">
              <AlertCircle className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h2 className="text-lg font-bold font-heading text-foreground">
                Delete Failed
              </h2>
              <p className="text-xs text-muted leading-relaxed">{errorMsg}</p>
            </div>
            <div className="pt-2">
              <Button
                variant="outline"
                size="sm"
                className="w-full cursor-pointer"
                onClick={onClose}
              >
                Close
              </Button>
            </div>
          </>
        )}
      </div>
    </Modal>
  );
}
