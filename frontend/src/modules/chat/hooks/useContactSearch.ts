import { useState, useEffect } from 'react';
import { User } from '../types/user.types';
import { searchUsers } from '../services/chat-api';

export function useContactSearch(searchTerm: string) {
  const [results, setResults] = useState<User[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    // 1. Limpieza del término de búsqueda (manejo como texto plano)
    const cleanTerm = searchTerm.trim();

    // 2. Mínimo 2 caracteres antes de filtrar
    if (cleanTerm.length < 2) {
      setResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);

    // 3. Debounce de 300 ms
    const timer = setTimeout(() => {
      // 4. Conexión al servicio mock
      searchUsers(cleanTerm)
        .then((data) => {
          setResults(data);
        })
        .catch((error) => {
          console.error("Error al buscar contactos:", error);
          setResults([]);
        })
        .finally(() => {
          setIsSearching(false);
        });
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  return { results, isSearching };
}