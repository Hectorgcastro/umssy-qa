import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { ProfilePhotoField } from "./profile-photo-field";

describe("ProfilePhotoField", () => {
  afterEach(() => {
    cleanup();
  });

  it("disables the upload button when there is no handler", () => {
    render(<ProfilePhotoField />);

    expect(screen.getByText("Foto")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Subir fotografía" })).toBeDisabled();
  });

  it("sends the selected file to the handler", async () => {
    const onSelectPhoto = vi.fn();
    const user = userEvent.setup();
    render(<ProfilePhotoField onSelectPhoto={onSelectPhoto} />);
    const photo = new File(["photo"], "photo.png", { type: "image/png" });

    await user.upload(screen.getByLabelText("Seleccionar fotografía de perfil"), photo);

    expect(onSelectPhoto).toHaveBeenCalledWith(photo);
  });

  it("opens the file picker from the upload button", async () => {
    const user = userEvent.setup();
    render(<ProfilePhotoField onSelectPhoto={vi.fn()} />);
    const input = screen.getByLabelText<HTMLInputElement>("Seleccionar fotografía de perfil");
    const clickSpy = vi.spyOn(input, "click");

    await user.click(screen.getByRole("button", { name: "Subir fotografía" }));

    expect(clickSpy).toHaveBeenCalled();
  });

  it("shows the saved photo and offers to change it", () => {
    const { container } = render(
      <ProfilePhotoField photoUrl="blob:photo" onSelectPhoto={vi.fn()} />,
    );

    expect(container.querySelector("img")).toHaveAttribute("src", "blob:photo");
    expect(screen.queryByText("Foto")).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Cambiar fotografía" })).toBeEnabled();
  });

  it("disables the button while uploading", () => {
    render(<ProfilePhotoField isUploading onSelectPhoto={vi.fn()} />);

    expect(screen.getByRole("button", { name: "Subiendo..." })).toBeDisabled();
  });

  it("shows the upload error", () => {
    render(
      <ProfilePhotoField
        error="La fotografía debe estar en formato JPG o PNG."
        onSelectPhoto={vi.fn()}
      />,
    );

    expect(screen.getByRole("alert")).toHaveTextContent(
      "La fotografía debe estar en formato JPG o PNG.",
    );
  });
});
