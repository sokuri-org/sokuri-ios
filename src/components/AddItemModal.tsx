import React, { useState, useEffect, RefObject } from 'react';
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
} from 'react-native';
import Toast from 'react-native-toast-message';
import { WebView } from 'react-native-webview';
import { useSokuriStore } from '@/store/useSokuriStore';
import { WebViewAction } from '@/types';

interface AddItemModalProps {
  visible: boolean;
  onClose: () => void;
  webViewRef: RefObject<WebView | null>;
}

interface NewItemState {
  itemTitle: string;
  width: string;
  height: string;
  depth: string;
}

type NewItemField = keyof NewItemState;

export default function AddItemModal({
  visible,
  onClose,
  webViewRef,
}: AddItemModalProps) {
  const [newItem, setNewItem] = useState<NewItemState>({
    itemTitle: '',
    width: '',
    height: '',
    depth: '',
  });

  const addItem = useSokuriStore((s) => s.addItem);
  const bag = useSokuriStore((s) => s.bag);

  const placeholders: Record<NewItemField, string> = {
    itemTitle: '아이템 이름',
    width: '너비 (cm)',
    height: '높이 (cm)',
    depth: '깊이 (cm)',
  };

  useEffect(() => {
    if (!visible) {
      setNewItem({ itemTitle: '', width: '', height: '', depth: '' });
    }
  }, [visible]);

  const postMessageToWebView = (action: WebViewAction, data: unknown) => {
    if (!webViewRef?.current) {
      console.warn('WebView ref is not available.');
      return;
    }
    webViewRef.current.postMessage(JSON.stringify({ action, data }));
  };

  const handleAdd = () => {
    const { itemTitle, width, height, depth } = newItem;
    const w = parseFloat(width);
    const h = parseFloat(height);
    const d = parseFloat(depth);

    if (
      !bag ||
      isNaN(w) ||
      isNaN(h) ||
      isNaN(d) ||
      w <= 0 ||
      h <= 0 ||
      d <= 0
    ) {
      Toast.show({
        type: 'error',
        text1: '⚠️ 추가 실패',
        text2: '가방 정보나 아이템 크기가 올바르지 않습니다. 양수를 입력해주세요.',
      });
      return;
    }

    if (w > bag.width || h > bag.height || d > bag.depth) {
      Toast.show({
        type: 'error',
        text1: '🚫 추가 불가',
        text2: `${
          itemTitle || '이 아이템'
        }은(는) 가방의 크기를 초과하여 담을 수 없습니다.`,
      });
      return;
    }

    const id = Date.now().toString();

    const item = {
      id,
      itemTitle,
      width: w,
      height: h,
      depth: d,
      loadBear: 0,
      position: { x: 0, y: 0, z: 0 },
    };

    addItem(item);

    console.log('[AddItemModal] WebView로 전송될 아이템 데이터:');
    console.log('  ID:', id);
    console.log('  크기 (cm):', { width: w, height: h, depth: d });
    console.log('  초기 위치 (cm):', { x: 0, y: 0, z: 0 });

    postMessageToWebView('ADD_ITEM', {
      id,
      width: w,
      height: h,
      depth: d,
      color: '#44ccff',
      x: 0,
      y: 0,
      z: 0,
    });

    Toast.show({
      type: 'success',
      text1: '📦 아이템 추가 완료',
      text2: `${itemTitle || '아이템'}이(가) 추가되었습니다.`,
    });

    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.modalOverlay}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}>
        <ScrollView
          contentContainerStyle={styles.modalScrollContent}
          keyboardShouldPersistTaps="handled">
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>➕ 아이템 추가</Text>
            {(['itemTitle', 'width', 'height', 'depth'] as NewItemField[]).map(
              (field) => (
                <TextInput
                  key={field}
                  value={newItem[field]}
                  placeholder={placeholders[field]}
                  placeholderTextColor="#ccc"
                  onChangeText={(text) =>
                    setNewItem((prev) => ({ ...prev, [field]: text }))
                  }
                  style={styles.input}
                  keyboardType={field === 'itemTitle' ? 'default' : 'numeric'}
                />
              ),
            )}
            <View style={styles.modalBtnRow}>
              <Pressable style={styles.modalBtn} onPress={handleAdd}>
                <Text>추가</Text>
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
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalScrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 10,
    marginBottom: 10,
    width: '100%',
  },
  modalBtnRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  modalBtn: {
    backgroundColor: '#eee',
    padding: 10,
    borderRadius: 6,
    width: '45%',
    alignItems: 'center',
  },
});
