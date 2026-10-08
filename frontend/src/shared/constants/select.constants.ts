// El tema pone texto blanco (--accent-foreground) sobre el fondo resaltado claro (--accent), también en los descendientes del ítem;
// se fijan fondo suave y texto tinta en ambos niveles para que la opción resaltada se lea
export const SELECT_ITEM_CONTRAST_CLASS = "focus:bg-surface-soft focus:text-ink not-data-[variant=destructive]:focus:**:text-ink";

// El popup crece hasta el ancho de sus opciones (mínimo, el del botón) sin salirse de la pantalla
export const SELECT_POPUP_WIDE_CLASS = "w-max min-w-(--anchor-width) max-w-[calc(100vw-1rem)]";
