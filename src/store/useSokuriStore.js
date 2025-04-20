import { create } from "zustand";
import { createSimulatorSlice } from "./simulatorSlice";
import { createUiSlice } from "./uiSlice";

export const useSokuriStore = create((...a) => ({
  ...createSimulatorSlice(...a),
  ...createUiSlice(...a),
}));
