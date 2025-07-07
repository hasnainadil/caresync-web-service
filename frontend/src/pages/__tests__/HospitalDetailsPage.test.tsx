import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import HospitalDetailsPage from '../HospitalDetailsPage';

// Mock useParams
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({ id: '1' }),
  useNavigate: () => jest.fn(),
  useLocation: () => ({ pathname: '/hospitals/1' }),
}));

jest.mock('@/lib/api', () => ({
  apiClient: {
    getHospitalById: jest.fn().mockResolvedValue({
      id: 1,
      name: 'Mocked Hospital',
      phoneNumber: '123',
      types: [],
      icus: 2,
      costRange: 'LOW',
      latitude: 0,
      longitude: 0,
      locationResponse: { city: 'Dhaka', thana: 'Gulshan', address: '123', po: 'PO', postalCode: 1000, zoneId: 1, locationType: 'HOSPITAL', id: 1 }
    }),
  },
}));

jest.mock('@/hooks/use-toast', () => ({
  toast: jest.fn(),
}));

jest.mock('@/contexts/AuthContext', () => ({
  useAuth: () => ({
    user: null,
    login: jest.fn(),
    logout: jest.fn(),
    register: jest.fn(),
  }),
}));

// Mock HospitalMap to avoid map/ResizeObserver errors in test environment
jest.mock('@/components/hospitals/HospitalMap', () => () => <div>Mocked Map</div>);

test('renders mocked hospital details', async () => {
  render(
    <MemoryRouter>
      <HospitalDetailsPage />
    </MemoryRouter>
  );
  expect(await screen.findByText(/Mocked Hospital/i)).toBeInTheDocument();
  // Use findAllByText to robustly check for phone number presence in any element
  const phoneElements = await screen.findAllByText((content, element) => element?.textContent?.includes('123'));
  expect(phoneElements.length).toBeGreaterThan(0);
}); 