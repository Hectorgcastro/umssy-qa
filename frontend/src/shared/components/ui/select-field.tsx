"use client";

import { useEffect, useId, useRef, useState } from "react";
import type { KeyboardEvent } from "react";
import { Check, ChevronDown } from "lucide-react";
import type { SelectOption } from "@/shared/types/select-option.types";

interface SelectFieldProps {
  label: string;
  options: SelectOption[];
  defaultValue: string;
  onChange?: (value: string) => void;
}

export function SelectField({
  label,
  options,
  defaultValue,
  onChange,
}: SelectFieldProps) {
  const [selectedValue, setSelectedValue] = useState(defaultValue);
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const baseId = useId();
  const labelId = `${baseId}-label`;
  const listboxId = `${baseId}-listbox`;

  const selectedIndex = options.findIndex(
    (option) => option.value === selectedValue,
  );
  const selectedOption = options[selectedIndex];

  useEffect(() => {
    if (!isOpen) return;

    function handleClickOutside(event: MouseEvent) {
      if (!containerRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  function openList() {
    setActiveIndex(Math.max(selectedIndex, 0));
    setIsOpen(true);
  }

  function selectOption(option: SelectOption) {
    setSelectedValue(option.value);
    setIsOpen(false);
    onChange?.(option.value);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        if (!isOpen) {
          openList();
        } else {
          setActiveIndex((index) => Math.min(index + 1, options.length - 1));
        }
        break;
      case "ArrowUp":
        event.preventDefault();
        if (isOpen) {
          setActiveIndex((index) => Math.max(index - 1, 0));
        }
        break;
      case "Enter":
      case " ":
        event.preventDefault();
        if (isOpen) {
          selectOption(options[activeIndex]);
        } else {
          openList();
        }
        break;
      case "Escape":
      case "Tab":
        setIsOpen(false);
        break;
    }
  }

  return (
    <div ref={containerRef} className="relative w-full max-w-xs">
      <button
        type="button"
        role="combobox"
        aria-labelledby={labelId}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-controls={listboxId}
        aria-activedescendant={
          isOpen ? `${listboxId}-option-${activeIndex}` : undefined
        }
        onClick={() => (isOpen ? setIsOpen(false) : openList())}
        onKeyDown={handleKeyDown}
        className={`flex w-full cursor-pointer items-center rounded-md border bg-surface py-1.5 pl-3 pr-3 text-left shadow-sm outline-none transition-colors hover:border-ink-soft hover:bg-surface-soft focus-visible:ring-2 focus-visible:ring-ink/20 ${
          isOpen ? "border-ink-soft" : "border-border-strong"
        }`}
      >
        <span className="flex-1">
          <span
            id={labelId}
            className="block text-[10px] font-semibold text-text-secondary"
          >
            {label}
          </span>
          <span className="block text-sm font-semibold text-ink">
            {selectedOption?.label}
          </span>
        </span>
        <ChevronDown
          aria-hidden="true"
          className={`h-5 w-5 shrink-0 text-ink-soft transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <ul
          id={listboxId}
          role="listbox"
          aria-labelledby={labelId}
          className="absolute z-20 mt-2 w-full overflow-hidden rounded-md border border-border bg-surface py-1 shadow-lg"
        >
          {options.map((option, index) => {
            const isSelected = option.value === selectedValue;
            const isActive = index === activeIndex;

            return (
              <li
                key={option.value}
                id={`${listboxId}-option-${index}`}
                role="option"
                aria-selected={isSelected}
                onMouseEnter={() => setActiveIndex(index)}
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => selectOption(option)}
                className={`flex cursor-pointer items-center justify-between px-3 py-2 text-sm transition-colors ${
                  isActive ? "bg-surface-soft" : ""
                } ${isSelected ? "font-semibold text-ink" : "text-ink-soft"}`}
              >
                {option.label}
                {isSelected && (
                  <Check aria-hidden="true" className="h-4 w-4 text-ink" />
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
