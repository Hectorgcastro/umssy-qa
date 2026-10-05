import { AccessRequestProvider } from "../contexts/access-request-context";
import { PersonalDataForm } from "../components/personal-data-form";
import { RequestStepsSidebar } from "../components/request-steps-sidebar";

export function RequestAccessView() {
  return (
    <main className="min-h-screen bg-surface-soft">
      <div className="flex min-h-screen flex-col lg:flex-row">
        <RequestStepsSidebar currentStep={1} />
        <section className="flex flex-1 flex-col justify-center px-6 py-10 lg:px-16">
          <div className="mx-auto flex w-full max-w-190 justify-center 2xl:max-w-5xl">
            <AccessRequestProvider>
              <PersonalDataForm />
            </AccessRequestProvider>
          </div>
        </section>
      </div>
    </main>
  );
}
