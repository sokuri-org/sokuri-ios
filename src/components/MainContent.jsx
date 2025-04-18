import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import ArrowRight from "../assets/images/arrow-right.svg";

export default function MainContent() {
  const [url, setUrl] = useState("");

  const handleMeasurePress = () => {
    if (!url.trim()) {
      Alert.alert("URL을 입력해주세요.");
      return;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.topSection}>
        <Text style={styles.title}>Find your perfect size</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter product URL"
          placeholderTextColor="#ccc"
          value={url}
          onChangeText={setUrl}
          autoCapitalize="none"
          keyboardType="url"
          returnKeyType="done"
          accessibilityLabel="Product URL Input"
        />
      </View>

      <View style={styles.bottomSection}>
        <TouchableOpacity
          style={styles.measureButton}
          onPress={handleMeasurePress}
          accessibilityRole="button"
          accessibilityLabel="Measure Bag Button">
          <Text style={styles.buttonText}>Measure Bag</Text>
          <ArrowRight width={16} height={16} style={styles.arrowIcon} />
        </TouchableOpacity>

        <View style={styles.divider} />

        <Text style={styles.subText}>
          Discover the perfect size for your next purchase
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 32,
    paddingTop: 32,
    paddingBottom: 32,
    backgroundColor: "#fff",
  },
  topSection: {
    marginBottom: 64,
  },
  title: {
    fontSize: 24,
    fontFamily: "serif",
    color: "#111",
    marginBottom: 16,
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    paddingVertical: 8,
    fontSize: 16,
    color: "#111",
  },
  bottomSection: {
    marginTop: "auto",
  },
  measureButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
  },
  buttonText: {
    flex: 1,
    fontSize: 13,
    textTransform: "uppercase",
    letterSpacing: 2,
    color: "#111",
  },
  arrowIcon: {
    transform: [{ translateX: 0 }],
  },
  divider: {
    height: 1,
    backgroundColor: "#ddd",
  },
  subText: {
    marginTop: 24,
    fontSize: 12,
    color: "#888",
    letterSpacing: 1,
    textAlign: "center",
  },
});
