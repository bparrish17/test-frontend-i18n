import { create } from 'zustand';

const USE_DEBUG = true;
const usePulseStore = create((set) => ({
  isPaused: USE_DEBUG,
  setIsPaused: (value) => {
    return set({ isPaused: value });
  }
}));

export { usePulseStore };
