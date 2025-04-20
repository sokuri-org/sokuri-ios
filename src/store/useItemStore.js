import { create } from "zustand";

export const useItemStore = create((set) => ({
  bag: {
    width: 0,
    height: 0,
    depth: 0,
  },
  items: [],
  result: null,
  selectedItemId: null,

  menuVisible: false,
  currentScreen: "main",
  editItemDims: { w: "", h: "", d: "" },

  setBag: (bag) => set({ bag }),
  setItems: (items) => set({ items }),
  addItem: (item) => set((state) => ({ items: [...state.items, item] })),
  updateItemPosition: (id, newPos) =>
    set((state) => ({
      items: state.items.map((item) =>
        item.id === id ? { ...item, position: newPos } : item,
      ),
    })),
  setSelectedItemId: (id) => set({ selectedItemId: id }),
  removeItemByIdWithWebView: (id, webViewRef) => {
    set((state) => ({
      items: state.items.filter((item) => item.id !== id),
    }));

    if (webViewRef?.current) {
      webViewRef.current.postMessage(
        JSON.stringify({
          action: "REMOVE_ITEM",
          data: { id },
        }),
      );
    }
  },
  updateItemSizeWithWebView: (id, newSize, webViewRef) => {
    set((state) => {
      const updatedItems = state.items.map((item) => {
        if (item.id === id) {
          return {
            ...item,
            width: newSize.width,
            height: newSize.height,
            depth: newSize.depth,
          };
        }
        return item;
      });

      if (webViewRef?.current?.postMessage) {
        webViewRef.current.postMessage(
          JSON.stringify({
            action: "UPDATE_ITEM_SIZE",
            data: {
              id,
              width: newSize.width,
              height: newSize.height,
              depth: newSize.depth,
            },
          }),
        );
      }

      return { items: updatedItems };
    });
  },
  setMenuVisible: (visible) => set({ menuVisible: visible }),
  toggleMenuVisible: () =>
    set((state) => ({ menuVisible: !state.menuVisible })),
  setCurrentScreen: (currentScreen) => set({ currentScreen }),
  setShouldAddBagToWebView: (val) => set({ shouldAddBagToWebView: val }),
  setEditItemDims: (dims) => set({ editItemDims: dims }),
  setEditItemDimsField: (key, value) =>
    set((state) => ({
      editItemDims: {
        ...state.editItemDims,
        [key]: value,
      },
    })),
}));
