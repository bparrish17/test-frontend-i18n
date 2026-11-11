import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { within, screen, render, renderHook } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { QueryParamProvider } from 'use-query-params';
import { ReactRouter6Adapter } from 'use-query-params/adapters/react-router-6';

export function fakeForaAPIError(message) {
  return { response: { data: { errors: [message] } } };
}

export function withinElementByTestId(testId) {
  return () => within(screen.getByTestId(testId));
}

export const Providers = ({ children }) => {
  const queryClient = new QueryClient();

  return (
    <BrowserRouter>
      <QueryParamProvider adapter={ReactRouter6Adapter}>
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
      </QueryParamProvider>
    </BrowserRouter>
  );
};

/** @returns {import('@testing-library/react').RenderResult} */
export const renderWithProviders = (ui) => {
  return render(ui, {
    wrapper: Providers
  });
};

/** @returns {import('@testing-library/react').RenderHookResult} */
export const renderHookWithProviders = (hook) => {
  return renderHook(hook, { wrapper: Providers });
};
