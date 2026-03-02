import { create } from 'zustand';
import {
  createSimulatorSlice,
  SimulatorSlice,
} from '../../src/store/simulatorSlice';
import { createUiSlice, UiSlice } from '../../src/store/uiSlice';
import { Item, Bag, Position } from '../../src/types';

type TestStore = SimulatorSlice & UiSlice;

const createTestStore = () =>
  create<TestStore>((...a) => ({
    ...createSimulatorSlice(...a),
    ...createUiSlice(...a),
  }));

const mockItem = (overrides?: Partial<Item>): Item => ({
  id: 'test-1',
  itemTitle: '테스트 아이템',
  width: 10,
  height: 5,
  depth: 3,
  loadBear: 100,
  position: { x: 0, y: 0, z: 0 },
  ...overrides,
});

const mockWebViewRef = () => ({
  current: {
    postMessage: jest.fn(),
    // WebView 인터페이스를 만족시키기 위한 최소 필드
  } as any,
});

// ─── 초기 상태 ───

describe('simulatorSlice', () => {
  describe('초기 상태', () => {
    it('bag은 {width:0, height:0, depth:0}이어야 한다', () => {
      const store = createTestStore();
      expect(store.getState().bag).toEqual({ width: 0, height: 0, depth: 0 });
    });

    it('items는 빈 배열이어야 한다', () => {
      const store = createTestStore();
      expect(store.getState().items).toEqual([]);
    });

    it('selectedItem은 null이어야 한다', () => {
      const store = createTestStore();
      expect(store.getState().selectedItem).toBeNull();
    });

    it('shouldAddBagToWebView는 false이어야 한다', () => {
      const store = createTestStore();
      expect(store.getState().shouldAddBagToWebView).toBe(false);
    });

    it('editItemDims는 빈 문자열이어야 한다', () => {
      const store = createTestStore();
      expect(store.getState().editItemDims).toEqual({
        w: '',
        h: '',
        d: '',
      });
    });
  });

  // ─── addItem ───

  describe('addItem', () => {
    it('아이템을 items 배열에 추가해야 한다', () => {
      const store = createTestStore();
      const item = mockItem();

      store.getState().addItem(item);

      expect(store.getState().items).toHaveLength(1);
      expect(store.getState().items[0]).toEqual(item);
    });

    it('여러 아이템을 순서대로 추가해야 한다', () => {
      const store = createTestStore();
      const item1 = mockItem({ id: 'item-1', itemTitle: '첫번째' });
      const item2 = mockItem({ id: 'item-2', itemTitle: '두번째' });

      store.getState().addItem(item1);
      store.getState().addItem(item2);

      expect(store.getState().items).toHaveLength(2);
      expect(store.getState().items[0].id).toBe('item-1');
      expect(store.getState().items[1].id).toBe('item-2');
    });

    it('[버그 문서화] 동일 ID로 추가하면 중복 아이템이 생긴다', () => {
      const store = createTestStore();
      const item1 = mockItem({ id: 'same-id' });
      const item2 = mockItem({ id: 'same-id', itemTitle: '중복' });

      store.getState().addItem(item1);
      store.getState().addItem(item2);

      // 현재 구현: 중복 ID 체크 없이 둘 다 추가됨
      const sameIdItems = store
        .getState()
        .items.filter((i) => i.id === 'same-id');
      expect(sameIdItems).toHaveLength(2);
    });
  });

  // ─── removeItem / removeItemByIdWithWebView ───

  describe('removeItem', () => {
    it('해당 ID의 아이템을 제거해야 한다', () => {
      const store = createTestStore();
      store.getState().addItem(mockItem({ id: 'to-remove' }));
      store.getState().addItem(mockItem({ id: 'to-keep' }));

      const ref = mockWebViewRef();
      store.getState().removeItem('to-remove', ref);

      expect(store.getState().items).toHaveLength(1);
      expect(store.getState().items[0].id).toBe('to-keep');
    });

    it('WebView에 REMOVE_ITEM 메시지를 전송해야 한다', () => {
      const store = createTestStore();
      store.getState().addItem(mockItem({ id: 'item-1' }));

      const ref = mockWebViewRef();
      store.getState().removeItem('item-1', ref);

      expect(ref.current.postMessage).toHaveBeenCalledWith(
        JSON.stringify({ action: 'REMOVE_ITEM', data: { id: 'item-1' } }),
      );
    });

    it('webViewRef가 null이어도 에러 없이 아이템을 제거해야 한다', () => {
      const store = createTestStore();
      store.getState().addItem(mockItem({ id: 'item-1' }));

      store.getState().removeItem('item-1', null);

      expect(store.getState().items).toHaveLength(0);
    });

    it('존재하지 않는 ID를 제거해도 에러가 발생하지 않아야 한다', () => {
      const store = createTestStore();
      store.getState().addItem(mockItem({ id: 'item-1' }));

      const ref = mockWebViewRef();
      store.getState().removeItem('non-existent', ref);

      expect(store.getState().items).toHaveLength(1);
    });
  });

  describe('removeItemByIdWithWebView', () => {
    it('removeItem과 동일하게 아이템을 제거하고 메시지를 전송해야 한다', () => {
      const store = createTestStore();
      store.getState().addItem(mockItem({ id: 'item-1' }));

      const ref = mockWebViewRef();
      store.getState().removeItemByIdWithWebView('item-1', ref);

      expect(store.getState().items).toHaveLength(0);
      expect(ref.current.postMessage).toHaveBeenCalledWith(
        JSON.stringify({ action: 'REMOVE_ITEM', data: { id: 'item-1' } }),
      );
    });
  });

  // ─── updateItemPosition ───

  describe('updateItemPosition', () => {
    it('올바른 ID의 아이템 position만 업데이트해야 한다', () => {
      const store = createTestStore();
      store.getState().addItem(mockItem({ id: 'a', position: { x: 0, y: 0, z: 0 } }));
      store.getState().addItem(mockItem({ id: 'b', position: { x: 0, y: 0, z: 0 } }));

      const newPos: Position = { x: 5, y: 10, z: 15 };
      store.getState().updateItemPosition('a', newPos);

      expect(store.getState().items[0].position).toEqual(newPos);
      expect(store.getState().items[1].position).toEqual({ x: 0, y: 0, z: 0 });
    });

    it('존재하지 않는 ID를 업데이트해도 에러가 발생하지 않아야 한다', () => {
      const store = createTestStore();
      store.getState().addItem(mockItem({ id: 'item-1' }));

      store.getState().updateItemPosition('non-existent', { x: 1, y: 2, z: 3 });

      // 기존 아이템은 변경되지 않아야 한다
      expect(store.getState().items[0].position).toEqual({ x: 0, y: 0, z: 0 });
    });
  });

  // ─── updateItemSizeWithWebView ───

  describe('updateItemSizeWithWebView', () => {
    it('아이템의 크기를 변경해야 한다', () => {
      const store = createTestStore();
      store.getState().addItem(mockItem({ id: 'item-1', width: 10, height: 5, depth: 3 }));

      const ref = mockWebViewRef();
      const newSize = { width: 20, height: 15, depth: 8 };
      store.getState().updateItemSizeWithWebView('item-1', newSize, ref);

      const updated = store.getState().items[0];
      expect(updated.width).toBe(20);
      expect(updated.height).toBe(15);
      expect(updated.depth).toBe(8);
    });

    it('WebView에 UPDATE_ITEM_SIZE와 RENDER_PACKING 메시지를 보내야 한다', () => {
      const store = createTestStore();
      store.getState().addItem(mockItem({ id: 'item-1' }));
      store.getState().setBag({ width: 50, height: 50, depth: 50 });

      const ref = mockWebViewRef();
      const newSize = { width: 20, height: 15, depth: 8 };
      store.getState().updateItemSizeWithWebView('item-1', newSize, ref);

      // 두 번 호출: UPDATE_ITEM_SIZE + RENDER_PACKING
      expect(ref.current.postMessage).toHaveBeenCalledTimes(2);

      const firstCall = JSON.parse(ref.current.postMessage.mock.calls[0][0]);
      expect(firstCall.action).toBe('UPDATE_ITEM_SIZE');

      const secondCall = JSON.parse(ref.current.postMessage.mock.calls[1][0]);
      expect(secondCall.action).toBe('RENDER_PACKING');
    });

    it('webViewRef가 null이어도 크기는 변경되어야 한다', () => {
      const store = createTestStore();
      store.getState().addItem(mockItem({ id: 'item-1' }));

      store.getState().updateItemSizeWithWebView(
        'item-1',
        { width: 99, height: 99, depth: 99 },
        null,
      );

      expect(store.getState().items[0].width).toBe(99);
    });

    it('다른 아이템의 크기는 변경되지 않아야 한다', () => {
      const store = createTestStore();
      store.getState().addItem(mockItem({ id: 'a', width: 10 }));
      store.getState().addItem(mockItem({ id: 'b', width: 20 }));

      store.getState().updateItemSizeWithWebView(
        'a',
        { width: 99, height: 99, depth: 99 },
        null,
      );

      expect(store.getState().items[1].width).toBe(20);
    });
  });

  // ─── setBag / setBagSize ───

  describe('setBag / setBagSize', () => {
    it('setBag이 bag을 올바르게 설정해야 한다', () => {
      const store = createTestStore();
      const newBag: Bag = { width: 30, height: 40, depth: 20 };

      store.getState().setBag(newBag);

      expect(store.getState().bag).toEqual(newBag);
    });

    it('setBagSize가 setBag과 동일하게 동작해야 한다', () => {
      const store1 = createTestStore();
      const store2 = createTestStore();
      const bag: Bag = { width: 25, height: 35, depth: 15 };

      store1.getState().setBag(bag);
      store2.getState().setBagSize(bag);

      expect(store1.getState().bag).toEqual(store2.getState().bag);
    });
  });

  // ─── setSelectedItem ───

  describe('setSelectedItem', () => {
    it('전체 Item 객체를 저장해야 한다', () => {
      const store = createTestStore();
      const item = mockItem();

      store.getState().setSelectedItem(item);

      expect(store.getState().selectedItem).toEqual(item);
    });

    it('null로 설정하여 선택을 해제할 수 있어야 한다', () => {
      const store = createTestStore();
      store.getState().setSelectedItem(mockItem());

      store.getState().setSelectedItem(null);

      expect(store.getState().selectedItem).toBeNull();
    });
  });

  // ─── shouldAddBagToWebView ───

  describe('shouldAddBagToWebView', () => {
    it('true로 설정할 수 있어야 한다', () => {
      const store = createTestStore();

      store.getState().setShouldAddBagToWebView(true);

      expect(store.getState().shouldAddBagToWebView).toBe(true);
    });

    it('false로 리셋할 수 있어야 한다', () => {
      const store = createTestStore();
      store.getState().setShouldAddBagToWebView(true);

      store.getState().setShouldAddBagToWebView(false);

      expect(store.getState().shouldAddBagToWebView).toBe(false);
    });
  });

  // ─── editItemDims ───

  describe('setEditItemDims / setEditItemDimsField', () => {
    it('전체 dims를 설정할 수 있어야 한다', () => {
      const store = createTestStore();

      store.getState().setEditItemDims({ w: '10', h: '20', d: '30' });

      expect(store.getState().editItemDims).toEqual({
        w: '10',
        h: '20',
        d: '30',
      });
    });

    it('개별 필드를 업데이트할 수 있어야 한다', () => {
      const store = createTestStore();
      store.getState().setEditItemDims({ w: '10', h: '20', d: '30' });

      store.getState().setEditItemDimsField('w', '99');

      expect(store.getState().editItemDims).toEqual({
        w: '99',
        h: '20',
        d: '30',
      });
    });
  });

  // ─── setItems ───

  describe('setItems', () => {
    it('items 배열을 직접 교체해야 한다', () => {
      const store = createTestStore();
      store.getState().addItem(mockItem({ id: 'old' }));

      const newItems = [
        mockItem({ id: 'new-1' }),
        mockItem({ id: 'new-2' }),
      ];
      store.getState().setItems(newItems);

      expect(store.getState().items).toHaveLength(2);
      expect(store.getState().items[0].id).toBe('new-1');
    });
  });

  // ─── updateItemSize (non-WebView variant) ───

  describe('updateItemSize', () => {
    it('아이템 크기를 변경하고 UPDATE_ITEM_SIZE만 전송해야 한다 (RENDER_PACKING 없음)', () => {
      const store = createTestStore();
      store.getState().addItem(mockItem({ id: 'item-1' }));

      const ref = mockWebViewRef();
      store.getState().updateItemSize(
        'item-1',
        { width: 50, height: 50, depth: 50 },
        ref,
      );

      expect(store.getState().items[0].width).toBe(50);
      expect(ref.current.postMessage).toHaveBeenCalledTimes(1);

      const call = JSON.parse(ref.current.postMessage.mock.calls[0][0]);
      expect(call.action).toBe('UPDATE_ITEM_SIZE');
    });
  });
});
