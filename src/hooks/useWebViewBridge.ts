import { debounce } from 'lodash';
import { useRef, useEffect, useCallback, RefObject } from 'react';
import { WebView } from 'react-native-webview';
import { WebViewAction } from '@/types';

const MAX_QUEUE_LENGTH = 10;
const DEBOUNCE_MS = 300;

export default function useWebViewBridge(
  ref: RefObject<WebView | null>,
  webViewReady: boolean,
): (action: WebViewAction, data: unknown) => void {
  const messageQueue = useRef<{ action: WebViewAction; data: unknown }[]>([]);

  const debouncedPostMessage = useRef(
    debounce((payload: { action: WebViewAction; data: unknown }) => {
      if (ref?.current) {
        ref.current.postMessage(JSON.stringify(payload));
        console.log('[WebView] postMessage sent (debounced):', payload);
      }
    }, DEBOUNCE_MS),
  ).current;

  const postMessageToWebView = useCallback(
    (action: WebViewAction, data: unknown) => {
      const payload = { action, data };
      if (webViewReady && ref?.current) {
        debouncedPostMessage(payload);
      } else {
        if (messageQueue.current.length >= MAX_QUEUE_LENGTH) {
          messageQueue.current.shift();
        }
        messageQueue.current.push(payload);
        console.warn('[WebView] WebView not ready, queueing:', payload);
      }
    },
    [webViewReady, ref, debouncedPostMessage],
  );

  useEffect(() => {
    if (
      webViewReady &&
      ref?.current &&
      messageQueue.current.length > 0
    ) {
      messageQueue.current.forEach((payload) => {
        debouncedPostMessage(payload);
        console.log('[WebView] postMessage sent (from queue):', payload);
      });
      messageQueue.current = [];
    }
  }, [webViewReady, ref, debouncedPostMessage]);

  return postMessageToWebView;
}
