"use client";

import { useState } from "react";
import { Download, RotateCw, ZoomIn, ZoomOut } from "lucide-react";
import { Button } from "@/components/ui/button";

const MIN_SCALE = 0.5;
const MAX_SCALE = 3;
const SCALE_STEP = 0.25;

interface DocumentViewerProps {
  url: string;
  mimeType: string;
  fileName: string;
}

export function DocumentViewer({ url, mimeType, fileName }: DocumentViewerProps) {
  const [scale, setScale] = useState(1);
  const [rotation, setRotation] = useState(0);
  const isPdf = mimeType === "application/pdf";

  return (
    <div className="flex flex-col overflow-hidden rounded-md bg-ink">
      <div className="flex items-center gap-2 border-b border-ink-soft p-2" role="toolbar" aria-label="Herramientas del documento">
        {!isPdf && (
          <>
            <Button variant="outline" size="icon-sm" aria-label="Acercar" onClick={() => setScale((s) => Math.min(MAX_SCALE, s + SCALE_STEP))} disabled={scale >= MAX_SCALE}>
              <ZoomIn aria-hidden="true" />
            </Button>
            <Button variant="outline" size="icon-sm" aria-label="Alejar" onClick={() => setScale((s) => Math.max(MIN_SCALE, s - SCALE_STEP))} disabled={scale <= MIN_SCALE}>
              <ZoomOut aria-hidden="true" />
            </Button>
            <Button variant="outline" size="icon-sm" aria-label="Rotar" onClick={() => setRotation((r) => (r + 90) % 360)}>
              <RotateCw aria-hidden="true" />
            </Button>
            <span className="text-xs text-surface" aria-live="polite">
              {Math.round(scale * 100)} %
            </span>
          </>
        )}
        <Button variant="outline" size="sm" className="ml-auto" render={<a href={url} download={fileName} />}>
          <Download aria-hidden="true" />
          Descargar
        </Button>
      </div>
      <div className="flex h-[32rem] items-center justify-center overflow-auto p-2">
        {isPdf ? (
          <iframe src={url} title="Documento de respaldo" className="h-full w-full bg-surface" />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={url}
            alt="Documento de respaldo"
            className="max-h-full max-w-full origin-center transition-transform"
            style={{ transform: `scale(${scale}) rotate(${rotation}deg)` }}
          />
        )}
      </div>
    </div>
  );
}
