import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import ArchiveIcon from '@/assets/images/archive.svg';
import BagIcon from '@/assets/images/bag.svg';
import BoxIcon from '@/assets/images/box.svg';

type TabType = 'items' | 'size' | 'preset';

interface SimulateTabBarProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
}

export default function SimulateTabBar({
  activeTab,
  setActiveTab,
}: SimulateTabBarProps) {
  return (
    <View style={styles.tabRow}>
      <TouchableOpacity
        style={[styles.tabButton, activeTab === 'items' && styles.activeTab]}
        onPress={() => setActiveTab('items')}>
        <BoxIcon
          width={32}
          height={32}
          color={activeTab === 'items' ? '#6E5AE3' : '#999'}
        />
        <Text
          style={[styles.tabText, activeTab === 'items' && styles.activeText]}>
          현재 아이템
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.tabButton, activeTab === 'size' && styles.activeTab]}
        onPress={() => setActiveTab('size')}>
        <BagIcon
          width={32}
          height={32}
          color={activeTab === 'size' ? '#6E5AE3' : '#999'}
        />
        <Text
          style={[styles.tabText, activeTab === 'size' && styles.activeText]}>
          가방 사이즈
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.tabButton, activeTab === 'preset' && styles.activeTab]}
        onPress={() => setActiveTab('preset')}>
        <ArchiveIcon
          width={32}
          height={32}
          color={activeTab === 'preset' ? '#6E5AE3' : '#999'}
        />
        <Text
          style={[styles.tabText, activeTab === 'preset' && styles.activeText]}>
          기본 아이템
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  tabRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#ddd',
  },
  tabButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '300',
    color: '#999',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderColor: '#ffcd4a',
  },
  activeText: {
    color: '#E9A319',
    fontWeight: '600',
  },
});
