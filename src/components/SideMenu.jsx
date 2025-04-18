import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  View,
  Text,
  Pressable,
  StyleSheet,
  Dimensions,
} from "react-native";

const SCREEN_WIDTH = Dimensions.get("window").width;
const MENU_WIDTH = SCREEN_WIDTH * 0.75;
const ANIMATION_DURATION = 300;

export default function SideMenu({ visible, onClose, onSelect }) {
  const slideAnim = useRef(new Animated.Value(-MENU_WIDTH)).current;
  const [rendered, setRendered] = useState(visible);

  const mainLinks = ["소쿠리", "담아보기", "사이즈 재보기", "보관함"];
  const secondaryLinks = ["Market", "English"];

  useEffect(() => {
    if (visible) setRendered(true);
    Animated.timing(slideAnim, {
      toValue: visible ? 0 : -MENU_WIDTH,
      duration: ANIMATION_DURATION,
      useNativeDriver: true,
    }).start(() => {
      if (!visible) setRendered(false);
    });
  }, [visible, slideAnim]);

  const handlePress = (label) => {
    Animated.timing(slideAnim, {
      toValue: -MENU_WIDTH,
      duration: ANIMATION_DURATION,
      useNativeDriver: true,
    }).start(() => {
      onSelect?.(label);
      onClose?.();
    });
  };

  if (!rendered) return null;

  return (
    <View style={StyleSheet.absoluteFill}>
      <Pressable style={styles.overlay} onPress={handlePress} />

      <Animated.View
        style={[styles.menu, { transform: [{ translateX: slideAnim }] }]}>
        <View style={styles.section}>
          {mainLinks.map((label, idx) => (
            <Pressable
              key={idx}
              onPress={() => handlePress(label)}
              style={styles.mainItem}>
              <Text style={styles.mainText}>{label}</Text>
            </Pressable>
          ))}
        </View>
        <View style={styles.divider} />
        <View style={styles.section}>
          {secondaryLinks.map((label, idx) => (
            <Pressable
              key={idx}
              onPress={() => handlePress(label)}
              style={styles.secondaryItem}>
              <Text style={styles.secondaryText}>{label}</Text>
            </Pressable>
          ))}
        </View>
        <View style={styles.footer}>
          <Pressable onPress={() => handlePress("Contact")}>
            <Text style={styles.footerText}>Contact</Text>
          </Pressable>
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.2)",
  },
  menu: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    width: MENU_WIDTH,
    backgroundColor: "#fff",
    paddingTop: 100,
    paddingHorizontal: 20,
  },
  section: {
    marginBottom: 20,
  },
  mainItem: {
    paddingVertical: 12,
  },
  mainText: {
    fontSize: 20,
    fontWeight: "500",
    color: "#222",
  },
  divider: {
    height: 1,
    backgroundColor: "#eee",
    marginVertical: 20,
  },
  secondaryItem: {
    paddingVertical: 10,
  },
  secondaryText: {
    fontSize: 13,
    color: "#888",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  footer: {
    paddingTop: 30,
  },
  footerText: {
    textAlign: "center",
    fontSize: 13,
    color: "#999",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
});
