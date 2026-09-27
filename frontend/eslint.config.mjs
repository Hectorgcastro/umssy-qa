import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "coverage/**",
    "next-env.d.ts",
  ]),
  {
    files: ["src/**/*.{ts,tsx}"],
    rules: {
      // 2.2 Archivos y carpetas en kebab-case
      "check-file/filename-naming-convention": [
        "error",
        {
          "**/*.{ts,tsx}": "KEBAB_CASE",
        },
        {
          ignoreMiddleExtensions: true,
        },
      ],
      "check-file/folder-naming-convention": [
        "error",
        {
          "src/**/!(__tests__)": "NEXT_JS_APP_ROUTER_CASE",
        },
      ],
      // 2.2 Convenciones de Formato (camelCase, PascalCase, UPPER_SNAKE_CASE)
      "@typescript-eslint/naming-convention": [
        "error",
        {
          selector: "variable",
          format: ["camelCase", "UPPER_CASE", "PascalCase"],
          leadingUnderscore: "allow",
        },
        {
          selector: "function",
          format: ["camelCase", "PascalCase"],
        },
        {
          selector: "typeLike",
          format: ["PascalCase"],
        },
      ],

      // 2.1 Prohibición de emojis en UI y cadenas de texto
      "no-restricted-syntax": [
        "error",
        {
          selector:
            "Literal[value=/[\\u2600-\\u27BF\\uD83C-\\uDBFF\\uDC00-\\uDFFF]/]",
          message:
            "Estándar 2.1: No se permiten emojis en el código ni en la interfaz de usuario (UI).",
        },
        {
          selector:
            "JSXText[value=/[\\u2600-\\u27BF\\uD83C-\\uDBFF\\uDC00-\\uDFFF]/]",
          message:
            "Estándar 2.1: No se permiten emojis en la interfaz de usuario (UI).",
        },
        {
          selector:
            "TemplateElement[value.raw=/[\\u2600-\\u27BF\\uD83C-\\uDBFF\\uDC00-\\uDFFF]/]",
          message:
            "Estándar 2.1: No se permiten emojis en plantillas de texto.",
        },
      ],
    },
  },
  {
    // 2.4 Patrón de Acceso "Barril" (index.ts / index.tsx solo re-exportan)
    files: ["src/**/index.{ts,tsx}"],
    rules: {
      "no-restricted-syntax": [
        "error",
        {
          selector:
            ":matches(FunctionDeclaration, FunctionExpression, ArrowFunctionExpression, VariableDeclaration, ClassDeclaration, JSXElement, JSXFragment)",
          message:
            "Estándar 2.4: Los archivos index.ts solo pueden actuar como puentes de re-exportación. Prohibido incluir lógica o UI.",
        },
      ],
    },
  },
]);

export default eslintConfig;