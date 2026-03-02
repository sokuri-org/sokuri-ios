import { nanoid } from 'nanoid/non-secure';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { ITEM_LIST } from '@/constants';
import { Item } from '@/types';

interface PresentItemListProps {
  onAddItem?: (item: Item) => void;
}

export default function PresentItemList({ onAddItem }: PresentItemListProps) {
  return (
    <View>
      {ITEM_LIST.map((item, index) => {
        const handlePress = () => {
          const newItem: Item = {
            id: nanoid(),
            itemTitle: item.itemTitle,
            width: item.width,
            height: item.height,
            depth: item.depth,
            loadBear: item.loadBear,
            position: { x: 0, y: 0, z: 0 },
          };
          onAddItem?.(newItem);
        };

        return (
          <TouchableOpacity
            key={index}
            style={styles.item}
            onPress={handlePress}>
            <Image style={styles.icon} source={{}} />
            <Text style={styles.title}>{item.itemTitle}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  item: {
    flexDirection: 'row',
    alignItems: 'center',
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
