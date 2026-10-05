"use client";

import React from "react";
import { JobDescriptionProps } from "../types";

export const JobDescriptionForm: React.FC<JobDescriptionProps> = ({
  value,
  onChange,
  maxLength = 3000,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    if (text.length <= maxLength) {
      onChange(text);
    }
  };

  const isLimitReached = value.length >= maxLength;

  return (
    <div className="w-full space-y-2">
      <div className="flex items-center justify-between">
        <label
          htmlFor="job-description"
          className="text-sm font-medium text-gray-700"
        >
          Descripción del puesto <span className="text-red-500">*</span>
        </label>
        <span
          className={`text-xs ${
            isLimitReached ? "font-semibold text-red-500" : "text-gray-500"
          }`}
        >
          {value.length} / {maxLength} caracteres
        </span>
      </div>

      <textarea
        id="job-description"
        value={value}
        onChange={handleChange}
        maxLength={maxLength}
        placeholder="Buscamos un desarrollador backend con experiencia en Python y arquitecturas de microservicios..."
        className="min-h-[160px] w-full resize-y rounded-lg border border-gray-300 bg-white p-3 text-sm text-gray-900 outline-none transition-colors placeholder:text-gray-400 focus:border-red-600 focus:ring-1 focus:ring-red-600 whitespace-pre-wrap"
      />
    </div>
  );
};