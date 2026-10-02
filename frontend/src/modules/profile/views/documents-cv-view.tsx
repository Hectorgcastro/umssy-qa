import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { DocumentsSteps } from "../components/documents-steps";
import { ProfilePageLayout } from "../components/profile-page-layout";
import { SectionCard } from "../components/section-card";
import { PRIMARY_BUTTON_CLASS, SECONDARY_BUTTON_CLASS } from "../config/form-styles.config";

const UNAVAILABLE_TITLE = "Disponible próximamente";

export function DocumentsCvView() {
  return (
    <ProfilePageLayout
      activeTab="documents"
      title="Documentos"
      description="Sube o actualiza tu CV y mantén tus documentos en orden"
    >
      <DocumentsSteps activeStep="cv" />
      <div className="grid grid-cols-2 items-start gap-6">
        <SectionCard title="Subir currículum">
          {/* Upload is implemented in issue #130. */}
          <div className="flex flex-col items-center gap-2 rounded-xl border border-dashed border-border-strong bg-surface-soft px-6 py-10 text-center">
            <p className="text-[15px] font-semibold text-ink">Selecciona tu CV en formato PDF</p>
            <Button
              type="button"
              variant="outline"
              className={cn(SECONDARY_BUTTON_CLASS, "mt-3")}
              disabled
              title={UNAVAILABLE_TITLE}
            >
              Seleccionar PDF
            </Button>
          </div>
          <div className="mt-6 flex justify-end">
            <Button type="button" className={PRIMARY_BUTTON_CLASS} disabled title={UNAVAILABLE_TITLE}>
              Confirmar carga
            </Button>
          </div>
        </SectionCard>
        <SectionCard title="Archivo guardado">
          {/* Saved file details arrive in issue #132. */}
          <p className="text-[14px] text-text-secondary">
            Al confirmar la carga, el archivo se mostrará aquí.
          </p>
        </SectionCard>
      </div>
      <div className="mt-8 flex justify-end">
        <Link
          href="/profile/documents/certifications"
          className={cn(buttonVariants({ variant: "outline" }), SECONDARY_BUTTON_CLASS)}
        >
          Ver certificaciones
        </Link>
      </div>
    </ProfilePageLayout>
  );
}
