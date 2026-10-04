const RAW_URL = process.env.NEXT_PUBLIC_API_URL;

if (!RAW_URL) {
  throw new Error(
    "Falta NEXT_PUBLIC_API_URL en tu .env.local. Revisa .env.example."
  );
}

export const API_URL = RAW_URL;