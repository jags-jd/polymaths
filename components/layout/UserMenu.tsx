"use client";

import { LogOut } from "lucide-react";

import { HEADER_FOCUS } from "@/components/layout/header-styles";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { signOut } from "@/lib/auth/actions";

type Props = {
  ign: string | null;
  displayName: string;
  avatarUrl: string | null;
};

function initials(name: string) {
  return (
    name
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((word) => word[0]?.toUpperCase())
      .join("") || "?"
  );
}

export function UserMenu({ ign, displayName, avatarUrl }: Props) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label="Account menu"
        className={`${HEADER_FOCUS} rounded-full`}
      >
        {/* Ringed in the header's text color so it reads on any bar. */}
        <Avatar className="size-8 ring-2 ring-[var(--header-text,var(--foreground))]">
          {avatarUrl && <AvatarImage src={avatarUrl} alt="" referrerPolicy="no-referrer" />}
          <AvatarFallback className="bg-[var(--header-text,var(--foreground))] text-xs font-bold text-[var(--header-bg,var(--background))]">
            {initials(displayName)}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-48">
        <DropdownMenuGroup>
          <DropdownMenuLabel className="flex flex-col gap-0.5">
            <span className="truncate font-medium text-foreground">{displayName}</span>
            {ign && <span className="truncate text-xs text-muted-foreground">@{ign}</span>}
          </DropdownMenuLabel>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => signOut()}>
          <LogOut />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
