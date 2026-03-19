import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import Login from './Login';
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
    post: jest.fn()
  }
}));

describe('Login page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  function renderLogin(setIsLoggedIn = jest.fn()) {
    render(<Login setIsLoggedIn={setIsLoggedIn} />);
    return setIsLoggedIn;
  }

  test('renders login form', () => {
    renderLogin();

    expect(screen.getByText('Welcome Back')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter your email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter your password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
  });

  test('submits credentials and stores auth token on success', async () => {
    api.post.mockResolvedValue({ data: { token: 'test-token' } });
    const setIsLoggedIn = renderLogin();

    fireEvent.change(screen.getByPlaceholderText('Enter your email'), {
      target: { value: 'test@example.com' }
    });
    fireEvent.change(screen.getByPlaceholderText('Enter your password'), {
      target: { value: 'password123' }
    });
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith('/api/login', {
        email: 'test@example.com',
        password: 'password123'
      });
    });

    expect(localStorage.getItem('auth_token')).toBe('test-token');
    expect(setIsLoggedIn).toHaveBeenCalledWith(true);
  });

  test('shows an error message for invalid credentials', async () => {
    api.post.mockRejectedValue(new Error('Unauthorized'));
    renderLogin();

    fireEvent.change(screen.getByPlaceholderText('Enter your email'), {
      target: { value: 'bad@example.com' }
    });
    fireEvent.change(screen.getByPlaceholderText('Enter your password'), {
      target: { value: 'badpassword' }
    });
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

    expect(await screen.findByText('Invalid credentials, please try again.')).toBeInTheDocument();
  });
});