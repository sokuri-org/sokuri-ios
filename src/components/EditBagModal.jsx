import React from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { useSokuriStore } from "@/store/useSokuriStore";

export default function EditBagModal({ visible, onClose, webViewRef }) {
  const bag = useSokuriStore((s) => s.bag);
  const setBag = useSokuriStore((s) => s.setBag);
  const [bagInput, setBagInput] = React.useState({
    width: String(bag?.width ?? ""),
    height: String(bag?.height ?? ""),
    depth: String(bag?.depth ?? ""),
  });

  const postMessageToWebView = (action, data) => {
    if (!webViewRef?.current) return;
    const message = { action, data };
    webViewRef.current.postMessage(JSON.stringify(message));
  };

  const handleChange = (field, value) => {
    setBagInput((prev) => ({ ...prev, [field]: value }));
  };

  const handleConfirm = () => {
    const w = parseFloat(bagInput.width);
    const h = parseFloat(bagInput.height);
    const d = parseFloat(bagInput.depth);

    if (isNaN(w) || isNaN(h) || isNaN(d)) {
      Alert.alert("입력 오류", "유효한 숫자를 입력해주세요.");
      return;
    }

    const newBag = { width: w, height: h, depth: d };
    setBag(newBag);
    postMessageToWebView("ADD_BAG", { bag: newBag });
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.modalOverlay}
        keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}>
        <ScrollView
          contentContainerStyle={styles.modalScrollContent}
          keyboardShouldPersistTaps="handled">
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>👜 가방 사이즈 수정</Text>
            {["width", "height", "depth"].map((field) => (
              <TextInput
                key={field}
                value={bagInput[field]}
                placeholder={field}
                placeholderTextColor="#ccc"
                onChangeText={(text) => handleChange(field, text)}
                style={styles.input}
                keyboardType="numeric"
              />
            ))}
            <View style={styles.modalBtnRow}>
              <Pressable style={styles.modalBtn} onPress={handleConfirm}>
                <Text>변경</Text>
              </Pressable>
              <Pressable style={styles.modalBtn} onPress={onClose}>
                <Text>취소</Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
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
  modalScrollContent: {
    flexGrow: 1,
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
    width: "100%",
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
