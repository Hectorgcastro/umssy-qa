"use client";

import { useEffect, useState } from "react";
import { getMentorParticipation } from "@/shared/services/mentor-participation.service";
import { ParticipationEmptyState } from "../components/participation/participation-empty-state";
import { ParticipationLoading } from "../components/participation/participation-loading";
import { ParticipationOverview } from "../components/participation/participation-overview";

export function ParticipationView() {
  const [state, setState] = useState<
    ReturnType<typeof getMentorParticipation> | undefined
  >(undefined);

  useEffect(() => {
    let isMounted = true;

    queueMicrotask(() => {
      if (isMounted) {
        setState(getMentorParticipation());
      }
    });

    return () => {
      isMounted = false;
    };
  }, []);

  if (state === undefined) {
    return <ParticipationLoading />;
  }

  if (!state) {
    return <ParticipationEmptyState />;
  }

  return (
    <ParticipationOverview
      areas={state.areas}
      orientations={state.orientations}
    />
  );
}

