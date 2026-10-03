import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { MentorshipView } from "./mentorship-view";

afterEach(cleanup);

describe("MentorshipView", () => {
  it("renderiza inicialmente el paso 1 con participación desmarcada", () => {
    render(<MentorshipView />);

    expect(
      screen.getByRole("heading", { name: "Participación" }),
    ).toBeDefined();

    expect(
      screen.getByText("Quiero participar como mentor"),
    ).toBeDefined();

    const checkbox = screen.getByRole("checkbox");

    expect((checkbox as HTMLInputElement).checked).toBe(false);

    const nextButton = screen.getByRole("button", {
      name: /Continuar/i,
    });

    expect((nextButton as HTMLButtonElement).disabled).toBe(true);
  });

  it("habilita Continuar al seleccionar participación", () => {
    render(<MentorshipView />);

    const checkbox = screen.getByRole("checkbox");

    fireEvent.click(checkbox);

    expect((checkbox as HTMLInputElement).checked).toBe(true);

    const nextButton = screen.getByRole("button", {
      name: /Continuar/i,
    });

    expect((nextButton as HTMLButtonElement).disabled).toBe(false);
  });

  it("permite avanzar entre los pasos después de aceptar participación", () => {
    render(<MentorshipView />);

    fireEvent.click(screen.getByRole("checkbox"));

    const nextButton = screen.getByRole("button", {
      name: /Continuar/i,
    });

    fireEvent.click(nextButton);

    expect(
      screen.getByText("Paso 2: Áreas técnicas"),
    ).toBeDefined();
  });

  it("no permite avanzar del paso 2 sin seleccionar un área", () => {
    render(<MentorshipView />);

    fireEvent.click(screen.getByRole("checkbox"));

    const nextButton = screen.getByRole("button", {
      name: /Continuar/i,
    });

    fireEvent.click(nextButton);

    expect(
      screen.getByText("Paso 2: Áreas técnicas"),
    ).toBeDefined();

    expect((nextButton as HTMLButtonElement).disabled).toBe(true);

    expect(
      screen.getByText(
        "Debe seleccionarse al menos un área para continuar",
      ),
    ).toBeDefined();
  });

  it("permite avanzar del paso 2 al seleccionar al menos un área", () => {
    render(<MentorshipView />);

    fireEvent.click(screen.getByRole("checkbox"));

    const nextButton = screen.getByRole("button", {
      name: /Continuar/i,
    });

    fireEvent.click(nextButton);

    fireEvent.click(
      screen.getByRole("button", {
        name: /Backend/i,
      }),
    );

    expect((nextButton as HTMLButtonElement).disabled).toBe(false);

    fireEvent.click(nextButton);

    expect(
      screen.getByRole("heading", {
        name: "Paso 3: Tipos de orientación",
      }),
    ).toBeDefined();
  });

  it("deshabilita Volver en el primer paso", () => {
    render(<MentorshipView />);

    const backButton = screen.getByRole("button", {
      name: /Volver/i,
    });

    expect(
      (backButton as HTMLButtonElement).disabled,
    ).toBe(true);
  });

  it("permite regresar al paso anterior", () => {
    render(<MentorshipView />);

    fireEvent.click(screen.getByRole("checkbox"));

    const nextButton = screen.getByRole("button", {
      name: /Continuar/i,
    });

    fireEvent.click(nextButton);

    const backButton = screen.getByRole("button", {
      name: /Volver/i,
    });

    fireEvent.click(backButton);

    expect(
      screen.getByRole("heading", {
        name: "Participación",
      }),
    ).toBeDefined();
  });

  it("conserva la participación al avanzar y regresar", () => {
    render(<MentorshipView />);

    const checkbox = screen.getByRole("checkbox");

    fireEvent.click(checkbox);

    const nextButton = screen.getByRole("button", {
      name: /Continuar/i,
    });

    fireEvent.click(nextButton);

    fireEvent.click(
      screen.getByRole("button", {
        name: /Volver/i,
      }),
    );

    const participationCheckbox = screen.getByRole("checkbox");

    expect(
      (participationCheckbox as HTMLInputElement).checked,
    ).toBe(true);
  });

  it("muestra el título principal del wizard", () => {
    render(<MentorshipView />);

    expect(
      screen.getByText("Participa como mentor"),
    ).toBeDefined();
  });

  it("actualiza el contador al seleccionar áreas", () => {
    render(<MentorshipView />);

    fireEvent.click(screen.getByRole("checkbox"));

    const nextButton = screen.getByRole("button", {
      name: /Continuar/i,
    });

    fireEvent.click(nextButton);

    expect(
      screen.getByText("0 seleccionadas"),
    ).toBeDefined();

    fireEvent.click(
      screen.getByRole("button", {
        name: /Backend/i,
      }),
    );

    expect(
      screen.getByText("1 seleccionada"),
    ).toBeDefined();
  });

  it("deshabilita Continuar en el paso 3 sin orientación seleccionada", () => {
    render(<MentorshipView />);

    fireEvent.click(screen.getByRole("checkbox"));

    const nextButton = screen.getByRole("button", {
      name: /Continuar/i,
    });

    fireEvent.click(nextButton);

    fireEvent.click(
      screen.getByRole("button", {
        name: /Backend/i,
      }),
    );

    fireEvent.click(nextButton);

    expect(
      screen.getByRole("heading", {
        name: "Paso 3: Tipos de orientación",
      }),
    ).toBeDefined();

    expect(
      (nextButton as HTMLButtonElement).disabled,
    ).toBe(true);

    expect(
      screen.getByRole("alert"),
    ).toHaveTextContent(
      "Debe seleccionarse al menos un tipo de orientación para continuar",
    );
  });

  it("habilita Continuar en el paso 3 al seleccionar una orientación", () => {
    render(<MentorshipView />);

    fireEvent.click(screen.getByRole("checkbox"));

    const nextButton = screen.getByRole("button", {
      name: /Continuar/i,
    });

    fireEvent.click(nextButton);

    fireEvent.click(
      screen.getByRole("button", {
        name: /Backend/i,
      }),
    );

    fireEvent.click(nextButton);

    fireEvent.click(
      screen.getByRole("button", {
        name: /Orientación profesional/i,
      }),
    );

    expect(
      (nextButton as HTMLButtonElement).disabled,
    ).toBe(false);
  });

  it("muestra la confirmación en el último paso", () => {
    render(<MentorshipView />);

    fireEvent.click(screen.getByRole("checkbox"));

    const nextButton = screen.getByRole("button", {
      name: /Continuar/i,
    });

    fireEvent.click(nextButton);

    fireEvent.click(
      screen.getByRole("button", {
        name: /Backend/i,
      }),
    );

    fireEvent.click(nextButton);

    fireEvent.click(
      screen.getByRole("button", {
        name: /Orientación profesional/i,
      }),
    );

    fireEvent.click(nextButton);

    expect(
      screen.getByRole("heading", {
        name: "Confirma tu participación",
      }),
    ).toBeDefined();

    expect(
      screen.getByRole("button", {
        name: "Activar participación",
      }),
    ).toBeDefined();
  });

  it("muestra las orientaciones y permite seleccionar varias", () => {
    render(<MentorshipView />);

    fireEvent.click(screen.getByRole("checkbox"));

    const nextButton = screen.getByRole("button", {
      name: /Continuar/i,
    });

    fireEvent.click(nextButton);

    fireEvent.click(
      screen.getByRole("button", {
        name: /Backend/i,
      }),
    );

    fireEvent.click(nextButton);

    const professionalButton = screen.getByRole("button", {
      name: /Orientación profesional/i,
    });

    const technicalButton = screen.getByRole("button", {
      name: /Orientación técnica/i,
    });

    fireEvent.click(professionalButton);
    fireEvent.click(technicalButton);

    expect(
      screen.getByText("2 seleccionadas"),
    ).toBeDefined();

    expect(
      professionalButton.getAttribute("aria-pressed"),
    ).toBe("true");

    expect(
      technicalButton.getAttribute("aria-pressed"),
    ).toBe("true");
  });

  it("conserva las orientaciones al avanzar y regresar", () => {
    render(<MentorshipView />);

    fireEvent.click(screen.getByRole("checkbox"));

    const nextButton = screen.getByRole("button", {
      name: /Continuar/i,
    });

    fireEvent.click(nextButton);

    fireEvent.click(
      screen.getByRole("button", {
        name: /Backend/i,
      }),
    );

    fireEvent.click(nextButton);

    fireEvent.click(
      screen.getByRole("button", {
        name: /Orientación profesional/i,
      }),
    );

    fireEvent.click(nextButton);

    expect(
      screen.getByRole("heading", {
        name: "Confirma tu participación",
      }),
    ).toBeDefined();

    fireEvent.click(
      screen.getByRole("button", {
        name: /Volver/i,
      }),
    );

    expect(
      screen.getByText("1 seleccionada"),
    ).toBeDefined();

    const professionalButton = screen.getByRole("button", {
      name: /Orientación profesional/i,
    });

    expect(
      professionalButton.getAttribute("aria-pressed"),
    ).toBe("true");
  });
});