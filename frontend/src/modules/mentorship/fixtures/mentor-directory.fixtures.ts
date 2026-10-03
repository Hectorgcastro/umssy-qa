import type { MentorDirectoryItem } from "../types/mentor-directory.types";

export const MENTOR_DIRECTORY_FIXTURES: MentorDirectoryItem[] = [
  {
    id: "1",
    fullName: "María Fernanda Rodríguez",
    jobTitle: "Desarrolladora Backend Senior",
    technicalAreas: ["Backend", "APIs", "Bases de datos"],
    isAvailable: true,
  },
  {
    id: "2",
    fullName: "Carlos Andrés Vargas",
    jobTitle: "Ingeniero DevOps",
    technicalAreas: ["DevOps", "Cloud", "Infraestructura"],
    isAvailable: false,
  },
  {
    id: "3",
    fullName: "Daniela López Mendoza",
    jobTitle: "Ingeniera de Calidad de Software",
    technicalAreas: ["QA", "Testing", "Automatización"],
    isAvailable: true,
  },
  {
    id: "4",
    fullName: "José Miguel Fernández",
    jobTitle: "Desarrollador Frontend",
    technicalAreas: ["Frontend", "React", "TypeScript"],
    isAvailable: true,
  },
  {
    id: "5",
    fullName: "Alejandra Carolina Mendoza Fernández",
    jobTitle:
      "Especialista en arquitectura y desarrollo de plataformas empresariales",
    technicalAreas: [
      "Arquitectura de software",
      "Backend",
      "Cloud",
      "Microservicios",
    ],
    isAvailable: false,
  },
  {
    id: "6",
    fullName: "Fernando Rojas",
    jobTitle: null,
    technicalAreas: ["Bases de datos"],
    isAvailable: true,
  },
];