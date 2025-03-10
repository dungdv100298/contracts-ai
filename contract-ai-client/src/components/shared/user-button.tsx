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
import { Icons } from "./icons";
import { logout } from "@/lib/api";
import { useRouter } from "next/navigation";
import { useModalStore } from "@/store/zustand";

export function UserButton() {
  const router = useRouter();
  const { user } = useCurrentUser();
  const { openModal } = useModalStore();
  const handleLogout = async () => {
    await logout();
    window.location.reload();
    setTimeout(() => {
      router.push("/");
    }, 500);
  };
  
  return (
    <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
      {user ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="size-8 rounded-full">
              <Avatar>
                <AvatarImage src={user.avatar} />
                <AvatarFallback>
                  {user.displayName
                    ?.split(" ")
                    .map((n: string | undefined) => n?.[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem className="flex flex-col items-start text-sm font-medium">
              <div>{user.displayName}</div>
              <div className="text-xs text-gray-500">
                {user.email}
              </div>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Link href="/dashboard" className="flex items-center">
                <Icons.Dashboard className="size-4 mr-2" />
                Dashboard
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link href="/settings" className="flex items-center">
                <Icons.Settings className="size-4 mr-2" />
                Settings
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleLogout}>
              <div className="flex items-center">
                <Icons.Logout className="size-4 mr-2" />
                Logout
              </div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <Button onClick={() => openModal("connectAccountModal")}>Get Started</Button>
      )}
    </div>
  );
}
