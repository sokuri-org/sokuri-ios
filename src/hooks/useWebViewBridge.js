import { debounce } from "lodash";
import { useRef, useEffect, useCallback } from "react";

const MAX_QUEUE_LENGTH = 10;
const DEBOUNCE_MS = 300;

export default function useWebViewBridge(ref, webViewReady) {
  const messageQueue = useRef([]);

  const debouncedPostMessage = useRef(
    debounce((payload) => {
      if (ref?.current?.postMessage) {
        ref.current.postMessage(JSON.stringify(payload));
        console.log("[WebView] postMessage sent (debounced):", payload);
      }
    }, DEBOUNCE_MS)
  ).current;

  const postMessageToWebView = useCallback(
    (action, data) => {
      const payload = { action, data };
      if (webViewReady && ref?.current?.postMessage) {
        debouncedPostMessage(payload);
      } else {
        if (messageQueue.current.length >= MAX_QUEUE_LENGTH) {
          messageQueue.current.shift();
        }
        messageQueue.current.push(payload);
        console.warn("[WebView] WebView not ready, queueing:", payload);
      }
    },
    [webViewReady, ref, debouncedPostMessage]
  );

  useEffect(() => {
    if (
      webViewReady &&
      ref?.current?.postMessage &&
      messageQueue.current.length > 0
    ) {
      messageQueue.current.forEach((payload) => {
        debouncedPostMessage(payload);
        console.log("[WebView] postMessage sent (from queue):", payload);
      });
      messageQueue.current = [];
    }
  }, [webViewReady, ref, debouncedPostMessage]);

  return postMessageToWebView;
}
