"use client";

import { useEffect, useRef, useState } from "react";
import {
  PHOTO_ERROR_MESSAGES,
  PHOTO_ERROR_MESSAGES_BY_STATUS,
} from "../config/photo-error-messages.config";
import { profilePhotoService } from "../services/profile-photo.service";
import { getHttpStatus } from "../utils/get-http-status";
import { validatePhotoFile } from "../utils/validate-photo-file";

export function useProfilePhoto() {
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const photoUrlRef = useRef<string | null>(null);

  // Object URLs keep the image in memory until they are revoked.
  function showPhoto(blob: Blob) {
    if (photoUrlRef.current) {
      URL.revokeObjectURL(photoUrlRef.current);
    }
    photoUrlRef.current = URL.createObjectURL(blob);
    setPhotoUrl(photoUrlRef.current);
  }

  useEffect(() => {
    let isActive = true;

    async function loadPhoto() {
      try {
        const photo = await profilePhotoService.getPhoto();
        if (isActive && photo && !photoUrlRef.current) {
          showPhoto(photo);
        }
      } catch {
        // Without a photo the initials are shown, so a failed load is not reported.
      }
    }

    void loadPhoto();

    return () => {
      isActive = false;
      if (photoUrlRef.current) {
        URL.revokeObjectURL(photoUrlRef.current);
        photoUrlRef.current = null;
      }
    };
  }, []);

  async function uploadPhoto(file: File): Promise<void> {
    const validationError = validatePhotoFile(file);
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsUploading(true);
    setError(null);
    try {
      await profilePhotoService.uploadPhoto(file);
      showPhoto(file);
    } catch (uploadError) {
      const status = getHttpStatus(uploadError);
      setError(
        (status && PHOTO_ERROR_MESSAGES_BY_STATUS[status]) || PHOTO_ERROR_MESSAGES.upload,
      );
    } finally {
      setIsUploading(false);
    }
  }

  return { photoUrl, isUploading, error, uploadPhoto };
}
