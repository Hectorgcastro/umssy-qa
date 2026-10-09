// Cookie marcadora de sesión: solo le dice al proxy que hubo un inicio de sesión. No lleva el token ni datos personales
export const SESSION_COOKIE_NAME = "umssy_session";
export const SESSION_COOKIE_VALUE = "1";

// Parámetro del login con la ruta privada a la que volver
export const NEXT_PARAM = "next";
export const MAX_NEXT_LENGTH = 300;

// Rutas que se ven sin sesión (cada una cubre también sus subrutas)
export const PUBLIC_ROUTES: readonly string[] = ["/login", "/request-access", "/sidebar-preview"];

// Pases de eventos: el proxy no la redirige para no impedir el uso sin conexión; la vista maneja la falta de sesión
export const OFFLINE_ROUTES: readonly string[] = ["/events/my-passes"];
