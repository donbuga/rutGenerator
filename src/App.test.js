import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';

test('renders main button and generates RUTs', async () => {
  render(<App />);
  const button = screen.getByText(/Generar RUTs/i);
  expect(button).toBeInTheDocument();

  fireEvent.click(button);

  const rutCells = await screen.findAllByText(/-/);
  expect(rutCells.length).toBeGreaterThan(0);
});
