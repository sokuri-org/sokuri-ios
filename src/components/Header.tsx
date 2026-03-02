import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function Header() {
  return (
    <View style={styles.header}>
      <Text style={styles.title}>SOKURI</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingTop: 64,
    paddingBottom: 64,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontFamily: 'serif',
    letterSpacing: -0.5,
    color: '#111',
  },
  subtitle: {
    marginTop: 12,
    fontSize: 12,
    letterSpacing: 2,
    textTransform: 'uppercase',
    color: '#999',
  },
});
