import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useSokuriStore } from '@/store/useSokuriStore';

interface BagSizeCardProps {
  onEdit: () => void;
}

export default function BagSizeCard({ onEdit }: BagSizeCardProps) {
  const bag = useSokuriStore((s) => s.bag);

  return (
    <View style={styles.sizeCard}>
      <View style={styles.sizeRow}>
        {['가로', '세로', '폭'].map((label, i) => (
          <View key={label} style={styles.sizeBlock}>
            <Text style={styles.sizeLabel}>{label}</Text>
            <Text style={styles.sizeValue}>
              {[bag.width, bag.height, bag.depth][i]}
              <Text style={styles.unit}> cm</Text>
            </Text>
          </View>
        ))}
      </View>
      <TouchableOpacity style={styles.editSizeButton} onPress={onEdit}>
        <Text style={styles.editSizeText}>크기 변경</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  sizeCard: {
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
    padding: 16,
    marginTop: 6,
    alignItems: 'center',
  },
  sizeRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 12,
  },
  sizeBlock: {
    alignItems: 'center',
    marginBottom: 16,
    flex: 1,
  },
  sizeLabel: {
    fontSize: 12,
    color: '#999',
    marginBottom: 4,
  },
  sizeValue: {
    fontSize: 20,
    fontWeight: '300',
    color: '#222',
  },
  unit: {
    fontSize: 12,
    color: '#777',
  },
  editSizeButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  editSizeText: {
    fontSize: 14,
    color: '#333',
  },
});
