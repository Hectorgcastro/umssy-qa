import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { EventDetailPanel } from "./event-detail-panel";
import type { EventDetail } from "../types/event-item.types";
afterEach(cleanup);
const event: EventDetail = {
  id: "event-1",
  title: "React",
  category: { id: "cat-1", name: "Tecnología" },
  description: "Aprende React",
  instructorName: "Ana",
  eventDate: "2026-10-20",
  startTime: "09:00",
  endTime: "12:00",
  location: "Aula 101",
  capacity: 30,
  availableSpots: 20,
  registrationCount: 10,
  statusId: "published",
  modalityId: "m1",
  modality: { id: "m1", title: "Presencial" },
};
describe("EventDetailPanel", () => {
  it("shows complete detail and an enabled visual registration button", () => {
    render(<EventDetailPanel event={event} />);
    expect(screen.getByText("Ana")).toBeInTheDocument();
    expect(screen.getByText("Aula 101")).toBeInTheDocument();
    expect(screen.getByText("09:00 - 12:00")).toBeInTheDocument();
    expect(screen.getByText("Aprende React")).toBeInTheDocument();
    const button = screen.getByRole("button", { name: "Inscribirme" });
    expect(button).toBeEnabled();
    fireEvent.click(button);
    expect(screen.getByText("20 cupos disponibles")).toBeInTheDocument();
  });
  it("disables registration for full workshops", () => {
    render(
      <EventDetailPanel
        event={{ ...event, availableSpots: 0, registrationCount: 30 }}
      />,
    );
    expect(screen.getByRole("button", { name: "Inscribirme" })).toBeDisabled();
    expect(
      screen.getByText("Lleno · Sin cupos disponibles"),
    ).toBeInTheDocument();
  });
  it("handles missing optional values and unlimited capacity", () => {
    render(
      <EventDetailPanel
        event={{
          ...event,
          location: null,
          instructorName: null,
          description: null,
          capacity: null,
          availableSpots: null,
        }}
      />,
    );
    expect(screen.getAllByText("Por confirmar")).toHaveLength(2);
    expect(screen.getByText("Descripción por confirmar.")).toBeInTheDocument();
    expect(screen.getByText("Sin límite de cupos")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Inscribirme" })).toBeEnabled();
  });
  it("labels virtual locations as an access link", () => {
    render(
      <EventDetailPanel
        event={{
          ...event,
          modality: { id: "virtual", title: "Virtual" },
          location: "https://example.com/meeting",
        }}
      />,
    );
    expect(screen.getByText("Enlace:")).toBeInTheDocument();
    expect(screen.getByText("https://example.com/meeting")).toBeInTheDocument();
  });
});
