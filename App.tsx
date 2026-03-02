import React, { useState } from "react";
import {
  View,
  TouchableOpacity,
  SafeAreaView,
  StyleSheet,
  Dimensions,
} from "react-native";
import Toast from "react-native-toast-message";
import BagIcon from "@/assets/images/bag.svg";
import BoxIcon from "@/assets/images/box.svg";
import HomeIcon from "@/assets/images/home.svg";
import InboxIcon from "@/assets/images/inbox.svg";
import MenuIcon from "@/assets/images/menu.svg";
import Header from "@/components/Header";
import SideMenu from "@/components/SideMenu";
import SizeSummaryCard from "@/screens/BagSize/SizeSummaryCard";
import Home from "@/screens/Home";
import Simulate from "@/screens/Simulate";
import { useSokuriStore } from "@/store/useSokuriStore";
import { Screen } from "@/types";

const screenHeight = Dimensions.get("window").height;

export default function App() {
  const [menuVisible, setMenuVisible] = useState(false);
  const setCurrentScreen = useSokuriStore((s) => s.setCurrentScreen);
  const currentScreen = useSokuriStore((s) => s.currentScreen);

  const handleMenuSelect = (label: Screen) => {
    setMenuVisible(false);
    setCurrentScreen(label);
  };

  const handlePageChange = () => {
    setCurrentScreen("simulation");
  };

  const handleSizeEdit = () => {
    setCurrentScreen("main");
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.wrapper}>
        <Header />
        {currentScreen === "main" && <Home />}
        {currentScreen === "sizeSummary" && <SizeSummaryCard />}
        {currentScreen === "simulation" && <Simulate />}
      </View>

      <View style={styles.bottomNav}>
        <TouchableOpacity onPress={() => setMenuVisible(true)}>
          <MenuIcon width={32} height={32} />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setCurrentScreen("sizeSummary")}>
          <BagIcon width={32} height={32} />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleSizeEdit}>
          <HomeIcon width={32} height={32} />
        </TouchableOpacity>
        <TouchableOpacity onPress={handlePageChange}>
          <BoxIcon width={32} height={32} />
        </TouchableOpacity>
        <InboxIcon width={32} height={32} />
      </View>

      <SideMenu
        visible={menuVisible}
        onClose={() => setMenuVisible(false)}
        onSelect={handleMenuSelect}
      />

      <Toast />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  safe: {
    flex: 1,
    backgroundColor: "#fff",
  },
  wrapper: {
    flex: 1,
    padding: 10,
    marginHorizontal: "auto",
    maxWidth: 420,
    height: screenHeight,
    backgroundColor: "#fff",
    borderRadius: 24,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 4,
  },
  bottomNav: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 30,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: "#ddd",
  },
});
