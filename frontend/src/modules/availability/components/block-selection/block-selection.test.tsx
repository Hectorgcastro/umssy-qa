import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";
import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { BlockSelection } from "./block-selection";
import type { AvailabilityBlock } from "../../types/availability-block.types";

vi.mock("../week-grid/week-grid", () => ({
  WeekGrid: ({
    blocks,
    onSelectBlock,
  }: {
    blocks: AvailabilityBlock[];
    onSelectBlock?: (block: AvailabilityBlock) => void;
  }) => (
    <div data-testid="week-grid">
      {blocks.map((block) => (
        <button
          key={block.id}
          type="button"
          onClick={() => onSelectBlock?.(block)}
        >
          {block.id}
        </button>
      ))}
    </div>
  ),
}));

const freeBlock: AvailabilityBlock = {
  id: "free-1",
  mentorId: "m1",
  startAt: "2026-10-06T22:00:00.000Z",
  endAt: "2026-10-06T23:00:00.000Z",
  state: "free",
  createdAt: "",
  updatedAt: "",
};

const busyBlock: AvailabilityBlock = {
  id: "busy-1",
  mentorId: "m1",
  startAt: "2026-10-07T22:00:00.000Z",
  endAt: "2026-10-07T23:00:00.000Z",
  state: "confirmed",
  createdAt: "",
  updatedAt: "",
};

const weekRange = {
  startAt: "2026-10-05T04:00:00.000Z",
  endAt: "2026-10-12T03:59:59.999Z",
};

describe("BlockSelection", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  it("muestra únicamente los bloques libres", () => {
    const fetchFreeBlocks = vi.fn().mockResolvedValue([freeBlock, busyBlock]);

    render(
      <BlockSelection
        blocks={[freeBlock, busyBlock]}
        weekRange={weekRange}
        fetchFreeBlocks={fetchFreeBlocks}
      />,
    );

    expect(screen.getByRole("button", { name: "free-1" })).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "busy-1" }),
    ).not.toBeInTheDocument();
  });

  it("permite seleccionar un bloque libre", () => {
    const fetchFreeBlocks = vi.fn().mockResolvedValue([freeBlock]);

    render(
      <BlockSelection
        blocks={[freeBlock]}
        weekRange={weekRange}
        fetchFreeBlocks={fetchFreeBlocks}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "free-1" }));

    expect(
      screen.getByText(/Horario seleccionado:/i),
    ).toBeInTheDocument();
  });

  it("actualiza los bloques al pulsar Actualizar", async () => {
    const newBlock: AvailabilityBlock = {
      ...freeBlock,
      id: "free-2",
      startAt: "2026-10-08T22:00:00.000Z",
      endAt: "2026-10-08T23:00:00.000Z",
    };

    const fetchFreeBlocks = vi.fn().mockResolvedValue([newBlock]);

    render(
      <BlockSelection
        blocks={[freeBlock]}
        weekRange={weekRange}
        fetchFreeBlocks={fetchFreeBlocks}
      />,
    );

    expect(
      screen.getByRole("button", { name: "free-1" }),
    ).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Actualizar" }));

    await waitFor(() => {
      expect(fetchFreeBlocks).toHaveBeenCalledTimes(1);
    });

    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: "free-2" }),
      ).toBeInTheDocument();
    });

    expect(
      screen.queryByRole("button", { name: "free-1" }),
    ).not.toBeInTheDocument();
  });

  it("muestra Actualizando y deshabilita el botón mientras actualiza", async () => {
    let resolveRequest: (value: AvailabilityBlock[]) => void = () => {};

    const fetchFreeBlocks = vi.fn(
      () =>
        new Promise<AvailabilityBlock[]>((resolve) => {
          resolveRequest = resolve;
        }),
    );

    render(
      <BlockSelection
        blocks={[freeBlock]}
        weekRange={weekRange}
        fetchFreeBlocks={fetchFreeBlocks}
      />,
    );

    const refreshButton = screen.getByRole("button", {
      name: "Actualizar",
    });

    fireEvent.click(refreshButton);

    expect(
      screen.getByRole("button", { name: "Actualizando..." }),
    ).toBeDisabled();

    resolveRequest([freeBlock]);

    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: "Actualizar" }),
      ).not.toBeDisabled();
    });
  });

  it("elimina la selección si el bloque deja de estar libre después de actualizar", async () => {
    const fetchFreeBlocks = vi.fn().mockResolvedValue([]);

    render(
      <BlockSelection
        blocks={[freeBlock]}
        weekRange={weekRange}
        fetchFreeBlocks={fetchFreeBlocks}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "free-1" }));

    expect(
      screen.getByText(/Horario seleccionado:/i),
    ).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Actualizar" }));

    await waitFor(() => {
      expect(fetchFreeBlocks).toHaveBeenCalledTimes(1);
    });

    await waitFor(() => {
      expect(
        screen.queryByText(/Horario seleccionado:/i),
      ).not.toBeInTheDocument();
    });
  });
});
