"use client";

import { useCurrentUser } from "@/hooks/use-current-user";
import { Loader2, LockIcon } from "lucide-react";
import { ReactNode } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Button } from "../ui/button";
import { useModalStore } from "@/store/zustand";
import Link from "next/link";

export function ProtectedLayout({ children }: { children: ReactNode }) {
  const { user, isLoading } = useCurrentUser();
  if (isLoading)
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="animate-spin" />
      </div>
    );
  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen">
        <AuthCard />
      </div>
    );
  }

  return children;
}

export default function AuthCard() {
  const { openModal } = useModalStore();

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <div className="flex flex-col sm:flex-row">
        <div className="sm:w-1/4 bg-primary/10 flex items-center justify-center p-4">
          <LockIcon className="size-16 text-primary" />
        </div>
        <div className="sm:w-3/4 p-4">
          <CardHeader className="space-y-1 px-0 pb-2">
            <CardTitle className="text-2xl font-bold">
              Authentication required
            </CardTitle>
            <CardDescription>
              You need to be logged in to access this page.
            </CardDescription>
          </CardHeader>
          <CardContent className="px-0 py-2">
            <div className="flex flex-col sm:flex-row gap-2">
              <Button
                onClick={() => openModal("connectAccountModal")}
                className="flex-1"
                variant={"outline"}
              >
                Continue with Google
              </Button>
              <Link href={"/"} className="flex-1">
                <Button className="w-full">Back to Home</Button>
              </Link>
            </div>
          </CardContent>
        </div>
      </div>
    </Card>
  );
}