## Getting Started

First, run the development server:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.


## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## UI Components (shadcn/ui)

This project uses [shadcn/ui](https://ui.shadcn.com) for UI components, built on top of Tailwind CSS.

### Initial Setup

shadcn/ui is already initialized in this project. If you need to set it up again from scratch, run:

```bash
pnpm dlx shadcn@latest init
```

When prompted, select:
- **Component library:** Base UI (Recommended)
- **Preset:** Nova (Lucide icons / Geist font)

This will generate `components.json`, `src/lib/utils.ts`, and update `src/app/globals.css` with the required Tailwind styles.

### Adding Components

To add a new component, run:

```bash
pnpm dlx shadcn@latest add <component-name>
```

For example, to add a button and a card:

```bash
pnpm dlx shadcn@latest add button
pnpm dlx shadcn@latest add card
```

Components are added to `src/components/ui/`. You can browse all available components at [ui.shadcn.com/docs/components](https://ui.shadcn.com/docs/components).
