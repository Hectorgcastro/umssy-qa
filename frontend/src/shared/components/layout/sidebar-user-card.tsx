import Image from "next/image";
import { ChevronDown } from "lucide-react";
import type { SidebarUser } from "@/shared/types/navigation.types";

interface SidebarUserCardProps {
  user: SidebarUser;
}

function getInitials(fullName: string): string {
  return fullName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0].toUpperCase())
    .join("");
}

export function SidebarUserCard({ user }: SidebarUserCardProps) {
  return (
    <button
      type="button"
      className="flex w-full items-center gap-3 rounded-md bg-surface/5 px-3 py-3 text-left transition-colors hover:bg-surface/10"
    >
      {user.avatarUrl ? (
        <Image
          src={user.avatarUrl}
          alt={`Foto de ${user.fullName}`}
          width={44}
          height={44}
          className="h-11 w-11 shrink-0 rounded-full object-cover"
        />
      ) : (
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-accent text-sm font-semibold text-surface">
          {getInitials(user.fullName)}
        </span>
      )}
      <span className="flex min-w-0 flex-1 flex-col">
        <span className="truncate text-sm text-surface">{user.fullName}</span>
        <span className="truncate text-xs text-surface/70">{user.role}</span>
      </span>
      <ChevronDown className="h-4 w-4 shrink-0 text-surface/70" aria-hidden="true" />
    </button>
  );
}
