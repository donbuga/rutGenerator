import { render, screen } from '@testing-library/react';
import App from './App';

test('renders generar ruts button', () => {
  render(<App />);
  const buttonElement = screen.getByText(/generar ruts/i);
  expect(buttonElement).toBeInTheDocument();
});
