type AppEnv = "local" | "dev" | "prod";

const currentEnv = (process.env.NEXT_PUBLIC_APP_ENV as AppEnv) || "local";

const API_URLS: Record<AppEnv, string | undefined> = {
  local: process.env.NEXT_PUBLIC_API_URL_LOCAL,
  dev: process.env.NEXT_PUBLIC_API_URL_DEV,
  prod: process.env.NEXT_PUBLIC_API_URL_PROD,
};

export const ENV_CONFIG = {
  env: currentEnv,
  apiUrl: API_URLS[currentEnv],
};

if (!ENV_CONFIG.apiUrl) {
  throw new Error(
    `Falta NEXT_PUBLIC_API_URL_${currentEnv.toUpperCase()} en tu .env.local. Revisa .env.example.`
  );
}