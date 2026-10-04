import type { RegisteredUser } from "../types/registered-user.types";

// Datos simulados mientras el endpoint del backend no esté disponible (sección 1.6 del manual).
export const REGISTERED_USERS_MOCK: RegisteredUser[] = [
  { id: "1", fullName: "Juan Carlos Peres Rojas", email: "jc.peraz@gmail.com", userType: "DEGREE_HOLDER", identifier: "201942394", documentType: "ACADEMIC_DEGREE", registeredAt: "2026-03-15T10:00:00" },
  { id: "2", fullName: "Maria Quispe Mamani", email: "maria.qui@gmail.com", userType: "DEGREE_HOLDER", identifier: "201902277", documentType: "NATIONAL_DEGREE", registeredAt: "2026-02-20T10:00:00" },
  { id: "3", fullName: "Luis Fernando Vargaz Saliz", email: "lf.vargas.ct@gmail.com", userType: "GRADUATE", identifier: "201701190", documentType: "GRADUATION_CERTIFICATE", registeredAt: "2025-01-10T10:00:00" },
  { id: "4", fullName: "Andrea Camacho Torrez", email: "andrea.ct@gmail.com", userType: "GRADUATE", identifier: "201905853", documentType: "ACADEMIC_DIPLOMA", registeredAt: "2025-01-10T10:00:00" },
  { id: "5", fullName: "Rodrigo Gutiérrez Arce", email: "r.rutiereer@outlook.com", userType: "DEGREE_HOLDER", identifier: "201603348", documentType: "NATIONAL_DEGREE", registeredAt: "2025-01-10T10:00:00" },
  { id: "6", fullName: "Sofia Fernandez Claras", email: "sofia.fo@gmail.com", userType: "DEGREE_HOLDER", identifier: "201909731", documentType: "ACADEMIC_DIPLOMA", registeredAt: "2025-01-10T10:00:00" },
  { id: "7", fullName: "Diego Mercado Rocha", email: "dmercado@gmail.com", userType: "COMPANY", identifier: "1029964756", documentType: "NIT", registeredAt: "2025-01-10T10:00:00" },
  { id: "8", fullName: "Valeria Amez Lima", email: "vale.amez@gmail.com", userType: "ADMIN", identifier: "201902214", documentType: "ACADEMIC_DIPLOMA", registeredAt: "2026-03-15T10:00:00" },
  { id: "9", fullName: "Stephanie Mamani Choque", email: "stephanie.mamani@gmail.com", userType: "DEGREE_HOLDER", identifier: "202004667", documentType: "NATIONAL_DEGREE", registeredAt: "2026-03-15T10:00:00" },
  { id: "10", fullName: "Carlos Rivera Quispe", email: "carlos.rivera@gmail.com", userType: "GRADUATE", identifier: "201702345", documentType: "GRADUATION_CERTIFICATE", registeredAt: "2026-03-15T10:00:00" },
  { id: "11", fullName: "Ana Lucia Rojas Vera", email: "ana.rojas@gmail.com", userType: "STUDENT", identifier: "201801122", documentType: "ENROLLMENT_CERTIFICATE", registeredAt: "2025-11-04T10:00:00" },
  { id: "12", fullName: "Marco Antonio Flores Paz", email: "marco.flores@gmail.com", userType: "DEGREE_HOLDER", identifier: "201604587", documentType: "ACADEMIC_DEGREE", registeredAt: "2025-10-22T10:00:00" },
  { id: "13", fullName: "Tecnologías Andinas SRL", email: "rrhh@tecandinas.com", userType: "COMPANY", identifier: "3012457018", documentType: "NIT", registeredAt: "2025-10-15T10:00:00" },
  { id: "14", fullName: "Gabriela Soliz Arnez", email: "gabriela.soliz@gmail.com", userType: "MENTOR", identifier: "201903318", documentType: "ACADEMIC_DEGREE", registeredAt: "2025-09-30T10:00:00" },
  { id: "15", fullName: "Jorge Luis Céspedes Ortiz", email: "jl.cespedes@outlook.com", userType: "DEGREE_HOLDER", identifier: "201505976", documentType: "NATIONAL_DEGREE", registeredAt: "2025-09-12T10:00:00" },
  { id: "16", fullName: "Paola Andrea Guzmán Ríos", email: "paola.guzman@gmail.com", userType: "DEGREE_HOLDER", identifier: "201806641", documentType: "ACADEMIC_DEGREE", registeredAt: "2025-08-28T10:00:00" },
  { id: "17", fullName: "Innova Soft SA", email: "contacto@innovasoft.bo", userType: "COMPANY", identifier: "2098754013", documentType: "NIT", registeredAt: "2025-08-14T10:00:00" },
  { id: "18", fullName: "Ricardo Montaño Vidal", email: "ricardo.montano@gmail.com", userType: "STUDENT", identifier: "202001459", documentType: "ENROLLMENT_CERTIFICATE", registeredAt: "2025-07-30T10:00:00" },
  { id: "19", fullName: "Daniela Ugarte Salas", email: "daniela.ugarte@gmail.com", userType: "ADMIN", identifier: "201707783", documentType: "ACADEMIC_DEGREE", registeredAt: "2025-07-02T10:00:00" },
  { id: "20", fullName: "Fernando Aguilar Terán", email: "f.aguilar@gmail.com", userType: "DEGREE_HOLDER", identifier: "201408812", documentType: "NATIONAL_DEGREE", registeredAt: "2025-06-18T10:00:00" },
  { id: "21", fullName: "Lucía Herrera Pinto", email: "lucia.herrera@gmail.com", userType: "MENTOR", identifier: "202102204", documentType: "ACADEMIC_DEGREE", registeredAt: "2025-05-27T10:00:00" },
  { id: "22", fullName: "Mauricio Zeballos Durán", email: "mauricio.z@outlook.com", userType: "DEGREE_HOLDER", identifier: "201609935", documentType: "ACADEMIC_DEGREE", registeredAt: "2025-05-06T10:00:00" },
  { id: "23", fullName: "Datalab Bolivia SRL", email: "info@datalab.bo", userType: "COMPANY", identifier: "4015862011", documentType: "NIT", registeredAt: "2025-04-15T10:00:00" },
  { id: "24", fullName: "Camila Vargas Orellana", email: "camila.vargas@gmail.com", userType: "GRADUATE", identifier: "202003376", documentType: "GRADUATION_CERTIFICATE", registeredAt: "2025-03-20T10:00:00" },
];
