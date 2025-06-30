import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    setTimeout(() => {
      const success = login(email, password);
      if (!success) {
        setError('Invalid credentials. Only admin@ngo.org is authorized.');
      }
      setIsLoading(false);
    }, 500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow p-6">
        <div className="text-center mb-6">
          <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center mx-auto mb-4">
            <span className="text-white text-xl font-bold">🔒</span>
          </div>
          <h2 className="text-2xl font-semibold">Admin Login</h2>
          <p className="text-sm text-gray-500">Sign in to access the FoodBridge admin dashboard</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              id="email"
              type="email"
              placeholder="admin@ngo.org"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
            />
          </div>
          {error && (
            <div className="flex items-center gap-2 text-red-600 text-sm">
              <span className="text-lg">⚠️</span>
              {error}
            </div>
          )}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded transition"
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
        <div className="mt-4 text-xs text-gray-500 text-center">
          Demo credentials: admin@ngo.org / admin123
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
