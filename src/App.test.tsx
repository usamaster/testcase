import { describe, expect, it } from 'vitest';
import { act, render, screen } from '@testing-library/react';
import { addDays, format } from 'date-fns';
import { nl } from 'date-fns/locale';
import App from './App';

describe('App', () => {
  it('Renders all buttons and dates', () => {
    render(<App />);

    const allButtons = screen.getAllByRole('button');
    expect(allButtons).toHaveLength(16);

    expect(allButtons[0].textContent).toBe('<');
    expect(allButtons[15].textContent).toBe('>');

    expect(allButtons[1].textContent).toBe(
      format(new Date(), 'EEE', { locale: nl }) +
        format(new Date(), 'dd MMM', { locale: nl })
    );
  });

  it('Selects an available date, but not an unavailable date', () => {
    render(<App />);
    const allButtons = screen.getAllByRole('button');

    act(() => {
      allButtons[2].click();
    });

    const selectedDate = screen.getByRole('textbox');
    if (allButtons[2].classList.contains('disabled')) {
      expect(selectedDate.textContent).toBe(
        format(new Date(), 'EEEE', { locale: nl }) +
          format(new Date(), 'dd MMMM', { locale: nl })
      );
    } else {
      expect(selectedDate.textContent).toBe(
        format(addDays(new Date(), 1), 'EEEE', { locale: nl }) +
          format(addDays(new Date(), 1), 'dd MMMM', { locale: nl })
      );
    }
  });

  it('has 4 disabled dates', () => {
    render(<App />);
    const allButtons = screen.getAllByRole('button');

    expect(
      allButtons.filter((button) => button.classList.contains('disabled'))
    ).toHaveLength(4);
  });

  it('scrolls to the right when button > is pressed initially', () => {
    render(<App />);
    const scrollRightButton = screen.getByRole('button', { name: '>' });

    act(() => {
      scrollRightButton.click();
    });

    const dateRow = screen.getByRole('rowgroup');
    const { scrollLeft } = dateRow;
    expect(scrollLeft > 0).toBe(true);
  });
});
