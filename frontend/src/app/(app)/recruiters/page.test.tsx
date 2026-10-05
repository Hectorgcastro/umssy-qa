import { render } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import RecruitersPage from './page';

vi.mock('@/modules/recruiters/views/recruiters-base-view', () => ({
  RecruitersBaseView: ({ children }: any) => <div data-testid="base-view">{children}</div>
}));

describe('RecruitersPage', () => {
  it('renderiza la página principal de reclutadores', () => {
    const { container } = render(<RecruitersPage />);
    expect(container).toBeTruthy();
  });
});
