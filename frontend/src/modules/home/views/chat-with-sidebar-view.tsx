'use client';

import { AppShell } from '@/shared/components/layout';
import { SIDEBAR_PREVIEW_NAVIGATION } from '@/shared/constants/sidebar-preview.constants';
import { ChatView } from './chat-view';

export function ChatWithSidebarView() {
  return (
    <AppShell items={SIDEBAR_PREVIEW_NAVIGATION} fullHeight>
      <ChatView />
    </AppShell>
  );
}