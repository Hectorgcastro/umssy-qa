import { createLucideIcon } from "lucide-react";

// Lucide no incluye barras huecas ascendentes sobre línea base; se define con su misma API y trazo.
export const ChartBarsIcon = createLucideIcon("chart-bars", [
  ["path", { d: "M2 21h20", key: "baseline" }],
  ["rect", { x: "3", y: "15", width: "3", height: "5", rx: "0.5", key: "bar-1" }],
  ["rect", { x: "8", y: "11", width: "3", height: "9", rx: "0.5", key: "bar-2" }],
  ["rect", { x: "13", y: "7", width: "3", height: "13", rx: "0.5", key: "bar-3" }],
  ["rect", { x: "18", y: "3", width: "3", height: "17", rx: "0.5", key: "bar-4" }],
]);
