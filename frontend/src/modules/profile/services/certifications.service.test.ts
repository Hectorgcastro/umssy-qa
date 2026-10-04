import { beforeEach, describe, expect, it, vi } from "vitest";
import { apiClient } from "@/shared/services/api-client";
import type { Certification, CreateCertificationDto } from "../types/certification.types";

vi.mock("@/shared/services/api-client", () => ({
  apiClient: {
    get: vi.fn(),
    post: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
  },
}));

const NEW_CERTIFICATION: CreateCertificationDto = {
  name: "Scrum Master",
  issuingOrganization: "Scrum Alliance",
  issueDate: "2025-04-20",
};

const SAVED_CERTIFICATION: Certification = {
  id: "certification-1",
  ...NEW_CERTIFICATION,
  createdAt: "2025-04-21T10:00:00.000Z",
  updatedAt: "2025-04-21T10:00:00.000Z",
};

const NOT_FOUND_ERROR = { response: { status: 404 } };
const NETWORK_ERROR = new Error("Network Error");
const SERVER_ERROR = { response: { status: 500 } };

async function loadService() {
  const { certificationsService } = await import("./certifications.service");
  return certificationsService;
}

type CertificationsService = Awaited<ReturnType<typeof loadService>>;

function makeEndpointsUnavailable() {
  vi.mocked(apiClient.get).mockRejectedValue(NOT_FOUND_ERROR);
  vi.mocked(apiClient.post).mockRejectedValue(NOT_FOUND_ERROR);
  vi.mocked(apiClient.patch).mockRejectedValue(NOT_FOUND_ERROR);
  vi.mocked(apiClient.delete).mockRejectedValue(NOT_FOUND_ERROR);
}

describe("certificationsService", () => {
  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
  });

  describe("with the endpoints available", () => {
    it("gets the certifications of the current user", async () => {
      vi.mocked(apiClient.get).mockResolvedValue({ data: { data: [SAVED_CERTIFICATION] } });
      const service = await loadService();

      await expect(service.getCertifications()).resolves.toEqual([SAVED_CERTIFICATION]);
      expect(apiClient.get).toHaveBeenCalledWith("/certifications");
    });

    it("creates a certification", async () => {
      vi.mocked(apiClient.post).mockResolvedValue({ data: { data: SAVED_CERTIFICATION } });
      const service = await loadService();

      await expect(service.createCertification(NEW_CERTIFICATION)).resolves.toEqual(
        SAVED_CERTIFICATION,
      );
      expect(apiClient.post).toHaveBeenCalledWith("/certifications", NEW_CERTIFICATION);
    });

    it("updates a certification", async () => {
      const updated = { ...SAVED_CERTIFICATION, name: "Professional Scrum Master" };
      vi.mocked(apiClient.patch).mockResolvedValue({ data: { data: updated } });
      const service = await loadService();

      await expect(
        service.updateCertification("certification-1", { name: updated.name }),
      ).resolves.toEqual(updated);
      expect(apiClient.patch).toHaveBeenCalledWith("/certifications/certification-1", {
        name: updated.name,
      });
    });

    it("deletes a certification", async () => {
      vi.mocked(apiClient.delete).mockResolvedValue({});
      const service = await loadService();

      await service.deleteCertification("certification-1");

      expect(apiClient.delete).toHaveBeenCalledWith("/certifications/certification-1");
    });
  });

  describe("with an unexpected server error", () => {
    it.each<[string, (service: CertificationsService) => Promise<unknown>]>([
      ["getCertifications", (service) => service.getCertifications()],
      ["createCertification", (service) => service.createCertification(NEW_CERTIFICATION)],
      ["updateCertification", (service) => service.updateCertification("certification-1", {})],
      ["deleteCertification", (service) => service.deleteCertification("certification-1")],
    ])("rethrows the error from %s", async (_name, call) => {
      vi.mocked(apiClient.get).mockRejectedValue(SERVER_ERROR);
      vi.mocked(apiClient.post).mockRejectedValue(SERVER_ERROR);
      vi.mocked(apiClient.patch).mockRejectedValue(SERVER_ERROR);
      vi.mocked(apiClient.delete).mockRejectedValue(SERVER_ERROR);
      const service = await loadService();

      await expect(call(service)).rejects.toBe(SERVER_ERROR);
    });
  });

  describe("with the endpoints unavailable", () => {
    it("starts with an empty list", async () => {
      makeEndpointsUnavailable();
      const service = await loadService();

      await expect(service.getCertifications()).resolves.toEqual([]);
    });

    it("falls back to sample data on network errors", async () => {
      vi.mocked(apiClient.get).mockRejectedValue(NETWORK_ERROR);
      const service = await loadService();

      await expect(service.getCertifications()).resolves.toEqual([]);
    });

    it("creates, updates and deletes sample certifications in memory", async () => {
      makeEndpointsUnavailable();
      const service = await loadService();

      const created = await service.createCertification(NEW_CERTIFICATION);
      expect(created).toMatchObject(NEW_CERTIFICATION);
      expect(created.id).toEqual(expect.any(String));
      await expect(service.getCertifications()).resolves.toEqual([created]);

      const updated = await service.updateCertification(created.id, {
        issuingOrganization: "Scrum.org",
      });
      expect(updated).toMatchObject({ id: created.id, issuingOrganization: "Scrum.org" });
      await expect(service.getCertifications()).resolves.toEqual([updated]);

      await service.deleteCertification(created.id);
      await expect(service.getCertifications()).resolves.toEqual([]);
    });

    it("keeps other sample certifications when one is updated", async () => {
      makeEndpointsUnavailable();
      const service = await loadService();

      const first = await service.createCertification(NEW_CERTIFICATION);
      const second = await service.createCertification({ ...NEW_CERTIFICATION, name: "CCNA" });
      const updated = await service.updateCertification(second.id, { name: "CCNP" });

      await expect(service.getCertifications()).resolves.toEqual([first, updated]);
    });

    it("fails to update a sample certification that does not exist", async () => {
      makeEndpointsUnavailable();
      const service = await loadService();

      await expect(service.updateCertification("missing", { name: "CCNA" })).rejects.toThrow(
        "Certification missing not found",
      );
    });
  });
});
