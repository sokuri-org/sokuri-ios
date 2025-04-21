import React, { useRef, useState } from "react";
import { View, Button, StyleSheet } from "react-native";
import { WebView } from "react-native-webview";

export default function SimulationScreen() {
  const webViewRef = useRef(null);
  const [webViewLoaded, setWebViewLoaded] = useState(false);

  const itemSize = {
    width: 1,
    height: 0.5,
    depth: 0.5,
  };

  const sendSimulationData = () => {
    if (!webViewLoaded) {
      console.warn("WebView가 조회되지 않았습니다");
      return;
    }

    const message = JSON.stringify({
      action: "START_SIM",
      data: { itemSize },
    });
    webViewRef.current?.postMessage(message);
  };

  return (
    <View style={styles.container}>
      <WebView
        ref={webViewRef}
        originWhitelist={["*"]}
        source={{
          uri: "https://sokuri-simulator-g0dtrlkft-sokuris-projects-487697b5.vercel.app",
        }}
        javaScriptEnabled={true}
        onLoadEnd={() => {
          setWebViewLoaded(true);
        }}
        onMessage={(event) => {
          JSON.parse(event.nativeEvent.data);
        }}
        style={styles.webview}
      />

      <Button title="시뮬레이션" onPress={sendSimulationData} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  webview: {
    flex: 1,
  },
});
