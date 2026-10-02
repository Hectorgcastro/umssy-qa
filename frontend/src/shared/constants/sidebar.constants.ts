import type { CSSProperties } from "react";

export const SIDEBAR_STYLE = { "--sidebar-width": "18rem" } as CSSProperties;

export const SIDEBAR_ITEM_CLASS =
  "relative h-auto gap-3 px-4 py-3 text-base text-surface/80 hover:bg-surface/5 hover:text-surface active:bg-surface/10 active:text-surface data-active:bg-surface/10 data-active:font-normal data-active:text-surface data-active:before:absolute data-active:before:inset-y-0 data-active:before:left-0 data-active:before:w-1 data-active:before:rounded-l-md data-active:before:bg-accent [&_svg]:size-5";

export const SIDEBAR_SUB_ITEM_CLASS =
  "h-auto gap-3 px-3 py-2 text-surface/70 hover:bg-surface/5 hover:text-surface active:bg-surface/10 active:text-surface data-active:bg-surface/10 data-active:text-surface";
