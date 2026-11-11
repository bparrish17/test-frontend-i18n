import { MemoryRouter, useNavigate } from 'react-router-dom';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ChakraProvider } from '@chakra-ui/react';
import { vi } from 'vitest';

import CustomSummaryPill from '@components/custom-summary/custom-summary-pill.component';
import { useGenerateCard } from '@services/query-services/cards.query-service';
import { useUserStore } from '@store/app.store';

vi.mock('@services/query-services/cards.query-service', () => ({
  useGenerateCard: vi.fn(() => ({
    mutate: vi.fn() // Mock the mutate function
  }))
}));

vi.mock('@store/app.store', () => ({
  useUserStore: vi.fn()
}));

vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    useNavigate: vi.fn()
  };
});

describe('CustomSummaryPill', () => {
  it('a click triggers applyCustomSummary', async () => {
    const mockMutate = vi.fn(); // Mock mutate function
    useGenerateCard.mockReturnValue({ mutateAsync: mockMutate }); // Mock the mutate method from useGenerateCard

    const mockSetGeneratingSummary = vi.fn();
    const mockNavigate = vi.fn();
    const mockOnClose = vi.fn();

    useUserStore.mockReturnValue(mockSetGeneratingSummary);
    useNavigate.mockReturnValue(mockNavigate);

    render(
      <MemoryRouter>
        <ChakraProvider>
          <CustomSummaryPill
            lens={{ id: 1, title: 'Lens 1' }}
            meeting={{ id: 1, bot_attendee: true }}
            disclosure={{ onClose: mockOnClose }}
          />
        </ChakraProvider>
      </MemoryRouter>
    );
    const lensTab = screen.queryByText('Lens 1');
    fireEvent.click(lensTab);

    await waitFor(() => expect(mockMutate).toHaveBeenCalledTimes(1)); // Make sure mutate is called once

    expect(mockSetGeneratingSummary).toHaveBeenCalledWith({
      meetingId: 1,
      lensId: 1,
      initiativeTitle: 'Lens 1', // title from the mock
      generating: true
    });

    expect(mockNavigate).toHaveBeenCalledWith(location.pathname, {
      state: { lensId: 1 }
    });
    expect(mockOnClose).toHaveBeenCalled();
  });
});
