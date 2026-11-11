import { render, screen, waitFor } from '@testing-library/react';

import ReskinCardBodyBulletPoints from '@components/general/card/reskin-card-structure/reskin-card-body-bullet-points.component';

const mockCard = {
  sections: [
    {
      title: 'Section 1',
      content: '* Bullet 1\n* Bullet 2\n'
    },
    {
      title: 'Section 2',
      content: 'Content for section 2'
    }
  ]
};

const renderComponent = (props) => {
  return render(<ReskinCardBodyBulletPoints {...props} />);
};

describe('ReskinCardBodyBulletPoints', () => {
  it('should render correctly', async () => {
    renderComponent({ card: mockCard });
    await waitFor(() => {
      mockCard.sections.forEach((_, index) => {
        expect(screen.getByTestId(`bullet-points-section-${index}`)).toBeInTheDocument();
      });
    });
  });

  it('should render text without bullet points if showBulletPoints is false', async () => {
    renderComponent({ card: mockCard, showBulletPoints: false });
    await waitFor(() => {
      mockCard.sections.forEach((_, index) => {
        expect(screen.getByTestId(`bullet-points-container-${index}`).lastChild.tagName).toBe('P');
      });
    });
  });

  it('should render bullet points if showBulletPoints is true', async () => {
    renderComponent({ card: mockCard, showBulletPoints: true });
    await waitFor(() => {
      mockCard.sections.forEach((_, index) => {
        expect(screen.getByTestId(`bullet-points-container-${index}`).lastChild.tagName).toBe('UL');
      });
    });
  });

  it('should process and clean text, removing newline characters, asterisks, etc', async () => {
    renderComponent({ card: mockCard, showBulletPoints: true });
    await waitFor(() => {
      const ul = screen.getByTestId(`bullet-points-container-0`).lastChild;
      expect(ul.firstChild).toHaveTextContent('Bullet 1');
    });
  });
});
