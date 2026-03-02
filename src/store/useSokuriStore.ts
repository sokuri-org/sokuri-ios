import { create } from 'zustand';
import { createSimulatorSlice, SimulatorSlice } from './simulatorSlice';
import { createUiSlice, UiSlice } from './uiSlice';

export type SokuriStore = SimulatorSlice & UiSlice;

export const useSokuriStore = create<SokuriStore>((...a) => ({
  ...createSimulatorSlice(...a),
  ...createUiSlice(...a),
}));
