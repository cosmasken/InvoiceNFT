import { create } from 'zustand';
import type { User } from '../types';

interface AuthState {
  user: User | null;
  setUser: (user: User | null) => void;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  walletAddress: string | null;
  setWalletAddress: (address: string | null) => void;
  updateUserProfile: (profileData: Partial<User>) => Promise<void>;
}

export const useStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  walletAddress: null,
  setUser: (user) => set({ user, isAuthenticated: !!user }),
  setWalletAddress: (address) => set({ walletAddress: address }),
  updateUserProfile: async (profileData) => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch('http://localhost:3000/api/auth/profile', {
        method: 'PUT', // Add this endpoint to backend if needed
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(profileData),
      });
      const userData = await response.json();
      set((state) => ({
        user: state.user ? { ...state.user, ...profileData, ...userData } : null,
      }));
    } catch (err) {
      console.error('Profile update failed:', err);
    }
  },
  login: async (email: string, password: string) => {
    const response = await fetch('http://localhost:3000/api/auth/email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) throw new Error('Login failed');

    const { token, userId } = await response.json();
    localStorage.setItem('token', token);

    const profileResponse = await fetch('http://localhost:3000/api/auth/profile', {
      headers: { 'Authorization': `Bearer ${token}` },
    });
    const userData = await profileResponse.json();

    set({
      user: {
        id: userId,
        email: userData.email || email,
        walletAddress: userData.wallet_address,
        name: 'User',
        role: '', // Role set later
        avatar: '',
        walletBalance: 0,
        stakedAmount: 0,
        onboardingCompleted: !userData.wallet_address,
      },
      isAuthenticated: true,
    });
  },
  logout: () => {
    localStorage.removeItem('token');
    set({ user: null, isAuthenticated: false, walletAddress: null });
  },
}));