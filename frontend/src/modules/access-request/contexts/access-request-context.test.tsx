import type { ReactNode } from "react";
import { act, cleanup, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { accessRequestService } from "../services/access-request.service";
import type { ApiResult } from "../types/access-request.types";
import { AccessRequestProvider, useAccessRequestForm } from "./access-request-context";

vi.mock("../services/access-request.service", () => ({
  accessRequestService: {
    createAccessRequest: vi.fn(),
    updateAccessRequest: vi.fn(),
    deleteAccessRequest: vi.fn(),
  },
}));

const create = vi.mocked(accessRequestService.createAccessRequest);
const update = vi.mocked(accessRequestService.updateAccessRequest);
const remove = vi.mocked(accessRequestService.deleteAccessRequest);

const wrapper = ({ children }: { children: ReactNode }) => <AccessRequestProvider>{children}</AccessRequestProvider>;

const failure = (status: number, message: string): ApiResult<never> => ({ ok: false, status, fieldErrors: {}, message });

function setup() {
  return renderHook(() => useAccessRequestForm(), { wrapper });
}

type Hook = ReturnType<typeof setup>;

function fillValid(hook: Hook) {
  act(() => {
    const { setValue } = hook.result.current;
    setValue("firstName", "Ana María");
    setValue("lastName", "Rojas");
    setValue("idCardNumber", "1234567");
    setValue("idCardIssuedIn", "LP");
    setValue("sisCode", "202012345");
    setValue("email", "ana@umss.edu.bo");
    setValue("birthDate", "2000-05-10");
    setValue("graduationYear", "2019");
    setValue("career", "Licenciatura en Ingeniería de Sistemas");
  });
}

async function saveDraft(hook: Hook, id = "draft-1") {
  create.mockResolvedValueOnce({ ok: true, data: { id } });
  await act(async () => {
    await hook.result.current.submit();
  });
}

describe("AccessRequestProvider: limpieza y hasData", () => {
  beforeEach(() => {
    create.mockReset();
    update.mockReset();
    remove.mockReset();
  });
  afterEach(() => cleanup());

  describe("hasData", () => {
    it("es false con todo vacío", () => {
      const hook = setup();

      expect(hook.result.current.hasData).toBe(false);
    });

    it("es false con solo espacios", () => {
      const hook = setup();

      act(() => hook.result.current.setValue("firstName", "   "));

      expect(hook.result.current.hasData).toBe(false);
    });

    it("es true con un campo con valor, aunque no haya borrador", () => {
      const hook = setup();

      act(() => hook.result.current.setValue("career", "Licenciatura en Ingeniería de Sistemas"));

      expect(hook.result.current.hasData).toBe(true);
      expect(hook.result.current.draftId).toBeNull();
    });
  });

  describe("clear", () => {
    it("sin borrador limpia valores, errores y aviso sin llamar al servicio", async () => {
      const hook = setup();
      act(() => hook.result.current.setValue("firstName", "Ana"));
      await act(async () => {
        await hook.result.current.submit();
      });
      expect(Object.keys(hook.result.current.fieldErrors).length).toBeGreaterThan(0);

      let result;
      await act(async () => {
        result = await hook.result.current.clear();
      });

      expect(result).toEqual({ ok: true });
      expect(hook.result.current.values.firstName).toBe("");
      expect(hook.result.current.fieldErrors).toEqual({});
      expect(hook.result.current.notice).toBeNull();
      expect(hook.result.current.hasData).toBe(false);
      expect(hook.result.current.status).toBe("idle");
      expect(remove).not.toHaveBeenCalled();
    });

    it("con borrador llama a deleteAccessRequest con el id, limpia y el siguiente envío crea", async () => {
      remove.mockResolvedValue({ ok: true, data: { id: "draft-1" } });
      const hook = setup();
      fillValid(hook);
      await saveDraft(hook);
      expect(hook.result.current.draftId).toBe("draft-1");

      let result;
      await act(async () => {
        result = await hook.result.current.clear();
      });

      expect(result).toEqual({ ok: true });
      expect(remove).toHaveBeenCalledTimes(1);
      expect(remove).toHaveBeenCalledWith("draft-1");
      expect(hook.result.current.draftId).toBeNull();
      expect(hook.result.current.notice).toBeNull();
      expect(hook.result.current.values.email).toBe("");

      fillValid(hook);
      create.mockResolvedValueOnce({ ok: true, data: { id: "draft-2" } });
      await act(async () => {
        await hook.result.current.submit();
      });

      expect(create).toHaveBeenCalledTimes(2);
      expect(update).not.toHaveBeenCalled();
      expect(hook.result.current.draftId).toBe("draft-2");
    });

    it("un 404 del DELETE cuenta como éxito y limpia igual", async () => {
      remove.mockResolvedValue(failure(404, "La solicitud ya no existe"));
      const hook = setup();
      fillValid(hook);
      await saveDraft(hook);

      let result;
      await act(async () => {
        result = await hook.result.current.clear();
      });

      expect(result).toEqual({ ok: true });
      expect(hook.result.current.draftId).toBeNull();
      expect(hook.result.current.hasData).toBe(false);
    });

    it.each([
      ["409", failure(409, "La solicitud ya fue enviada y no se puede eliminar")],
      ["error de red", failure(0, "No se pudo conectar con el servidor. Inténtalo de nuevo.")],
    ])("un %s del DELETE no limpia nada y devuelve el mensaje", async (_name, failed) => {
      remove.mockResolvedValue(failed);
      const hook = setup();
      fillValid(hook);
      await saveDraft(hook);

      let result;
      await act(async () => {
        result = await hook.result.current.clear();
      });

      expect(result).toEqual({ ok: false, message: failed.ok ? "" : failed.message });
      expect(hook.result.current.values.firstName).toBe("Ana María");
      expect(hook.result.current.draftId).toBe("draft-1");
      expect(hook.result.current.notice).toMatchObject({ type: "success" });
      expect(hook.result.current.status).toBe("idle");
    });

    it("tras un DELETE fallido se puede reintentar", async () => {
      remove.mockResolvedValueOnce(failure(0, "sin red"));
      remove.mockResolvedValueOnce({ ok: true, data: { id: "draft-1" } });
      const hook = setup();
      fillValid(hook);
      await saveDraft(hook);

      await act(async () => {
        await hook.result.current.clear();
      });
      let result;
      await act(async () => {
        result = await hook.result.current.clear();
      });

      expect(result).toEqual({ ok: true });
      expect(remove).toHaveBeenCalledTimes(2);
      expect(hook.result.current.draftId).toBeNull();
    });

    it("dos llamadas simultáneas hacen una sola llamada al servicio", async () => {
      let resolve!: (value: ApiResult<{ id?: string }>) => void;
      remove.mockReturnValue(new Promise((done) => (resolve = done)));
      const hook = setup();
      fillValid(hook);
      await saveDraft(hook);

      let first!: Promise<unknown>;
      let second!: Promise<unknown>;
      await act(async () => {
        first = hook.result.current.clear();
        second = hook.result.current.clear();
      });

      expect(hook.result.current.status).toBe("clearing");
      await expect(second).resolves.toEqual({ ok: false, message: "Hay una operación en curso. Espera a que termine." });
      await act(async () => {
        resolve({ ok: true, data: { id: "draft-1" } });
        await first;
      });

      expect(remove).toHaveBeenCalledTimes(1);
      expect(hook.result.current.status).toBe("idle");
    });

    it("durante un envío en curso devuelve ok false sin tocar nada", async () => {
      let resolve!: (value: ApiResult<{ id: string }>) => void;
      create.mockReturnValue(new Promise((done) => (resolve = done)));
      const hook = setup();
      fillValid(hook);

      let submitting!: Promise<void>;
      await act(async () => {
        submitting = hook.result.current.submit();
      });
      expect(hook.result.current.status).toBe("submitting");

      let result;
      await act(async () => {
        result = await hook.result.current.clear();
      });

      expect(result).toEqual({ ok: false, message: "Hay una operación en curso. Espera a que termine." });
      expect(remove).not.toHaveBeenCalled();
      expect(hook.result.current.values.firstName).toBe("Ana María");
      expect(hook.result.current.status).toBe("submitting");

      await act(async () => {
        resolve({ ok: true, data: { id: "draft-1" } });
        await submitting;
      });
    });

    it("submit se ignora mientras se limpia", async () => {
      let resolve!: (value: ApiResult<{ id?: string }>) => void;
      remove.mockReturnValue(new Promise((done) => (resolve = done)));
      const hook = setup();
      fillValid(hook);
      await saveDraft(hook);
      create.mockClear();

      let clearing!: Promise<unknown>;
      await act(async () => {
        clearing = hook.result.current.clear();
      });
      await act(async () => {
        await hook.result.current.submit();
      });

      expect(create).not.toHaveBeenCalled();
      expect(update).not.toHaveBeenCalled();

      await act(async () => {
        resolve({ ok: true, data: { id: "draft-1" } });
        await clearing;
      });
    });
  });
});
