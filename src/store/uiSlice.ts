import { StateCreator } from 'zustand';
import { Screen } from '@/types';
import type { SimulatorSlice } from './simulatorSlice';

export interface UiSlice {
  currentScreen: Screen;
  menuVisible: boolean;
  setMenuVisible: (visible: boolean) => void;
  toggleMenuVisible: () => void;
  setCurrentScreen: (screen: Screen) => void;
}

export const createUiSlice: StateCreator<
  UiSlice & SimulatorSlice,
  [],
  [],
  UiSlice
> = (set) => ({
  currentScreen: 'main',
  menuVisible: false,

  setMenuVisible: (visible: boolean) => set({ menuVisible: visible }),
  toggleMenuVisible: () =>
    set((state) => ({ menuVisible: !state.menuVisible })),
  setCurrentScreen: (screen: Screen) => set({ currentScreen: screen }),
});
