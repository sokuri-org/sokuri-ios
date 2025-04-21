import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Modal,
  TextInput,
  Alert,
} from "react-native";
import { useSokuriStore } from "@/store/useSokuriStore";

export default function SizeSummaryCard() {
  const bag = useSokuriStore((s) => s.bag);
  const setBag = useSokuriStore((s) => s.setBagSize);
  const setCurrentScreen = useSokuriStore((s) => s.setCurrentScreen);
  const [modalVisible, setModalVisible] = useState(false);
  const [bagInput, setBagInput] = useState({
    width: bag?.width?.toString() || "",
    height: bag?.height?.toString() || "",
    depth: bag?.depth?.toString() || "",
  });
  const setShouldAddBagToWebView = useSokuriStore(
    (s) => s.setShouldAddBagToWebView,
  );

  const handleStartSimulation = () => {
    setShouldAddBagToWebView(true);
    setCurrentScreen("simulation");
  };

  const handleModalSave = () => {
    const newBag = {
      width: parseFloat(bagInput.width),
      height: parseFloat(bagInput.height),
      depth: parseFloat(bagInput.depth),
    };

    if (
      isNaN(newBag.width) ||
      isNaN(newBag.height) ||
      isNaN(newBag.depth) ||
      newBag.width <= 0 ||
      newBag.height <= 0 ||
      newBag.depth <= 0
    ) {
      Alert("모든 값을 숫자로 입력해주세요.");
      return;
    }

    setBag(newBag);
    setModalVisible(false);
  };

  useEffect(() => {
    if (modalVisible) {
      setBagInput({
        width: bag?.width?.toString() || "",
        height: bag?.height?.toString() || "",
        depth: bag?.depth?.toString() || "",
      });
    }
  }, [bag?.width, bag?.height, bag?.depth, modalVisible]);

  return (
    <ScrollView contentContainerStyle={styles.scroll}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>가방 사이즈</Text>
        </View>

        <View style={styles.cardContainer}>
          <View style={styles.card}>
            <View style={styles.grid}>
              {["너비", "높이", "폭"].map((label, index) => (
                <View key={label} style={styles.gridItem}>
                  <Text style={styles.gridLabel}>{label}</Text>
                  <Text style={styles.gridValue}>
                    {[bag?.width, bag?.height, bag?.depth][index]}
                    <Text style={styles.unit}> cm</Text>
                  </Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        <View style={styles.actions}>
          <Text style={styles.subtitle}>
            가방사이즈를 직접 입력하면 정확한 비교가 가능해요
          </Text>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={handleStartSimulation}>
            <Text style={styles.primaryButtonText}>시뮬레이션 시작</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => setModalVisible(true)}>
            <Text style={styles.secondaryButtonText}>사이즈 변경</Text>
          </TouchableOpacity>
        </View>
      </View>

      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>가방 사이즈 수정</Text>

            <TextInput
              style={styles.modalInput}
              keyboardType="numeric"
              placeholder="너비 (cm)"
              placeholderTextColor="#ccc"
              value={bagInput.width}
              onChangeText={(t) => setBagInput({ ...bagInput, width: t })}
            />
            <TextInput
              style={styles.modalInput}
              keyboardType="numeric"
              placeholder="높이 (cm)"
              placeholderTextColor="#ccc"
              value={bagInput.height}
              onChangeText={(t) => setBagInput({ ...bagInput, height: t })}
            />
            <TextInput
              style={styles.modalInput}
              keyboardType="numeric"
              placeholderTextColor="#ccc"
              placeholder="깊이 (cm)"
              value={bagInput.depth}
              onChangeText={(t) => setBagInput({ ...bagInput, depth: t })}
            />

            <View style={styles.modalButtonGroup}>
              <TouchableOpacity
                onPress={handleModalSave}
                style={styles.modalButton}>
                <Text style={styles.modalButtonText}>저장</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={styles.modalCancelButton}>
                <Text style={styles.modalCancelButtonText}>취소</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    padding: 24,
  },
  container: {
    marginTop: 24,
    backgroundColor: "#fff",
  },
  header: {
    alignItems: "center",
    marginBottom: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: "300",
    color: "#111",
  },
  cardContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  card: {
    width: "100%",
    maxWidth: 360,
    backgroundColor: "#f9f9f9",
    borderRadius: 12,
    padding: 24,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  grid: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  gridItem: {
    alignItems: "center",
    flex: 1,
  },
  gridLabel: {
    fontSize: 12,
    color: "#888",
    marginBottom: 4,
  },
  gridValue: {
    fontSize: 24,
    fontWeight: "300",
    color: "#222",
  },
  unit: {
    fontSize: 14,
    marginLeft: 2,
    color: "#666",
  },
  editWrapper: {
    marginTop: 5,
    alignItems: "flex-end",
  },
  editButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  editText: {
    fontSize: 12,
    color: "#f9f9f9",
    marginLeft: 4,
  },
  actions: {
    justifyContent: "flex-end",
    marginTop: 16,
    gap: 12,
  },
  primaryButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffcd4a",
    borderRadius: 8,
    paddingVertical: 14,
  },
  primaryButtonText: {
    color: "black",
    fontSize: 16,
    fontWeight: "300",
  },
  secondaryButton: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: "center",
  },
  secondaryButtonText: {
    color: "#444",
    fontSize: 16,
    fontWeight: "300",
  },
  subtitle: {
    fontSize: 12,
    paddingTop: 50,
    textAlign: "center",
    letterSpacing: 2,
    textTransform: "uppercase",
    color: "#999",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 12,
    width: "80%",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
    textAlign: "center",
  },
  modalInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginBottom: 8,
  },
  modalButton: {
    flex: 1,
    backgroundColor: "#ffcd4a",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginHorizontal: 4,
  },
  modalButtonGroup: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
  },
  modalButtonText: {
    color: "black",
    fontWeight: "400",
  },
  modalCancelButton: {
    flex: 1,
    backgroundColor: "#ccc",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginLeft: 4,
  },
  modalCancelButtonText: {
    color: "#000",
    fontWeight: "400",
  },
});
