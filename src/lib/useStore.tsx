import { create } from 'zustand';

interface AppState {
  triggerFunction: () => void;
  setFunction: (fn: () => void) => void;
}

const useStore = create<AppState>((set) => ({
  triggerFunction: () => {},
  setFunction: (fn) => set({ triggerFunction: fn }),
}));

export default useStore;
