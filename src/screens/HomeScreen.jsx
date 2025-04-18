import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import MenuIcon from "../assets/images/menu.svg";
import Header from "../components/Header";
import MainContent from "../components/MainContent";
import SideMenu from "../components/SideMenu";
import SimulationScreen from "./SimulateScreen";

export default function App() {
  const [menuVisible, setMenuVisible] = useState(false);
  const [currentPage, setCurrentPage] = useState("home");

  const handleMenuSelect = (label) => {
    if (label === "담아보기") {
      setCurrentPage("simulate");
    } else {
      setCurrentPage("home");
    }
    setMenuVisible(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.menuButtonContainer}>
        <MenuIcon width={32} height={32} onPress={() => setMenuVisible(true)} />
      </View>

      {currentPage === "home" ? (
        <>
          <Header />
          <MainContent />
        </>
      ) : (
        currentPage === "simulate" && (
          <>
            <Header />
            <SimulationScreen />
          </>
        )
      )}

      <SideMenu
        visible={menuVisible}
        onClose={() => setMenuVisible(false)}
        onSelect={handleMenuSelect}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  menuButtonContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
  },
});
