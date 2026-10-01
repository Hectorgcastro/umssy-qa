import { createLucideIcon } from "lucide-react";

// Cinco barras huecas ascendentes y una base redondeada, según la referencia.
export const ChartBarsIcon = createLucideIcon("chart-bars", [
  ["rect", { x: "1.5", y: "21", width: "21", height: "2.5", rx: "1.25", strokeWidth: "1", key: "baseline" }],
  ["rect", { x: "3.4", y: "14.6", width: "2.2", height: "5.1", rx: "0.1", strokeWidth: "1", key: "bar-1" }],
  ["rect", { x: "7.15", y: "11.2", width: "2.2", height: "8.5", rx: "0.1", strokeWidth: "1", key: "bar-2" }],
  ["rect", { x: "10.9", y: "7.8", width: "2.2", height: "11.9", rx: "0.1", strokeWidth: "1", key: "bar-3" }],
  ["rect", { x: "14.65", y: "4.4", width: "2.2", height: "15.3", rx: "0.1", strokeWidth: "1", key: "bar-4" }],
  ["rect", { x: "18.4", y: "1", width: "2.2", height: "18.7", rx: "0.1", strokeWidth: "1", key: "bar-5" }],
]);
