import { AccessRequestSidebar } from "../components/access-request-sidebar";
import { PersonalDataForm } from "../components/personal-data-form";

export function RequestAccessView() {
  return (
    <main className="min-h-screen bg-[#F6F7F9]">
      <div className="flex min-h-screen flex-col md:flex-row">
        <AccessRequestSidebar />

        <section className="flex flex-1 justify-center px-6 py-10 md:px-12 md:py-14">
          <PersonalDataForm />
        </section>
      </div>
    </main>
  );
}