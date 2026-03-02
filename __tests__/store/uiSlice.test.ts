import { create } from 'zustand';
import {
  createSimulatorSlice,
  SimulatorSlice,
} from '../../src/store/simulatorSlice';
import { createUiSlice, UiSlice } from '../../src/store/uiSlice';
import { Screen } from '../../src/types';

type TestStore = SimulatorSlice & UiSlice;

const createTestStore = () =>
  create<TestStore>((...a) => ({
    ...createSimulatorSlice(...a),
    ...createUiSlice(...a),
  }));

describe('uiSlice', () => {
  // ─── 초기 상태 ───

  describe('초기 상태', () => {
    it('currentScreen은 "main"이어야 한다', () => {
      const store = createTestStore();
      expect(store.getState().currentScreen).toBe('main');
    });

    it('menuVisible은 false이어야 한다', () => {
      const store = createTestStore();
      expect(store.getState().menuVisible).toBe(false);
    });
  });

  // ─── setCurrentScreen ───

  describe('setCurrentScreen', () => {
    it.each<Screen>(['main', 'sizeSummary', 'simulation'])(
      '"%s"로 화면을 전환할 수 있어야 한다',
      (screen) => {
        const store = createTestStore();

        store.getState().setCurrentScreen(screen);

        expect(store.getState().currentScreen).toBe(screen);
      },
    );

    it('같은 화면으로 다시 설정해도 에러가 없어야 한다', () => {
      const store = createTestStore();

      store.getState().setCurrentScreen('main');
      store.getState().setCurrentScreen('main');

      expect(store.getState().currentScreen).toBe('main');
    });
  });

  // ─── setMenuVisible / toggleMenuVisible ───

  describe('setMenuVisible', () => {
    it('true로 설정할 수 있어야 한다', () => {
      const store = createTestStore();

      store.getState().setMenuVisible(true);

      expect(store.getState().menuVisible).toBe(true);
    });

    it('false로 설정할 수 있어야 한다', () => {
      const store = createTestStore();
      store.getState().setMenuVisible(true);

      store.getState().setMenuVisible(false);

      expect(store.getState().menuVisible).toBe(false);
    });
  });

  describe('toggleMenuVisible', () => {
    it('false → true로 토글해야 한다', () => {
      const store = createTestStore();

      store.getState().toggleMenuVisible();

      expect(store.getState().menuVisible).toBe(true);
    });

    it('true → false로 토글해야 한다', () => {
      const store = createTestStore();
      store.getState().setMenuVisible(true);

      store.getState().toggleMenuVisible();

      expect(store.getState().menuVisible).toBe(false);
    });

    it('연속 토글이 올바르게 동작해야 한다', () => {
      const store = createTestStore();

      store.getState().toggleMenuVisible(); // true
      store.getState().toggleMenuVisible(); // false
      store.getState().toggleMenuVisible(); // true

      expect(store.getState().menuVisible).toBe(true);
    });
  });
});
