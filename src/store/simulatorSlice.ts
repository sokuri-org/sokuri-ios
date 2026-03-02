import { RefObject } from 'react';
import { StateCreator } from 'zustand';
import { WebView } from 'react-native-webview';
import { Item, Bag, EditDims, Position } from '@/types';
import type { UiSlice } from './uiSlice';

interface NewSize {
  width: number;
  height: number;
  depth: number;
}

export interface SimulatorSlice {
  bag: Bag;
  items: Item[];
  result: unknown;
  selectedItem: Item | null;
  editItemDims: EditDims;
  editItemSize: EditDims;
  shouldAddBagToWebView: boolean;

  setBag: (bag: Bag) => void;
  setBagSize: (bag: Bag) => void;
  setItems: (items: Item[]) => void;
  addItem: (item: Item) => void;
  removeItem: (id: string, webViewRef: RefObject<WebView | null> | null) => void;
  setSelectedItem: (item: Item | null) => void;
  setShouldAddBagToWebView: (val: boolean) => void;
  updateItemPosition: (id: string, position: Position) => void;
  removeItemByIdWithWebView: (
    id: string,
    webViewRef: RefObject<WebView | null> | null,
  ) => void;
  updateItemSizeWithWebView: (
    id: string,
    newSize: NewSize,
    webViewRef: RefObject<WebView | null> | null,
  ) => void;
  updateItemSize: (
    id: string,
    newSize: NewSize,
    webViewRef: RefObject<WebView | null> | null,
  ) => void;
  setEditItemDims: (dims: EditDims) => void;
  setEditItemDimsField: (key: keyof EditDims, value: string) => void;
  setEditItemSize: (size: EditDims) => void;
  updateEditItemField: (key: keyof EditDims, value: string) => void;
}

const calculateInitialItemPosition = (width: number, depth: number) => {
  const pos = {
    x: -width / 2,
    y: 0,
    z: -depth / 2,
  };
  console.log(
    `[useSokuriStore] 아이템 초기 위치 계산 (너비:${width}, 깊이:${depth}):`,
    pos,
  );
  return pos;
};

export const createSimulatorSlice: StateCreator<
  SimulatorSlice & UiSlice,
  [],
  [],
  SimulatorSlice
> = (set) => ({
  bag: { width: 0, height: 0, depth: 0 },
  items: [],
  result: null,
  selectedItem: null,
  editItemDims: { w: '', h: '', d: '' },
  editItemSize: { w: '', h: '', d: '' },
  shouldAddBagToWebView: false,

  setBag: (bag: Bag) => set({ bag }),
  setBagSize: (bag: Bag) => set({ bag }),
  setItems: (items: Item[]) => set({ items }),
  addItem: (item: Item) =>
    set((state) => ({ items: [...state.items, item] })),
  removeItem: (id: string, webViewRef: RefObject<WebView | null> | null) => {
    set((state) => ({
      items: state.items.filter((item) => item.id !== id),
    }));

    webViewRef?.current?.postMessage?.(
      JSON.stringify({ action: 'REMOVE_ITEM', data: { id } }),
    );
  },
  setSelectedItem: (item: Item | null) => set({ selectedItem: item }),
  setShouldAddBagToWebView: (val: boolean) =>
    set({ shouldAddBagToWebView: val }),
  updateItemPosition: (id: string, position: Position) => {
    set((state) => ({
      items: state.items.map((item) =>
        item.id === id ? { ...item, position } : item,
      ),
    }));
  },
  removeItemByIdWithWebView: (
    id: string,
    webViewRef: RefObject<WebView | null> | null,
  ) => {
    set((state) => ({
      items: state.items.filter((item) => item.id !== id),
    }));

    if (webViewRef?.current) {
      webViewRef.current.postMessage(
        JSON.stringify({
          action: 'REMOVE_ITEM',
          data: { id },
        }),
      );
    }
  },
  updateItemSizeWithWebView: (
    id: string,
    newSize: NewSize,
    webViewRef: RefObject<WebView | null> | null,
  ) => {
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
            action: 'UPDATE_ITEM_SIZE',
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
            action: 'RENDER_PACKING',
            data: { bag, items: updatedItems },
          }),
        );
      }

      return { items: updatedItems };
    });
  },
  updateItemSize: (
    id: string,
    newSize: NewSize,
    webViewRef: RefObject<WebView | null> | null,
  ) => {
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
          action: 'UPDATE_ITEM_SIZE',
          data: { id, ...newSize },
        }),
      );

      return { items: updated };
    });
  },
  setEditItemDims: (dims: EditDims) => set({ editItemDims: dims }),
  setEditItemDimsField: (key: keyof EditDims, value: string) =>
    set((state) => ({
      editItemDims: {
        ...state.editItemDims,
        [key]: value,
      },
    })),
  setEditItemSize: (size: EditDims) => set({ editItemSize: size }),
  updateEditItemField: (key: keyof EditDims, value: string) =>
    set((state) => ({
      editItemSize: { ...state.editItemSize, [key]: value },
    })),
});
