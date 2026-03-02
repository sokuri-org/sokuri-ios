import React, { RefObject } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import Toast from 'react-native-toast-message';
import { WebView } from 'react-native-webview';
import BoxIcon from '@/assets/images/box.svg';
import { ITEM_LIST } from '@/constants';
import { useSokuriStore } from '@/store/useSokuriStore';
import { Item, WebViewAction } from '@/types';

interface PresetItemListProps {
  webViewRef: RefObject<WebView | null>;
}

export default function PresetItemList({ webViewRef }: PresetItemListProps) {
  const addItem = useSokuriStore((s) => s.addItem);
  const bag = useSokuriStore((s) => s.bag);

  const postMessageToWebView = (action: WebViewAction, data: unknown) => {
    if (!webViewRef?.current) return;
    const message = { action, data };
    webViewRef.current.postMessage(JSON.stringify(message));
  };

  const addItemToWebView = (item: Item): boolean => {
    const w = parseFloat(String(item.width));
    const h = parseFloat(String(item.height));
    const d = parseFloat(String(item.depth));

    if (!bag || isNaN(w) || isNaN(h) || isNaN(d)) return false;

    const isTooBig = w > bag.width || h > bag.height || d > bag.depth;
    if (isTooBig) return false;

    addItem({ ...item, width: w, height: h, depth: d });

    postMessageToWebView('ADD_ITEM', {
      id: item.id,
      width: w,
      height: h,
      depth: d,
      color: '#44ccff',
      x: 0,
      y: 0,
      z: 0,
    });
    return true;
  };

  return (
    <View style={styles.presetList}>
      <ScrollView>
        {ITEM_LIST.map((item, idx) => {
          const newItem: Item = {
            id: item.id || Date.now().toString() + idx,
            itemTitle: item.itemTitle,
            width: item.width,
            height: item.height,
            depth: item.depth,
            loadBear: item.loadBear,
            position: { x: 0, y: 0, z: 0 },
          };

          return (
            <TouchableOpacity
              key={newItem.id}
              style={styles.presetCard}
              onPress={() => {
                const added = addItemToWebView(newItem);
                if (added) {
                  Toast.show({
                    type: 'success',
                    text1: '📦 프리셋 아이템 추가',
                    text2: `${newItem.itemTitle}이(가) 추가되었습니다.`,
                  });
                } else {
                  Toast.show({
                    type: 'error',
                    text1: '🚫 추가 불가',
                    text2: `${newItem.itemTitle}은(는) 가방보다 커서 추가할 수 없습니다.`,
                  });
                }
              }}>
              <View>
                <Text style={styles.itemName}>{newItem.itemTitle}</Text>
                <Text style={styles.itemInfo}>
                  너비: {newItem.width} 높이: {newItem.height} 폭:{' '}
                  {newItem.depth} (g: {newItem.loadBear})
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#f9f9f9',
    padding: 16,
    borderRadius: 8,
    marginTop: 6,
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
});
