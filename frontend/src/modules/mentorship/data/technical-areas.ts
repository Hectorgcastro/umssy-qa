import type { TechnicalArea } from "../types/technical-area.types";

export const TECHNICAL_AREAS: TechnicalArea[] = [
  {
    id: "backend",
    name: "Backend",
    description: "APIs, lógica de negocio y bases de datos",
    icon: "Server",
  },
  {
    id: "frontend",
    name: "Frontend",
    description: "Interfaces de usuario y experiencia web",
    icon: "Monitor",
  },
  {
    id: "qa",
    name: "QA",
    description: "Pruebas, calidad y automatización",
    icon: "CheckCircle",
  },
  {
    id: "cloud",
    name: "Cloud",
    description: "Infraestructura, DevOps y despliegues",
    icon: "Cloud",
  },
  {
    id: "mobile",
    name: "Mobile",
    description: "Aplicaciones móviles nativas e híbridas",
    icon: "Smartphone",
  },
  {
    id: "data",
    name: "Data",
    description: "Análisis de datos, BI y machine learning",
    icon: "Database",
  },
];
