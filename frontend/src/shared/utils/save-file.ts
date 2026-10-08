import type { SaveFileHandle, SaveFilePickerWindow } from "@/shared/types/save-file.types";

export function selectCsvDestination(suggestedName: string): Promise<SaveFileHandle> | undefined {
  const browser = window as SaveFilePickerWindow;
  if (typeof browser.showSaveFilePicker !== "function") return undefined;

  // Open the picker during the click, before waiting for the report request.
  return browser.showSaveFilePicker({
    suggestedName,
    types: [{ description: "Archivo CSV", accept: { "text/csv": [".csv"] } }],
    excludeAcceptAllOption: true,
  });
}

export async function saveFile(file: Blob, handle: SaveFileHandle): Promise<void> {
  const writable = await handle.createWritable();

  try {
    await writable.write(file);
    await writable.close();
  } catch (error) {
    await writable.abort().catch(() => undefined);
    throw error;
  }
}
