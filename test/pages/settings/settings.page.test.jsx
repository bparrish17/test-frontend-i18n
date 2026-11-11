import React from 'react';
import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import SettingsPage from '@pages/settings/settings.page';
import { useUserStore } from '@store/app.store';
import { useIsUserType } from '@util/hooks';
import { useStatsigClient } from '@statsig/react-bindings/src';

// Mock the hooks
vi.mock('@store/app.store', () => ({
  useUserStore: vi.fn()
}));

vi.mock('@util/hooks', () => ({
  useIsUserType: vi.fn(),
  useSetDocumentTitle: vi.fn()
}));

vi.mock('@statsig/react-bindings/src', () => ({
  useStatsigClient: vi.fn()
}));

vi.mock('@assets/icons');

vi.mock('react-router-dom', () => ({
  Link: (props) => <a>{props.children}</a>
}));

describe('SettingsPage', () => {
  const defaultSubRoutes = ['Manage Templates', 'Manage Uploads'];

  const checkSubRoutes = (subRoutes = []) =>
    [...defaultSubRoutes, ...subRoutes].forEach((subRoute) =>
      expect(screen.getByText(subRoute)).toBeInTheDocument()
    );

  const checkNotSubRoutes = (notSubRoutes) =>
    notSubRoutes.forEach((notSubRoute) =>
      expect(screen.queryByText(notSubRoute)).not.toBeInTheDocument()
    );

  beforeEach(() => {
    useUserStore.mockReturnValue({ slack_config: { access_token: '12345' } });
    useStatsigClient.mockReturnValue({ checkGate: (gateName) => gateName !== 'user-profile-page' });
  });

  it('shows new account settings if statsig user-profile-page is on', () => {
    useStatsigClient.mockReturnValue({ checkGate: () => true });
    useIsUserType.mockImplementation((type) => type === 'Executive');
    render(<SettingsPage />);
    expect(screen.getByText('Your Profile Settings')).toBeInTheDocument();
  });

  it('shows correct subRoutes for Associate users', () => {
    useIsUserType.mockImplementation((type) => type === 'Associate');
    render(<SettingsPage />);
    checkNotSubRoutes(['User Prompt', 'Data Sources', 'Categories', 'Analytics']);
    checkSubRoutes();
  });

  it('shows correct subRoutes for Admin users', () => {
    useIsUserType.mockImplementation((type) => type === 'Admin');
    render(<SettingsPage />);
    checkSubRoutes([
      'User Prompt',
      'Data Sources',
      'Categories',
      'Calendar',
      'Slack & Teams Digests',
      'Email Subscriptions',
      'Earnings Calls',
      'Recording',
      'Manage Users'
    ]);
  });

  it('shows correct subRoutes for Executive users', () => {
    useIsUserType.mockImplementation((type) => type === 'Executive');
    render(<SettingsPage />);
    checkSubRoutes([
      'User Prompt',
      'Data Sources',
      'Categories',
      'Analytics',
      'Calendar',
      'Slack & Teams Digests',
      'Email Subscriptions',
      'Earnings Calls',
      'Manage Users'
    ]);
  });

  it('shows correct subRoutes based on feature gates', () => {
    useIsUserType.mockImplementation((type) => type === 'Executive');
    useStatsigClient.mockReturnValue({ checkGate: () => false });
    render(<SettingsPage />);
    checkNotSubRoutes(['Earnings Calls', 'Zoom Admin']);
  });

  it('does not show Slack & Teams if not configured in tenant', () => {
    useUserStore.mockReturnValue({ tenant: { slack_config: null, teams_config: null } });
    useIsUserType.mockImplementation((type) => type === 'Executive');
    render(<SettingsPage />);
    checkNotSubRoutes(['Slack & Teams Digests']);
  });
});
