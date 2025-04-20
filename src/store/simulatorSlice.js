export const createSimulatorSlice = (set) => ({
  bag: { width: 0, height: 0, depth: 0 },
  items: [],
  result: null,
  selectedItem: null,
  editItemDims: { w: "", h: "", d: "" },
  editItemSize: { w: "", h: "", d: "" },

  setBag: (bag) => set({ bag }),
  setBagSize: (bag) => set({ bag }),
  setItems: (items) => set({ items }),
  addItem: (item) => set((state) => ({ items: [...state.items, item] })),
  removeItem: (id, webViewRef) => {
    set((state) => ({
      items: state.items.filter((item) => item.id !== id),
    }));

    webViewRef?.current?.postMessage?.(
      JSON.stringify({ action: "REMOVE_ITEM", data: { id } }),
    );
  },
  setSelectedItem: (id) => set({ selectedItem: id }),
  setShouldAddBagToWebView: (val) => set({ shouldAddBagToWebView: val }),
  updateItemPosition: (id, position) => {
    set((state) => ({
      items: state.items.map((item) =>
        item.id === id ? { ...item, position } : item,
      ),
    }));
  },
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
        const bag = state.bag;
        webViewRef.current.postMessage(
          JSON.stringify({
            action: "RENDER_PACKING",
            data: { bag, items: updatedItems },
          }),
        );
      }

      return { items: updatedItems };
    });
  },
  updateItemSize: (id, newSize, webViewRef) => {
    set((state) => {
      const updated = state.items.map((item) =>
        item.id === id
          ? {
              ...item,
              width: newSize.width,
              height: newSize.height,
              depth: newSize.depth,
            }
          : item,
      );

      webViewRef?.current?.postMessage?.(
        JSON.stringify({
          action: "UPDATE_ITEM_SIZE",
          data: { id, ...newSize },
        }),
      );

      return { items: updated };
    });
  },
  setEditItemDims: (dims) => set({ editItemDims: dims }),
  setEditItemDimsField: (key, value) =>
    set((state) => ({
      editItemDims: {
        ...state.editItemDims,
        [key]: value,
      },
    })),
  setEditItemSize: (size) => set({ editItemSize: size }),
  updateEditItemField: (key, value) =>
    set((state) => ({
      editItemSize: { ...state.editItemSize, [key]: value },
    })),
});
