import React, { useState, useRef, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';
import AddItemModal from '@/components/AddItemModal';
import EditBagModal from '@/components/EditBagModal';
import EditItemModal from '@/components/EditItemModal';
import BagSizeCard from '@/screens/BagSize/BagSizeCard';
import ItemList from '@/screens/ItemList';
import PresetItemList from '@/screens/ItemList/PresetItemList';
import SimulateTabBar from '@/screens/Simulate/SimulateTabBar';
import WebSimulator from '@/screens/Simulate/WebSimulator';
import { useSokuriStore } from '@/store/useSokuriStore';

type TabType = 'items' | 'size' | 'preset';

export default function Simulate() {
  const webViewRef = useRef<WebView | null>(null);
  const [webViewReady, setWebViewReady] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('items');
  const [modalVisible, setModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editBagModalVisible, setEditBagModalVisible] = useState(false);

  const bag = useSokuriStore((s) => s.bag);
  const items = useSokuriStore((s) => s.items);
  const shouldAddBagToWebView = useSokuriStore((s) => s.shouldAddBagToWebView);

  useEffect(() => {
    if (
      shouldAddBagToWebView &&
      activeTab === 'items' &&
      webViewReady &&
      webViewRef.current &&
      bag?.width
    ) {
      webViewRef.current.postMessage(
        JSON.stringify({
          action: 'RENDER_PACKING',
          data: { bag, items },
        }),
      );
    }
  }, [activeTab, bag, items, webViewReady, shouldAddBagToWebView]);

  return (
    <View style={styles.container}>
      <View style={styles.topSection}>
        <WebSimulator
          ref={webViewRef}
          onLoadReady={() => setWebViewReady(true)}
        />
        <SimulateTabBar activeTab={activeTab} setActiveTab={setActiveTab} />
      </View>

      <View style={styles.bottomSection}>
        {activeTab === 'items' && (
          <ItemList
            webViewRef={webViewRef}
            openModal={() => setModalVisible(true)}
            openEditModal={() => setEditModalVisible(true)}
          />
        )}

        {activeTab === 'size' && (
          <BagSizeCard onEdit={() => setEditBagModalVisible(true)} />
        )}

        {activeTab === 'preset' && <PresetItemList webViewRef={webViewRef} />}
      </View>

      <AddItemModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        webViewRef={webViewRef}
      />
      <EditItemModal
        visible={editModalVisible}
        onClose={() => setEditModalVisible(false)}
        webViewRef={webViewRef}
      />
      <EditBagModal
        visible={editBagModalVisible}
        onClose={() => setEditBagModalVisible(false)}
        webViewRef={webViewRef}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topSection: {
    flex: 7,
  },
  bottomSection: {
    flex: 3,
    padding: 12,
  },
});
