module.exports = {
  preset: 'react-native',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@env$': '<rootDir>/__mocks__/@env.ts',
    '\\.svg$': '<rootDir>/__mocks__/svgMock.js',
  },
  transformIgnorePatterns: [
    'node_modules/(?!(react-native|@react-native|react-native-webview|react-native-svg|react-native-toast-message|react-native-swipe-list-view|zustand|nanoid)/)',
  ],
  testPathIgnorePatterns: ['<rootDir>/node_modules/'],
};
