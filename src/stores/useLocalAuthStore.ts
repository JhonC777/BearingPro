import { create } from "zustand";
import { persist } from "zustand/middleware";

interface LocalUser {
  id: number;
  name: string;
  email: string;
  avatar?: string;
  role: string;
}

interface LocalAuthStore {
  user: LocalUser | null;
  isAuthenticated: boolean;
  login: (user: LocalUser) => void;
  logout: () => void;
}

export const useLocalAuthStore = create<LocalAuthStore>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      login: (user) => set({ user, isAuthenticated: true }),
      logout: () => set({ user: null, isAuthenticated: false }),
    }),
    { name: "bearingpro-local-auth" }
  )
);
