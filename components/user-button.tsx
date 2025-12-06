"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { UserProfile } from "./ui/user-profile";
import { useSession } from "@/contex/session";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { DropdownMenuLabel } from "@radix-ui/react-dropdown-menu";

export const UserButton = ({ showName = false }: { showName?: boolean }) => {
  const { user } = useSession();
  const handleLogout = async () => await authClient.signOut();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="px-4" size="icon">
          <UserProfile url={user.image} name={user.name} size="lg" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="center">
        <DropdownMenuLabel>
          <p className="text-sm font-medium">{user.name}</p>
          <p className="text-xs text-muted-foreground">{user.email}</p>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={(e) => {
            e.preventDefault();
            handleLogout();
            toast.success("Logged out successfully");
            window.location.href = "/auth";
          }}
        >
          Log out
          <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
