import React, { useEffect } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { useSokuriStore } from "@/store/useSokuriStore";

export default function EditItemModal({ visible, onClose, webViewRef }) {
  const editDims = useSokuriStore(
    (s) => s.editItemDims ?? { w: "", h: "", d: "" },
  );
  const setEditDims = useSokuriStore((s) => s.setEditItemDims);
  const selectedItem = useSokuriStore((s) => s.selectedItem);
  const setShouldAddBagToWebView = useSokuriStore(
    (s) => s.setShouldAddBagToWebView,
  );

  const handleChange = (field, value) => {
    setEditDims({ ...editDims, [field]: value });
  };

  useEffect(() => {
    if (visible && selectedItem) {
      setEditDims({
        w: String(selectedItem.width ?? ""),
        h: String(selectedItem.height ?? ""),
        d: String(selectedItem.depth ?? ""),
      });
    }
  }, [visible, selectedItem]);

  const handleConfirm = () => {
    const width = parseFloat(editDims.w);
    const height = parseFloat(editDims.h);
    const depth = parseFloat(editDims.d);
    if (isNaN(width) || isNaN(height) || isNaN(depth)) {
      Alert.alert("입력 오류", "유효한 숫자를 입력해주세요.");
      return;
    }
    console.log("🔧 변경 시도", { width, height, depth });
    console.log("selectedItem: ", selectedItem);
    console.log("webViewRef: ", webViewRef);

    useSokuriStore
      .getState()
      .updateItemSizeWithWebView(
        selectedItem.id,
        { width, height, depth },
        webViewRef,
      );
    setShouldAddBagToWebView(true);
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>사이즈 수정</Text>
          <TextInput
            value={editDims.w}
            onChangeText={(v) => handleChange("w", v)}
            placeholder="Width"
            style={styles.input}
            keyboardType="numeric"
          />
          <TextInput
            value={editDims.h}
            onChangeText={(v) => handleChange("h", v)}
            placeholder="Height"
            style={styles.input}
            keyboardType="numeric"
          />
          <TextInput
            value={editDims.d}
            onChangeText={(v) => handleChange("d", v)}
            placeholder="Depth"
            style={styles.input}
            keyboardType="numeric"
          />
          <View style={styles.modalBtnRow}>
            <TouchableOpacity style={styles.modalBtn} onPress={handleConfirm}>
              <Text>변경</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalBtn} onPress={onClose}>
              <Text>취소</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "90%",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 12,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    padding: 10,
    marginBottom: 10,
  },
  modalBtnRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  modalBtn: {
    backgroundColor: "#eee",
    padding: 10,
    borderRadius: 6,
    width: "45%",
    alignItems: "center",
  },
});
