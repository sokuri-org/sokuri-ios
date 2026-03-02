export interface Position {
  x: number;
  y: number;
  z: number;
}

export interface Bag {
  width: number;
  height: number;
  depth: number;
}

export interface Item {
  id: string;
  itemTitle: string;
  width: number;
  height: number;
  depth: number;
  loadBear: number;
  position?: Position;
}

export interface EditDims {
  w: string;
  h: string;
  d: string;
}

export type Screen = 'main' | 'sizeSummary' | 'simulation';

// WebView → RN 메시지
export type WebViewMessageType =
  | 'WEBVIEW_READY'
  | 'ITEM_MOVED'
  | 'CONSOLE_LOG'
  | 'ITEM_TOO_LARGE';

// RN → WebView 액션
export type WebViewAction =
  | 'ADD_ITEM'
  | 'REMOVE_ITEM'
  | 'UPDATE_ITEM_SIZE'
  | 'RENDER_PACKING'
  | 'ADD_BAG'
  | 'START_SIM';

export interface WebViewPayload<T = unknown> {
  action: WebViewAction;
  data: T;
}
