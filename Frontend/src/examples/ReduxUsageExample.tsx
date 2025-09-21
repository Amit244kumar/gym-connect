import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { RegisterUserData, LoginCredentials } from '../store/gymOwnerAuth';

// Example of how to use Redux in OwnerRegister component
export const OwnerRegisterWithRedux: React.FC = () => {
  const { register, isLoading, error } = useAuth();
  const [formData, setFormData] = useState<RegisterUserData>({
    ownerName: '',
    gymName: '',
    phone: '',
    email: '',
    password: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const result = await register(formData);
      if (result.success) {
        console.log('Registration successful:', result);
        // Redirect to dashboard or show success message
      }
    } catch (error) {
      console.error('Registration failed:', error);
    }
  };

  const handleInputChange = (field: keyof RegisterUserData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="ownerName">Owner Name</Label>
        <Input
          id="ownerName"
          value={formData.ownerName}
          onChange={(e) => handleInputChange('ownerName', e.target.value)}
          required
        />
      </div>

      <div>
        <Label htmlFor="gymName">Gym Name</Label>
        <Input
          id="gymName"
          value={formData.gymName}
          onChange={(e) => handleInputChange('gymName', e.target.value)}
          required
        />
      </div>

      <div>
        <Label htmlFor="phone">Phone</Label>
        <Input
          id="phone"
          type="tel"
          value={formData.phone}
          onChange={(e) => handleInputChange('phone', e.target.value)}
          required
        />
      </div>

      <div>
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => handleInputChange('email', e.target.value)}
          required
        />
      </div>

      <div>
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          value={formData.password}
          onChange={(e) => handleInputChange('password', e.target.value)}
          required
        />
      </div>

      {error && (
        <div className="text-red-500 text-sm">{error}</div>
      )}

      <Button 
        type="submit" 
        disabled={isLoading}
        className="w-full"
      >
        {isLoading ? 'Registering...' : 'Register'}
      </Button>
    </form>
  );
};

// Example of how to use Redux in Login component
export const LoginWithRedux: React.FC = () => {
  const { login, isLoading, error } = useAuth();
  const [credentials, setCredentials] = useState<LoginCredentials>({
    email: '',
    password: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const result = await login(credentials);
      if (result.success) {
        console.log('Login successful:', result);
        // Redirect to dashboard
      }
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={credentials.email}
          onChange={(e) => setCredentials(prev => ({ ...prev, email: e.target.value }))}
          required
        />
      </div>

      <div>
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          value={credentials.password}
          onChange={(e) => setCredentials(prev => ({ ...prev, password: e.target.value }))}
          required
        />
      </div>

      {error && (
        <div className="text-red-500 text-sm">{error}</div>
      )}

      <Button 
        type="submit" 
        disabled={isLoading}
        className="w-full"
      >
        {isLoading ? 'Logging in...' : 'Login'}
      </Button>
    </form>
  );
};

// Example of how to use Redux in Dashboard component
export const DashboardWithRedux: React.FC = () => {
  const { owner, logout, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!owner) {
    return <div>Not authenticated</div>;
  }

  return (
    <div className="space-y-4">
      <h1>Welcome, {owner.ownerName}!</h1>
      <p>Gym: {owner.gymName}</p>
      <p>Email: {owner.email}</p>
      <p>Phone: {owner.phone}</p>
      <p>Subscription: {owner.subscriptionStatus}</p>
      
      <Button onClick={logout}>Logout</Button>
    </div>
  );
};
