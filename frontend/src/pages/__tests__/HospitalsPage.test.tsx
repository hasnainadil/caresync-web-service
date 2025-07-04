import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import HospitalsPage from '../HospitalsPage';

jest.mock('@/lib/api', () => ({
  apiClient: {
    getAllHospitals: jest.fn().mockResolvedValue([
      { id: 1, name: 'Test Hospital', phoneNumber: '123', types: [], icus: 2, costRange: 'LOW', latitude: 0, longitude: 0 },
    ]),
  },
}));

test('renders hospitals list', async () => {
  render(
    <MemoryRouter>
      <HospitalsPage />
    </MemoryRouter>
  );
  expect(await screen.findByText(/Test Hospital/i)).toBeInTheDocument();
}); 