import { useState, useEffect } from 'react';
import { User } from '../types/user.types';
import { searchUsers } from '../services/chat-api'; 

export function useContactSearch(searchTerm: string) {
  const [results, setResults] = useState<User[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    if (searchTerm.trim().length < 2) {
      setResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);

    const timer = setTimeout(() => {
      searchUsers(searchTerm)
        .then((data) => {
          setResults(data);
        })
        .catch((error) => {
          console.error("Error buscando usuarios:", error);
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