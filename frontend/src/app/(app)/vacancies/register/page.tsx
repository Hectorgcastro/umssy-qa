import { RecruitersBaseView } from "@/modules/recruiters";
import { RegisterVacancyView } from "@/modules/vacancies";

export default function RegisterPage() {
  return (
    <RecruitersBaseView>
      <RegisterVacancyView />
    </RecruitersBaseView>
  );
}
