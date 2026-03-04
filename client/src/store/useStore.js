import { create } from 'zustand';

const useStore = create((set) => ({
  userInfo: localStorage.getItem('userInfo') 
    ? JSON.parse(localStorage.getItem('userInfo')) 
    : null,
  
  setUserInfo: (data) => {
    localStorage.setItem('userInfo', JSON.stringify(data));
    set({ userInfo: data });
  },

  logout: () => {
    localStorage.removeItem('userInfo');
    set({ userInfo: null });
  },

  // UI State
  isSidebarOpen: true,
  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
}));

export default useStore;