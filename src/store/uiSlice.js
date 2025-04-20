export const createUiSlice = (set) => ({
  currentScreen: "main",
  menuVisible: false,

  setMenuVisible: (visible) => set({ menuVisible: visible }),
  toggleMenuVisible: () =>
    set((state) => ({ menuVisible: !state.menuVisible })),
  setCurrentScreen: (screen) => set({ currentScreen: screen }),
});
