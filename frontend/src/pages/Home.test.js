import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import Home from './Home';
import api from '../api';

jest.mock(
  'react-router-dom',
  () => ({
    useNavigate: () => jest.fn()
  }),
  { virtual: true }
);

jest.mock('../api', () => ({
  __esModule: true,
  default: {
    get: jest.fn(),
    post: jest.fn()
  }
}));

jest.mock('../components/GeoMap', () => function GeoMapMock() { return <div data-testid="geo-map" />; });
jest.mock('../components/MapErrorBoundary', () => function MapErrorBoundaryMock({ children }) { return <>{children}</>; });

const initialGeo = {
  query: '1.1.1.1',
  city: 'Sydney',
  regionName: 'NSW',
  country: 'Australia',
  lat: -33.86,
  lon: 151.2
};

describe('Home page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  function setupHome(setIsLoggedIn = jest.fn()) {
    render(<Home setIsLoggedIn={setIsLoggedIn} />);
    return setIsLoggedIn;
  }

  test('loads and displays current geolocation details', async () => {
    api.get.mockResolvedValueOnce({ data: initialGeo });
    setupHome();

    expect(await screen.findByText('Location Details')).toBeInTheDocument();
    expect(screen.getByText('1.1.1.1')).toBeInTheDocument();
    expect(screen.getByText('Sydney')).toBeInTheDocument();
    expect(screen.getByTestId('geo-map')).toBeInTheDocument();
  });

  test('shows validation error for invalid IP format', async () => {
    api.get.mockResolvedValueOnce({ data: initialGeo });
    setupHome();

    await screen.findByText('Location Details');
    fireEvent.change(screen.getByPlaceholderText(/enter ip address/i), {
      target: { value: 'not-an-ip' }
    });
    fireEvent.click(screen.getByRole('button', { name: /search/i }));

    expect(await screen.findByText('Invalid IP address format.')).toBeInTheDocument();
  });

  test('searches a valid IP and adds it to history', async () => {
    api.get.mockImplementation((url) => {
      if (url === '/api/geo') {
        return Promise.resolve({ data: initialGeo });
      }
      if (url === '/api/geo/8.8.8.8') {
        return Promise.resolve({
          data: {
            status: 'success',
            query: '8.8.8.8',
            city: 'Mountain View',
            regionName: 'California',
            country: 'United States',
            lat: 37.386,
            lon: -122.0838
          }
        });
      }
      return Promise.reject(new Error(`Unexpected URL: ${url}`));
    });

    setupHome();
    await screen.findByText('Location Details');

    fireEvent.change(screen.getByPlaceholderText(/enter ip address/i), {
      target: { value: '8.8.8.8' }
    });
    fireEvent.click(screen.getByRole('button', { name: /search/i }));

    await waitFor(() => expect(api.get).toHaveBeenCalledWith('/api/geo/8.8.8.8'));
    expect(await screen.findByText('Search History')).toBeInTheDocument();
    expect(screen.getAllByText('8.8.8.8').length).toBeGreaterThan(0);
  });

  test('logs out and clears auth token', async () => {
    api.get.mockResolvedValueOnce({ data: initialGeo });
    api.post.mockResolvedValueOnce({});
    localStorage.setItem('auth_token', 'existing-token');

    const setIsLoggedInMock = setupHome();
    await screen.findByText('Location Details');

    fireEvent.click(screen.getByRole('button', { name: /logout/i }));

    await waitFor(() => expect(api.post).toHaveBeenCalledWith('/api/logout'));
    expect(localStorage.getItem('auth_token')).toBeNull();
    expect(setIsLoggedInMock).toHaveBeenCalledWith(false);
  });
});