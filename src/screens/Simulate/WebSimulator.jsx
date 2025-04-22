import { WEB_VIEW_API } from "@env";
import React, { useEffect } from "react";
import { StyleSheet } from "react-native";
import { WebView } from "react-native-webview";
import { useSokuriStore } from "@/store/useSokuriStore";

const WebSimulator = React.forwardRef(({ onLoadReady }, ref) => {
  const bag = useSokuriStore((s) => s.bag);
  const items = useSokuriStore((s) => s.items);
  const updateItemPosition = useSokuriStore((s) => s.updateItemPosition);

  const handleWebViewMessage = (event) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      switch (data.type) {
        case "WEBVIEW_READY":
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
      console.error("Failed to parse WebView message:", err);
    }
  };

  useEffect(() => {
    const postMessageToWebView = (action, data) => {
      if (!ref?.current?.postMessage) return;
      ref.current.postMessage(JSON.stringify({ action, data }));
    };

    if (bag?.width && items?.length > 0) {
      postMessageToWebView("RENDER_PACKING", { bag, items });
    }
  }, [bag, items, ref]);

  return (
    <WebView
      ref={ref}
      source={{ uri: WEB_VIEW_API }}
      javaScriptEnabled
      onMessage={handleWebViewMessage}
      injectedJavaScript={`
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
      `}
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
