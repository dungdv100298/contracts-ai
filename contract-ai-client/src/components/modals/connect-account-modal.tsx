"use client";

import { useModalStore } from "@/store/zustand";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Loader2 } from "lucide-react";
import { Checkbox } from "../ui/checkbox";
import { Label } from "../ui/label";

const googleSignIn = () => {
  return new Promise((resolve) => {
    window.location.href = `${process.env.NEXT_PUBLIC_SERVER_URL}/auth/google`;
    resolve(true);
  });
};

export function ConnectAccountModal() {
  const modalKey = "connectAccountModal";
  const [isAgreed, setIsAgreed] = useState(false);
  const { isOpen, closeModal } = useModalStore();

  const mutation = useMutation({
    mutationFn: googleSignIn,
    onSuccess: () => {
      closeModal(modalKey);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleGoogleSignIn = () => {
    if (isAgreed) {
      mutation.mutate();
    } else {
      toast.error("Please agree to the terms and conditions");
    }
  };

  return (
    <Dialog
      open={isOpen(modalKey)}
      onOpenChange={() => closeModal(modalKey)}
      key={modalKey}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Connect Account to continue</DialogTitle>
          <DialogDescription>
            Connect your account to continue using the app.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Button
            className="w-full"
            disabled={!isAgreed}
            onClick={handleGoogleSignIn}
          >
            {mutation.isPending ? (
              <Loader2 className="mr-2 size-4 animate-spin" />
            ) : (
              "Sign in with Google"
            )}
          </Button>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="terms"
              checked={isAgreed}
              onCheckedChange={(checked) => setIsAgreed(checked as boolean)}
            />
            <Label
              htmlFor="terms"
              className="text-sm text-gray-500 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              I agree to the terms and conditions
            </Label>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
