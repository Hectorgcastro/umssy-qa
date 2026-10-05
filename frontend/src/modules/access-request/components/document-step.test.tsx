import { readFileSync } from "node:fs";
import path from "node:path";
import { cleanup, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { accessRequestService } from "../services/access-request.service";
import { DocumentStep } from "./document-step";
import {
  makeFile,
  reachStep2,
  renderWithContext,
  stubObjectUrls,
  uploadFile,
  uploadSucceeds,
} from "./document-step-test-utils";

vi.mock("../services/access-request.service", () => ({
  accessRequestService: {
    createAccessRequest: vi.fn(),
    updateAccessRequest: vi.fn(),
    deleteAccessRequest: vi.fn(),
    uploadDocument: vi.fn(),
    removeDocument: vi.fn(),
  },
}));

const SEND = "Enviar solicitud";
const BACK = "Volver a mis datos";
const typeSelect = () => screen.getByRole("combobox", { name: /Tipo de documento/ });

describe("DocumentStep", () => {
  beforeEach(() => {
    vi.mocked(accessRequestService.createAccessRequest).mockReset();
    vi.mocked(accessRequestService.uploadDocument).mockReset();
    vi.mocked(accessRequestService.removeDocument).mockReset();
    stubObjectUrls();
  });
  afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
  });

  it("muestra el título y el nombre completo del paso 1 recortado", async () => {
    const view = renderWithContext(<DocumentStep />);
    await reachStep2(view.ctx);

    expect(screen.getByRole("heading", { level: 1, name: "Documento de respaldo" })).toBeInTheDocument();
    expect(
      screen.getByText("El nombre del documento debe coincidir con el que escribiste en el paso anterior: Ana María Rojas"),
    ).toBeInTheDocument();
  });

  it("el selector ofrece solo las dos opciones con sus nombres visibles", async () => {
    const user = userEvent.setup();
    const view = renderWithContext(<DocumentStep />);
    await reachStep2(view.ctx);
    expect(typeSelect()).toHaveTextContent("Elige el tipo de documento");

    await user.click(typeSelect());

    const options = await screen.findAllByRole("option");
    expect(options.map((option) => option.textContent)).toEqual(["Diploma académico", "Título en provisión nacional"]);
  });

  it("elegir una opción guarda el tipo en el Context y lo muestra", async () => {
    const user = userEvent.setup();
    const view = renderWithContext(<DocumentStep />);
    await reachStep2(view.ctx);

    await user.click(typeSelect());
    await user.click(await screen.findByRole("option", { name: "Título en provisión nacional" }));

    expect(view.ctx().document.documentType).toBe("national_title");
    expect(typeSelect()).toHaveTextContent("Título en provisión nacional");
  });

  it("sin documento muestra la zona de carga y Enviar solicitud está deshabilitado", async () => {
    const view = renderWithContext(<DocumentStep />);
    await reachStep2(view.ctx, "national_title");

    expect(screen.getByText("Arrastra tu documento aquí o elige un archivo.")).toBeInTheDocument();
    expect(screen.queryByText("Listo")).toBeNull();
    expect(screen.getByRole("button", { name: SEND })).toBeDisabled();
    expect(typeSelect()).toBeEnabled();
  });

  it("con un documento válido muestra la tarjeta, habilita Enviar y bloquea el selector", async () => {
    uploadSucceeds();
    const view = renderWithContext(<DocumentStep />);
    await reachStep2(view.ctx, "national_title");

    await uploadFile(view.ctx, makeFile("titulo.pdf"));

    expect(screen.getByText("Listo")).toBeInTheDocument();
    expect(screen.queryByText("Arrastra tu documento aquí o elige un archivo.")).toBeNull();
    expect(screen.getByRole("button", { name: SEND })).toBeEnabled();
    expect(typeSelect()).toBeDisabled();
  });

  it("Enviar solicitud todavía no hace nada", async () => {
    uploadSucceeds();
    const view = renderWithContext(<DocumentStep />);
    await reachStep2(view.ctx, "national_title");
    await uploadFile(view.ctx, makeFile());

    await userEvent.setup().click(screen.getByRole("button", { name: SEND }));

    expect(view.ctx().status).toBe("idle");
    expect(view.ctx().currentStep).toBe(2);
  });

  it("Quitar devuelve la zona de carga y vuelve a habilitar el selector", async () => {
    uploadSucceeds();
    vi.mocked(accessRequestService.removeDocument).mockResolvedValue({
      ok: true,
      data: { id: "draft-1", documentFileId: null },
    });
    const view = renderWithContext(<DocumentStep />);
    await reachStep2(view.ctx, "national_title");
    await uploadFile(view.ctx, makeFile());

    await userEvent.setup().click(screen.getByRole("button", { name: "Quitar" }));

    expect(await screen.findByText("Arrastra tu documento aquí o elige un archivo.")).toBeInTheDocument();
    expect(typeSelect()).toBeEnabled();
    expect(screen.getByRole("button", { name: SEND })).toBeDisabled();
  });

  it("Volver a mis datos regresa al paso 1 sin perder datos ni documento", async () => {
    uploadSucceeds();
    const view = renderWithContext(<DocumentStep />);
    await reachStep2(view.ctx, "national_title");
    await uploadFile(view.ctx, makeFile());
    expect(screen.getByText("paso-actual:2")).toBeInTheDocument();

    await userEvent.setup().click(screen.getByRole("button", { name: BACK }));

    expect(screen.getByText("paso-actual:1")).toBeInTheDocument();
    expect(view.ctx().values.firstName).toBe(" Ana María ");
    expect(view.ctx().draftId).toBe("draft-1");
    expect(view.ctx().hasDocument).toBe(true);
  });

  it("el panel de recomendaciones lista los consejos", async () => {
    const view = renderWithContext(<DocumentStep />);
    await reachStep2(view.ctx);

    const panel = screen.getByRole("complementary");
    expect(within(panel).getByRole("heading", { name: "Para que tu solicitud se apruebe sin demoras" })).toBeInTheDocument();
    expect(within(panel).getAllByRole("listitem")).toHaveLength(4);
    expect(within(panel).getByText("Formato JPG, PNG o PDF de hasta 10 MB.")).toBeInTheDocument();
  });

  it("no usa los términos prohibidos ni el atributo capture", async () => {
    uploadSucceeds();
    const view = renderWithContext(<DocumentStep />);
    await reachStep2(view.ctx, "national_title");

    const text = (document.body.textContent ?? "").toLowerCase();
    expect(text).not.toContain("egresad");
    expect(text).not.toContain("certificado de egreso");
    expect(document.querySelector("input[capture]")).toBeNull();

    await uploadFile(view.ctx, makeFile());
    expect((document.body.textContent ?? "").toLowerCase()).not.toContain("egresad");
  });
});

describe("archivos del paso 2", () => {
  const files = ["document-dropzone.tsx", "document-preview-card.tsx", "document-step.tsx"];

  it.each(files)("%s no tiene colores hex ni capture ni los términos prohibidos", (name) => {
    const source = readFileSync(path.resolve(process.cwd(), "src/modules/access-request/components", name), "utf8");

    expect(source).not.toMatch(/#[0-9a-fA-F]{3,8}\b/);
    expect(source).not.toMatch(/capture/i);
    expect(source).not.toMatch(/egresad|certificado de egreso/i);
  });
});
