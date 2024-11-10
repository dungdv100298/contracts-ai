import { useCurrentUser } from "@/hooks/use-current-user";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "../ui/dropdown-menu";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";
import Link from "next/link";

const googleSignIn = () => {
  return new Promise((resolve) => {
    window.location.href = "http://localhost:8080/auth/google";
    resolve(true);
  });
};
export function UserButton() {
  const { currentUser } = useCurrentUser();
  return (
    <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
      {currentUser ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="size-8 rounded-full">
              <Avatar>
                <AvatarImage src={currentUser.avatar} />
                <AvatarFallback>
                  {currentUser.displayName
                    ?.split(" ")
                    .map((n: string | undefined) => n?.[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem className="flex flex-col items-start text-sm font-medium">
              <div>{currentUser.displayName}</div>
              <div className="text-xs text-gray-500">
                {currentUser.email}
              </div>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Link href="/dashboard">Dashboard</Link>
            </DropdownMenuItem>
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuItem>Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <Button onClick={googleSignIn}>Get Started</Button>
      )}
    </div>
  );
}
