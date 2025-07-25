import { WEB_VIEW_API } from "@env";
import { isEqual } from "lodash";
import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
  forwardRef,
} from "react";
import { StyleSheet } from "react-native";
import { WebView } from "react-native-webview";
import useWebViewBridge from "@/hooks/useWebViewBridge";
import { useSokuriStore } from "@/store/useSokuriStore";

const INJECTED_JAVASCRIPT = `
  (function() {
    const originalLog = console.log;
    console.log = function(...args) {
      window.ReactNativeWebView.postMessage(JSON.stringify({
        type: "CONSOLE_LOG",
        payload: args
      }));
      originalLog.apply(console, args);
    };
    window.ReactNativeWebView.postMessage(JSON.stringify({
      type: "WEBVIEW_READY"
    }));
  })();
  true;
`;

const WebSimulator = forwardRef(({ onLoadReady }, ref) => {
  const bag = useSokuriStore((s) => s.bag);
  const items = useSokuriStore((s) => s.items);
  const updateItemPosition = useSokuriStore((s) => s.updateItemPosition);
  const [webViewReady, setWebViewReady] = useState(false);
  const prevPayloadRef = useRef(null);

  const postMessageToWebView = useWebViewBridge(ref, webViewReady);

  const handleWebViewMessage = useCallback(
    (event) => {
      try {
        const data = JSON.parse(event.nativeEvent.data);
        switch (data.type) {
          case "WEBVIEW_READY":
            setWebViewReady(true);
            onLoadReady?.();
            break;
          case "ITEM_MOVED":
            updateItemPosition(data.id, data.position);
            break;
          case "CONSOLE_LOG":
            console.log("[WebView]:", ...data.payload);
            break;
        }
      } catch (err) {
        console.error(
          "Failed to parse WebView message:",
          err,
          event.nativeEvent.data,
        );
      }
    },
    [onLoadReady, updateItemPosition],
  );

  useEffect(() => {
    if (!webViewReady) return;

    const currentPayload = { bag, items };
    if (
      bag?.width &&
      items?.length > 0 &&
      !isEqual(currentPayload, prevPayloadRef.current)
    ) {
      postMessageToWebView("RENDER_PACKING", currentPayload);
      prevPayloadRef.current = currentPayload;
    }
  }, [bag, items, postMessageToWebView, webViewReady]);

  return (
    <WebView
      ref={ref}
      source={{ uri: WEB_VIEW_API }}
      javaScriptEnabled
      onMessage={handleWebViewMessage}
      injectedJavaScript={INJECTED_JAVASCRIPT}
      style={styles.webViewArea}
    />
  );
});

const styles = StyleSheet.create({
  webViewArea: {
    flex: 1,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
});

export default WebSimulator;
