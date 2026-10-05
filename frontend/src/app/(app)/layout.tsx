"use client";
import { AppShell } from "@/shared/components/layout";
import { SIDEBAR_NAVIGATION } from "@/shared/config/navigation.config";
import { TEMPORARY_SIDEBAR_USER} from "@/shared/config/sidebar-user.config";
import { ReactNode } from "react";

export default function AppLayout({ children }: { children: ReactNode }) {
    return (
        <AppShell items={SIDEBAR_NAVIGATION} user={TEMPORARY_SIDEBAR_USER}>
        {children}
        </AppShell>
    );
}