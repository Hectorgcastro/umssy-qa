"use client";

import { useEffect, useState } from "react";
import { homeService } from "../services/home.service";

export function useHome() {
  const [backendMessage, setBackendMessage] = useState<string>("Cargando...");

  useEffect(() => {
    homeService
      .getWelcomeMessage()
      .then((data) => setBackendMessage(data))
      .catch(() => setBackendMessage("No se pudo conectar con el servidor"));
  }, []);

  return { backendMessage };
}