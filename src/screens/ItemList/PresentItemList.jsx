import { nanoid } from "nanoid/non-secure";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import { ITEM_LIST } from "@/constants";

export default function PresetItemList({ onAddItem }) {
  return (
    <View>
      {ITEM_LIST.map((item, index) => {
        const itemName = Object.keys(item)[0];
        const { title, w, h, d, loadBear } = item[itemName];

        const handlePress = () => {
          const newItem = {
            id: nanoid(),
            itemTitle: title,
            width: w,
            height: h,
            depth: d,
            loadBear,
            position: { x: 0, y: 0, z: 0 },
          };
          onAddItem?.(newItem);
        };

        return (
          <TouchableOpacity
            key={index}
            style={styles.item}
            onPress={handlePress}>
            <Image style={styles.icon} />
            <Text style={styles.title}>{title}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  item: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    gap: 12,
  },
  title: {
    fontSize: 16,
  },
  icon: {
    width: 32,
    height: 32,
  },
});
