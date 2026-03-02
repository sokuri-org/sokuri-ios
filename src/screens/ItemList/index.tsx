import React, { useState, RefObject } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Alert,
  StyleSheet,
} from 'react-native';
import { SwipeListView } from 'react-native-swipe-list-view';
import { WebView } from 'react-native-webview';
import BoxIcon from '@/assets/images/box.svg';
import TrashIcon from '@/assets/images/trash.svg';
import { useSokuriStore } from '@/store/useSokuriStore';
import { Item } from '@/types';

interface ItemListProps {
  webViewRef: RefObject<WebView | null>;
  openModal: () => void;
  openEditModal: () => void;
}

export default function ItemList({
  webViewRef,
  openModal,
  openEditModal,
}: ItemListProps) {
  const items = useSokuriStore((s) => s.items);
  const setSelectedItem = useSokuriStore((s) => s.setSelectedItem);
  const setEditItemDims = useSokuriStore((s) => s.setEditItemDims);

  return (
    <View style={styles.itemList}>
      <View style={styles.itemList}>
        <SwipeListView
          data={items}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }: { item: Item }) => (
            <TouchableWithoutFeedback
              key={item.id}
              delayLongPress={300}
              onLongPress={() => {
                setSelectedItem(item);
                setEditItemDims({
                  w: String(item.width),
                  h: String(item.height),
                  d: String(item.depth),
                });
                openEditModal();
              }}>
              <View style={styles.itemCard}>
                <View>
                  <Text style={styles.itemName}>{item.itemTitle}</Text>
                  <Text style={styles.itemInfo}>
                    가로: {item.width} 세로: {item.height} 폭: {item.depth}
                  </Text>
                </View>
                <TouchableOpacity>
                  <BoxIcon width={32} height={32} color="#999" />
                </TouchableOpacity>
              </View>
            </TouchableWithoutFeedback>
          )}
          renderHiddenItem={({ item }: { item: Item }) => (
            <View style={styles.rowBack}>
              <TouchableOpacity
                style={styles.deleteBtn}
                onPress={() =>
                  Alert.alert(
                    '삭제 확인',
                    `"${item.itemTitle}" 아이템을 삭제할까요?`,
                    [
                      { text: '취소', style: 'cancel' },
                      {
                        text: '삭제',
                        style: 'destructive',
                        onPress: () =>
                          useSokuriStore
                            .getState()
                            .removeItemByIdWithWebView(item.id, webViewRef),
                      },
                    ],
                  )
                }>
                <TrashIcon width={16} height={16} />
              </TouchableOpacity>
            </View>
          )}
          rightOpenValue={-75}
          disableRightSwipe
          contentContainerStyle={styles.itemList}
        />

        <TouchableOpacity style={styles.addItemButton} onPress={openModal}>
          <Text style={styles.addItemText}>아이템 추가</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  itemList: {
    gap: 5,
  },
  itemCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#f9f9f9',
    padding: 16,
    marginTop: 6,
    borderRadius: 8,
  },
  itemName: {
    fontSize: 14,
    color: '#222',
  },
  itemInfo: {
    fontSize: 12,
    color: '#777',
    marginTop: 2,
  },
  rowBack: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingRight: 15,
  },
  deleteBtn: {
    backgroundColor: '#ff4d4d',
    marginTop: 16,
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 6,
  },
  deleteText: {
    color: '#fff',
    fontWeight: '600',
  },
  addItemButton: {
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#f2f2f2',
    alignItems: 'center',
  },
  addItemText: {
    color: '#ffcd4a',
    fontSize: 14,
    fontWeight: '600',
  },
});
