import { cn } from "@/lib/utils";
import type { ProfileAvatarProps } from "../types/profile-avatar-props.types";

const SIZE_CLASS = {
  sm: "h-10 w-10 text-[12.5px]",
  lg: "h-32 w-32 text-[15px]",
};

export function ProfileAvatar({ label, size = "lg", photoUrl }: ProfileAvatarProps) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "flex shrink-0 items-center justify-center overflow-hidden rounded-full border border-border bg-surface-soft font-semibold text-ink-soft",
        SIZE_CLASS[size],
      )}
    >
      {photoUrl ? (
        // eslint-disable-next-line @next/next/no-img-element -- blob URLs cannot use next/image
        <img src={photoUrl} alt="" className="h-full w-full object-cover" />
      ) : (
        label
      )}
    </span>
  );
}
