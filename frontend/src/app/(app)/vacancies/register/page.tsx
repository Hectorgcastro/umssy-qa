import { RecruitersBaseView } from "@/modules/recruiters/views/base-view";
import { RegisterVacancyView } from "@/modules/vacancies/views/register-vacancy-view";

export default function RegisterPage() {
  return (
    <RecruitersBaseView>
      <RegisterVacancyView />
    </RecruitersBaseView>
  );
}
