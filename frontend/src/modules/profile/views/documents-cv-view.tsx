import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ProfilePageLayout } from "../components/profile-page-layout";
import { SavedCvCard } from "../components/saved-cv-card";
import { SectionCard } from "../components/section-card";
import { PRIMARY_BUTTON_CLASS, SECONDARY_BUTTON_CLASS } from "../config/form-styles.config";
import { UNAVAILABLE_ACTION_TITLE } from "../config/unavailable-action.config";

export function DocumentsCvView() {
  return (
    <ProfilePageLayout
      activeTab="documents"
      title="Currículum PDF"
      description="Sube tu CV para tenerlo disponible en el perfil y mantenerlo actualizado"
    >
      <div className="grid grid-cols-2 items-start gap-6">
        <SectionCard title="Subir currículum">
          <div className="flex flex-col items-center gap-2 rounded-xl border border-dashed border-border-strong bg-surface-soft px-6 py-10 text-center">
            <p className="text-[15px] font-semibold text-ink">Selecciona tu CV en formato PDF</p>
            <Button
              type="button"
              variant="outline"
              className={cn(SECONDARY_BUTTON_CLASS, "mt-3")}
              disabled
              title={UNAVAILABLE_ACTION_TITLE}
            >
              Seleccionar PDF
            </Button>
          </div>
          <div className="mt-6 flex justify-end">
            <Button
              type="button"
              className={PRIMARY_BUTTON_CLASS}
              disabled
              title={UNAVAILABLE_ACTION_TITLE}
            >
              Confirmar carga
            </Button>
          </div>
        </SectionCard>
        <SavedCvCard savedCv={null} />
      </div>
    </ProfilePageLayout>
  );
}
