import React, { useEffect } from 'react';
import { View, Text } from 'react-native';
import ARBridge from './src/native/ARBridge';

export default function App() {
  useEffect(() => {
    ARBridge.getDeviceInfo((err, result) => {
    if (result) {
      console.log('✅ ARBridge 응답:', result);
    }

    throw err.message;
    });
  }, []);
  return (
    <View>
      <Text>소쿠리 앱 실행!</Text>
    </View>
  );
}
