"use client";

import { useState } from "react";
import { JobDescriptionForm, TechSkillsSelector } from "@/modules/vacancies";

const INITIAL_SKILLS = [
  "Python", "Docker", "Git", "Java", "JavaScript", "TypeScript",
  "React", "Node.js", "SQL", "PostgreSQL", "Kubernetes", "Linux",
  "Django", "FastAPI", "Vue.js", "Angular", "MongoDB", "Redis",
  "Rust", "Assembly", "Kali"
];

export default function HomePage() {
  const [description, setDescription] = useState("");
  const [skills, setSkills] = useState<string[]>(INITIAL_SKILLS);
  const [selectedSkills, setSelectedSkills] = useState<string[]>(["Kali"]);

  const handleToggleSkill = (skill: string) => {
    setSelectedSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    );
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills((prev) => prev.filter((s) => s !== skillToRemove));
    setSelectedSkills((prev) => prev.filter((s) => s !== skillToRemove));
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8 flex items-center justify-center">
      <div className="w-full max-w-4xl rounded-xl border border-gray-200 bg-white p-6 shadow-sm space-y-6">
        <div className="flex items-center gap-2">
          <h2 className="text-base font-semibold text-gray-900">Requisitos técnicos</h2>
          <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-normal text-amber-800">
            CHIPS SELECCIONABLES
          </span>
        </div>

        {/* Sección 1: Descripción */}
        <JobDescriptionForm value={description} onChange={setDescription} />

        {/* Sección 2: Chips */}
        <TechSkillsSelector
          skills={skills}
          selectedSkills={selectedSkills}
          onToggleSkill={handleToggleSkill}
          onRemoveSkill={handleRemoveSkill}
          onOpenAddModal={() => alert("¡Aquí se abrirá el popup de la siguiente rama!")}
        />
      </div>
    </div>
  );
}