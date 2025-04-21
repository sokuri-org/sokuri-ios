import React from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import Toast from "react-native-toast-message";
import BoxIcon from "@/assets/images/box.svg";
import { ITEM_LIST } from "@/constants";
import { useSokuriStore } from "@/store/useSokuriStore";

export default function PresetItemList({ webViewRef }) {
  const addItem = useSokuriStore((s) => s.addItem);
  const bag = useSokuriStore((s) => s.bag);

  const postMessageToWebView = (action, data) => {
    if (!webViewRef?.current) return;
    const message = { action, data };
    webViewRef.current.postMessage(JSON.stringify(message));
  };

  const addItemToWebView = (item) => {
    const w = parseFloat(item.width);
    const h = parseFloat(item.height);
    const d = parseFloat(item.depth);

    if (!bag || isNaN(w) || isNaN(h) || isNaN(d)) return false;
    const isTooBig = w >= bag.width || h >= bag.height || d >= bag.depth;
    if (isTooBig) return false;

    addItem({ ...item, width: w, height: h, depth: d });
    postMessageToWebView("ADD_ITEM", {
      id: item.id,
      width: w,
      height: h,
      depth: d,
      color: "#44ccff",
      x: 0,
      y: 0,
      z: 0,
    });
    return true;
  };

  return (
    <View style={styles.presetList}>
      <ScrollView>
        {ITEM_LIST.map((entry, idx) => {
          const key = Object.keys(entry)[0];
          const item = entry[key];
          const newItem = {
            id: Date.now().toString() + idx,
            itemTitle: item.title,
            width: item.w,
            height: item.h,
            depth: item.d,
            loadBear: item.loadBear,
            position: { x: 0, y: 0, z: 0 },
          };

          return (
            <TouchableOpacity
              key={key + idx}
              style={styles.presetCard}
              onPress={() => {
                const added = addItemToWebView(newItem);
                if (added) {
                  Toast.show({
                    type: "success",
                    text1: "📦 프리셋 아이템 추가",
                    text2: `${item.title}이(가) 추가되었습니다.`,
                  });
                } else {
                  Toast.show({
                    type: "error",
                    text1: "🚫 추가 불가",
                    text2: `${item.title}은(는) 가방보다 커서 추가할 수 없습니다.`,
                  });
                }
              }}>
              <View>
                <Text style={styles.itemName}>{item.title}</Text>
                <Text style={styles.itemInfo}>
                  너비: {item.w} 높이: {item.h} 폭: {item.d} (g: {item.loadBear}
                  )
                </Text>
              </View>
              <TouchableOpacity>
                <BoxIcon width={32} height={32} color="#999" />
              </TouchableOpacity>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  presetList: {
    gap: 5,
  },
  presetCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#f9f9f9",
    padding: 16,
    borderRadius: 8,
    marginTop: 6,
  },
  itemName: {
    fontSize: 14,
    color: "#222",
  },
  itemInfo: {
    fontSize: 12,
    color: "#777",
    marginTop: 2,
  },
});
