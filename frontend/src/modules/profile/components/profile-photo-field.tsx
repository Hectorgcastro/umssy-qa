"use client";

import { useRef, type ChangeEvent } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { PHOTO_ACCEPT } from "../config/file-upload.config";
import type { ProfilePhotoFieldProps } from "../types/profile-photo-field-props.types";
import { ProfileAvatar } from "./profile-avatar";

export function ProfilePhotoField({
  photoUrl,
  isUploading = false,
  error,
  onSelectPhoto,
}: ProfilePhotoFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (file && onSelectPhoto) {
      onSelectPhoto(file);
    }
  };

  const buttonLabel = photoUrl ? "Cambiar fotografía" : "Subir fotografía";

  return (
    <div className="flex items-center gap-8 border-b border-border pb-8">
      <ProfileAvatar label="Foto" photoUrl={photoUrl} />
      <div className="flex flex-col gap-1">
        <p className="text-[15px] font-semibold text-ink">Fotografía de perfil</p>
        <p className="text-[13px] text-text-secondary">
          Ayuda a que otras personas te reconozcan. Formato JPG o PNG, hasta 5 MB.
        </p>
        <input
          ref={inputRef}
          id="profilePhoto"
          type="file"
          accept={PHOTO_ACCEPT}
          aria-label="Seleccionar fotografía de perfil"
          className="hidden"
          disabled={!onSelectPhoto || isUploading}
          onChange={handleChange}
        />
        <Button
          type="button"
          variant="outline"
          className={cn("h-12 border-border-strong bg-surface px-6 text-[14px] font-semibold text-ink hover:bg-surface-soft", "mt-3 w-fit")}
          disabled={!onSelectPhoto || isUploading}
          onClick={() => inputRef.current?.click()}
        >
          {isUploading ? "Subiendo..." : buttonLabel}
        </Button>
        {error ? (
          <p role="alert" className={cn("text-[13px] text-danger", "mt-2")}>
            {error}
          </p>
        ) : null}
      </div>
    </div>
  );
}
