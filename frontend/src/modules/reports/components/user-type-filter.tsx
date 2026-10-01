"use client";

import { useEffect, useId, useRef, useState, type KeyboardEvent } from "react";
import { Check, ChevronDown } from "lucide-react";
import { USER_TYPE_FILTER_OPTIONS, USER_TYPE_LABELS } from "../constants/registered-users.constants";
import type { UserType } from "../types/registered-user.types";

interface UserTypeFilterProps {
  value?: UserType;
  onChange: (userType?: UserType) => void;
}

interface FilterOption {
  value?: UserType;
  label: string;
}

const FILTER_OPTIONS: FilterOption[] = [
  { value: undefined, label: "Todos" },
  ...USER_TYPE_FILTER_OPTIONS.map((userType) => ({ value: userType, label: USER_TYPE_LABELS[userType] })),
];

export function UserTypeFilter({ value, onChange }: UserTypeFilterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const baseId = useId();
  const labelId = `${baseId}-label`;
  const listboxId = `${baseId}-listbox`;

  const selectedIndex = Math.max(
    FILTER_OPTIONS.findIndex((option) => option.value === value),
    0,
  );

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) setIsOpen(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const openList = () => {
    setActiveIndex(selectedIndex);
    setIsOpen(true);
  };

  const selectOption = (option: FilterOption) => {
    setIsOpen(false);
    if (option.value !== value) onChange(option.value);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        if (isOpen) {
          setActiveIndex((index) => Math.min(index + 1, FILTER_OPTIONS.length - 1));
        } else {
          openList();
        }
        break;
      case "ArrowUp":
        event.preventDefault();
        if (isOpen) setActiveIndex((index) => Math.max(index - 1, 0));
        break;
      case "Enter":
      case " ":
        event.preventDefault();
        if (isOpen) {
          selectOption(FILTER_OPTIONS[activeIndex]);
        } else {
          openList();
        }
        break;
      case "Escape":
      case "Tab":
        setIsOpen(false);
        break;
    }
  };

  return (
    <div ref={containerRef} className="relative w-full sm:w-72">
      <button
        type="button"
        role="combobox"
        aria-labelledby={labelId}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-controls={listboxId}
        aria-activedescendant={isOpen ? `${listboxId}-option-${activeIndex}` : undefined}
        onClick={() => (isOpen ? setIsOpen(false) : openList())}
        onKeyDown={handleKeyDown}
        className={`flex w-full cursor-pointer items-center rounded-md border bg-surface px-3 pb-2 pt-1.5 text-left transition-colors hover:border-ink-soft hover:bg-surface-soft focus:outline-none focus-visible:border-ink-soft ${
          isOpen ? "border-ink-soft" : "border-border"
        }`}
      >
        <span className="flex-1">
          <span id={labelId} className="block text-xs text-text-secondary">
            Tipo de usuario
          </span>
          <span className="block text-sm text-ink">{FILTER_OPTIONS[selectedIndex].label}</span>
        </span>
        <ChevronDown
          className={`h-4 w-4 shrink-0 text-text-secondary transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
          aria-hidden="true"
        />
      </button>

      {isOpen && (
        <ul
          id={listboxId}
          role="listbox"
          aria-labelledby={labelId}
          className="absolute z-20 mt-2 w-full overflow-hidden rounded-md border border-border bg-surface py-1 shadow-lg"
        >
          {FILTER_OPTIONS.map((option, index) => {
            const isSelected = index === selectedIndex;

            return (
              <li
                key={option.label}
                id={`${listboxId}-option-${index}`}
                role="option"
                aria-selected={isSelected}
                onMouseEnter={() => setActiveIndex(index)}
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => selectOption(option)}
                className={`flex cursor-pointer items-center justify-between px-3 py-2 text-sm transition-colors ${
                  index === activeIndex ? "bg-surface-soft" : ""
                } ${isSelected ? "font-semibold text-ink" : "text-ink-soft"}`}
              >
                {option.label}
                {isSelected && <Check className="h-4 w-4 text-ink" aria-hidden="true" />}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
