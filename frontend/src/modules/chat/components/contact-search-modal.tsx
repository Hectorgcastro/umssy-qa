'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useContactSearch } from '../hooks/use-contact-search';
import { getInitials } from '../utils/date-formatter';
import { User } from '../types/user.types';

interface ContactSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectContact: (user: User) => void;
}

export function ContactSearchModal({ isOpen, onClose, onSelectContact }: ContactSearchModalProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const { results, isSearching } = useContactSearch(searchTerm);

  const handleClose = () => {
    setSearchTerm('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-slate-900">Nueva conversación</DialogTitle>
        </DialogHeader>
        
        <div className="py-2">
          <Input 
            autoFocus
            placeholder="Buscar por nombre..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
        </div>

        <div className="flex flex-col gap-1 max-h-[300px] overflow-y-auto mt-2">
          {isSearching ? (
            <div className="text-center text-slate-500 py-6 text-sm">
              Buscando...
            </div>
          ) : results.length > 0 ? (
            results.map((user) => (
              <button
                key={user.id}
                onClick={() => {
                  onSelectContact(user);
                  handleClose();
                }}
                className="flex items-center gap-3 p-2 hover:bg-slate-50 rounded-lg transition-colors text-left"
              >
                {user.avatarUrl ? (
                  <img src={user.avatarUrl} alt={user.fullName} className="w-10 h-10 rounded-full object-cover" />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-sm">
                    {getInitials(user.fullName)}
                  </div>
                )}
                <div className="flex flex-col">
                  <span className="font-medium text-slate-800">{user.fullName}</span>
                  {user.headline && <span className="text-xs text-slate-500">{user.headline}</span>}
                </div>
              </button>
            ))
          ) : (
            searchTerm.trim().length >= 2 && (
              <div className="text-center text-slate-500 py-6 text-sm">
                No se encontraron usuarios
              </div>
            )
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}