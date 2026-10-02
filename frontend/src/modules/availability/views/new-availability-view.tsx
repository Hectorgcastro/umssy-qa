"use client";

import { useState } from "react";
import { useAvailability } from "../hooks/use-availability";
import type { CreateAvailabilityBlockInput } from "../types/availability";

export function NewAvailabilityView() {
  const { createBlock, isLoading } = useAvailability();
  const [formData, setFormData] = useState<CreateAvailabilityBlockInput>({
    mentorId: "",
    startAt: "",
    endAt: "",
    seriesId: "",
    repeatUntil: "",
  });
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    setSubmitSuccess(false);

    const input: CreateAvailabilityBlockInput = {
      mentorId: formData.mentorId,
      startAt: formData.startAt,
      endAt: formData.endAt,
      seriesId: formData.seriesId || undefined,
      repeatUntil: formData.repeatUntil || undefined,
    };

    const result = await createBlock(input);
    if (result) {
      setSubmitSuccess(true);
      setFormData({ mentorId: "", startAt: "", endAt: "", seriesId: "", repeatUntil: "" });
    } else {
      setSubmitError("Failed to create availability block");
    }
  };

  return (
    <div className="p-6 max-w-2xl">
      <h1 className="text-2xl font-bold mb-4">Create New Availability Block</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Mentor ID</label>
          <input
            type="text"
            name="mentorId"
            value={formData.mentorId}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Start Time</label>
          <input
            type="datetime-local"
            name="startAt"
            value={formData.startAt}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">End Time</label>
          <input
            type="datetime-local"
            name="endAt"
            value={formData.endAt}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Series ID (optional)</label>
          <input
            type="text"
            name="seriesId"
            value={formData.seriesId}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Repeat Until (optional)</label>
          <input
            type="date"
            name="repeatUntil"
            value={formData.repeatUntil}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>
        {submitError && <p className="text-red-500">{submitError}</p>}
        {submitSuccess && <p className="text-green-500">Availability block created successfully!</p>}
        <button
          type="submit"
          disabled={isLoading}
          className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
        >
          {isLoading ? "Creating..." : "Create"}
        </button>
      </form>
    </div>
  );
}
