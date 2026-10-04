import { act, cleanup, renderHook, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { profilePhotoService } from "../services/profile-photo.service";
import { useProfilePhoto } from "./use-profile-photo";

vi.mock("../services/profile-photo.service", () => ({
  profilePhotoService: {
    getPhoto: vi.fn(),
    uploadPhoto: vi.fn(),
  },
}));

function createPhoto(name = "photo.png", type = "image/png", size = 4): File {
  return new File([new Uint8Array(size)], name, { type });
}

describe("useProfilePhoto", () => {
  let objectUrlCount: number;

  beforeEach(() => {
    objectUrlCount = 0;
    vi.stubGlobal("URL", {
      ...URL,
      createObjectURL: vi.fn(() => `blob:photo-${++objectUrlCount}`),
      revokeObjectURL: vi.fn(),
    });
    vi.mocked(profilePhotoService.getPhoto).mockResolvedValue(null);
    vi.mocked(profilePhotoService.uploadPhoto).mockResolvedValue(undefined);
  });

  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
    vi.unstubAllGlobals();
  });

  it("shows the saved photo of the user", async () => {
    vi.mocked(profilePhotoService.getPhoto).mockResolvedValue(new Blob(["photo"]));

    const { result } = renderHook(() => useProfilePhoto());

    await waitFor(() => expect(result.current.photoUrl).toBe("blob:photo-1"));
  });

  it("keeps the initials when the user has no photo or the load fails", async () => {
    vi.mocked(profilePhotoService.getPhoto).mockRejectedValue(new Error("Network error"));

    const { result } = renderHook(() => useProfilePhoto());

    await waitFor(() => expect(profilePhotoService.getPhoto).toHaveBeenCalled());
    expect(result.current.photoUrl).toBeNull();
    expect(result.current.error).toBeNull();
  });

  it("uploads a valid photo and shows it", async () => {
    const { result } = renderHook(() => useProfilePhoto());
    const photo = createPhoto();

    await act(() => result.current.uploadPhoto(photo));

    expect(profilePhotoService.uploadPhoto).toHaveBeenCalledWith(photo);
    expect(result.current.photoUrl).toBe("blob:photo-1");
    expect(result.current.isUploading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it("releases the previous photo when a new one is uploaded", async () => {
    const { result } = renderHook(() => useProfilePhoto());

    await act(() => result.current.uploadPhoto(createPhoto()));
    await act(() => result.current.uploadPhoto(createPhoto("other.jpg", "image/jpeg")));

    expect(URL.revokeObjectURL).toHaveBeenCalledWith("blob:photo-1");
    expect(result.current.photoUrl).toBe("blob:photo-2");
  });

  it("does not upload a file that is not jpg or png", async () => {
    const { result } = renderHook(() => useProfilePhoto());

    await act(() => result.current.uploadPhoto(createPhoto("cv.pdf", "application/pdf")));

    expect(profilePhotoService.uploadPhoto).not.toHaveBeenCalled();
    expect(result.current.error).toBe("La fotografía debe estar en formato JPG o PNG.");
  });

  it("shows the message of the server error status", async () => {
    vi.mocked(profilePhotoService.uploadPhoto).mockRejectedValue({ response: { status: 415 } });
    const { result } = renderHook(() => useProfilePhoto());

    await act(() => result.current.uploadPhoto(createPhoto()));

    expect(result.current.error).toBe("La fotografía debe estar en formato JPG o PNG.");
    expect(result.current.photoUrl).toBeNull();
  });

  it("shows a generic message for unknown upload errors", async () => {
    vi.mocked(profilePhotoService.uploadPhoto).mockRejectedValue(new Error("Network error"));
    const { result } = renderHook(() => useProfilePhoto());

    await act(() => result.current.uploadPhoto(createPhoto()));

    expect(result.current.error).toBe("No se pudo subir tu fotografía. Intenta de nuevo.");
  });

  it("releases the photo when the component is removed", async () => {
    vi.mocked(profilePhotoService.getPhoto).mockResolvedValue(new Blob(["photo"]));
    const { result, unmount } = renderHook(() => useProfilePhoto());
    await waitFor(() => expect(result.current.photoUrl).toBe("blob:photo-1"));

    unmount();

    expect(URL.revokeObjectURL).toHaveBeenCalledWith("blob:photo-1");
  });
});
