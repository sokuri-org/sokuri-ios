/**
 * @format
 */
import React from 'react';
import ReactTestRenderer from 'react-test-renderer';

// Animated 타이밍 문제 우회 (RN 0.73 jest 환경)
jest.useFakeTimers();

import App from '../App';

test('renders correctly', async () => {
  await ReactTestRenderer.act(async () => {
    ReactTestRenderer.create(<App />);
  });

  // 모든 타이머 실행 후 정리
  await ReactTestRenderer.act(async () => {
    jest.runAllTimers();
  });
});
