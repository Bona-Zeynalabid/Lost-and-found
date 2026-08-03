import { create } from 'zustand';

const useStore = create((set, get) => ({
  
  darkMode: false,
  setDarkMode: (value) => {
    if (typeof window !== 'undefined') {
      document.documentElement.classList.toggle('dark', value);
      localStorage.setItem('theme', value ? 'dark' : 'light');
    }
    set({ darkMode: value });
  },
  toggleDarkMode: () => {
    const newMode = !get().darkMode;
    get().setDarkMode(newMode);
  },
  initTheme: () => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('theme');
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const isDark = saved === 'dark' || (!saved && prefersDark);
      document.documentElement.classList.toggle('dark', isDark);
      set({ darkMode: isDark });
    }
  },

 
  user: null,
  setUser: (user) => set({ user }),
  clearUser: () => set({ user: null }),
  logout: () => {
    set({ user: null });
    if (typeof window !== 'undefined') {
      localStorage.removeItem('theme'); 
    }
  },
  fetchUser: async () => {
    try {
      const res = await fetch('http://localhost:5000/api/auth/me', {
        credentials: 'include',
      });
      if (!res.ok) {
        set({ user: null });
        return;
      }
      const data = await res.json();
      set({ user: data.user });
    } catch {
      set({ user: null });
    }
  },

 
  myItems: [],
  communityItems: [],
  setMyItems: (items) => set({ myItems: items }),
  setCommunityItems: (items) => set({ communityItems: items }),
  clearItems: () => set({ myItems: [], communityItems: [] }),
}));

export default useStore;