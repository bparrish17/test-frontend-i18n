import { MemoryRouter } from 'react-router-dom';
import { vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';

import ConfigureOktaPage from '@pages/settings/configure-okta.page';

describe('ConfigureOktaPage', () => {
  test('renders the form with all fields and submit button', () => {
    render(
      <MemoryRouter>
        <ConfigureOktaPage />
      </MemoryRouter>
    );

    // Check if input fields and button are rendered
    expect(screen.getByLabelText(/Client ID/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Okta URL/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument();
  });

  test('validates required fields', async () => {
    render(
      <MemoryRouter>
        <ConfigureOktaPage />
      </MemoryRouter>
    );

    const submitButton = screen.getByRole('button', { name: /submit/i });

    // Submit the form without entering data
    fireEvent.click(submitButton);

    // Check for validation error messages
    expect(await screen.findByText(/Client ID is required/i)).toBeInTheDocument();
    expect(await screen.findByText(/Okta URL is required/i)).toBeInTheDocument();
  });

  test('validates Okta URL format', async () => {
    render(
      <MemoryRouter>
        <ConfigureOktaPage />
      </MemoryRouter>
    );

    const oktaUrlInput = screen.getByLabelText(/Okta URL/i);
    const submitButton = screen.getByRole('button', { name: /submit/i });

    // Enter invalid URL
    fireEvent.change(oktaUrlInput, { target: { value: 'invalid-url' } });
    fireEvent.click(submitButton);

    // Check for validation error
    expect(await screen.findByText(/Okta URL must start with https:\/\//i)).toBeInTheDocument();
  });

  test('submits form with valid data', async () => {
    render(
      <MemoryRouter>
        <ConfigureOktaPage />
      </MemoryRouter>
    );

    const clientIdInput = screen.getByLabelText(/Client ID/i);
    const oktaUrlInput = screen.getByLabelText(/Okta URL/i);
    const submitButton = screen.getByRole('button', { name: /submit/i });

    // Enter valid data
    fireEvent.change(clientIdInput, { target: { value: 'test-client-id' } });
    fireEvent.change(oktaUrlInput, { target: { value: 'https://your-okta-domain.com' } });

    // Spy on console.log to verify form submission
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith('TODO: ', {
        clientId: 'test-client-id',
        oktaUrl: 'https://your-okta-domain.com'
      });
    });

    consoleSpy.mockRestore();
  });
});
