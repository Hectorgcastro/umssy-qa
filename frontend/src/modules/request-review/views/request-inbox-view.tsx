"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RequestPagination } from "../components/request-pagination";
import { RequestTable } from "../components/request-table";
import { REVIEW_TABS } from "../constants/request-review.constants";
import { useRequestList } from "../hooks/use-request-list";
import type { ReviewStatus } from "../types/request-review.types";

export function RequestInboxView() {
  const list = useRequestList();

  return (
    <section className="flex flex-col gap-6">
      <header className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold text-ink">Solicitudes de acceso</h1>
        <p className="text-sm text-text-secondary">Revisa las solicitudes enviadas por las personas tituladas.</p>
      </header>

      <Tabs value={list.status} onValueChange={(value) => list.changeStatus(value as ReviewStatus)}>
        <TabsList variant="line">
          {REVIEW_TABS.map((tab) => (
            <TabsTrigger key={tab.value} value={tab.value}>
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {list.error ? (
        <p role="alert" className="rounded-md border border-border bg-surface p-4 text-sm text-ink">
          {list.error}
        </p>
      ) : !list.isLoading && list.items.length === 0 ? (
        <p className="rounded-md border border-border bg-surface p-8 text-center text-sm text-text-secondary">
          No hay solicitudes en este estado.
        </p>
      ) : (
        <div className="rounded-md border border-border bg-surface p-4">
          <RequestTable items={list.items} isLoading={list.isLoading} />
          {!list.isLoading && (
            <RequestPagination
              from={list.from}
              to={list.to}
              total={list.total}
              hasPrevious={list.hasPrevious}
              hasNext={list.hasNext}
              onPrevious={list.goToPrevious}
              onNext={list.goToNext}
            />
          )}
        </div>
      )}
    </section>
  );
}
