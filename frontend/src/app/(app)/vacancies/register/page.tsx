import { RecruitersBaseView } from "@/modules/recruiters";
import { RegisterVacancyView } from "@/modules/vacancies/views/register-vacancy-view";

export default function RegisterPage() {
  return (
    <RecruitersBaseView>
      <RegisterVacancyView />
    </RecruitersBaseView>
  );
}