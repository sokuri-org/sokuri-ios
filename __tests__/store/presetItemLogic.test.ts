import { Bag, Item } from '../../src/types';
import { ITEM_LIST } from '../../src/constants';

/**
 * PresetItemList의 아이템 추가 가능 여부 판단 로직 추출
 * 원본: PresetItemList.tsx의 addItemToWebView() 내부 로직
 */
function canAddItemToBag(item: Pick<Item, 'width' | 'height' | 'depth'>, bag: Bag | null): boolean {
  const w = parseFloat(String(item.width));
  const h = parseFloat(String(item.height));
  const d = parseFloat(String(item.depth));

  if (!bag || isNaN(w) || isNaN(h) || isNaN(d)) return false;

  return !(w > bag.width || h > bag.height || d > bag.depth);
}

describe('PresetItemList 필터링 로직', () => {
  describe('canAddItemToBag', () => {
    const largeBag: Bag = { width: 50, height: 50, depth: 50 };
    const smallBag: Bag = { width: 10, height: 10, depth: 10 };
    const zeroBag: Bag = { width: 0, height: 0, depth: 0 };

    it('가방보다 작은 아이템은 추가 가능해야 한다', () => {
      expect(
        canAddItemToBag({ width: 5, height: 5, depth: 5 }, largeBag),
      ).toBe(true);
    });

    it('가방과 정확히 같은 크기의 아이템은 추가 가능해야 한다', () => {
      expect(
        canAddItemToBag({ width: 50, height: 50, depth: 50 }, largeBag),
      ).toBe(true);
    });

    it('너비가 가방보다 큰 아이템은 추가 불가해야 한다', () => {
      expect(
        canAddItemToBag({ width: 51, height: 5, depth: 5 }, largeBag),
      ).toBe(false);
    });

    it('높이가 가방보다 큰 아이템은 추가 불가해야 한다', () => {
      expect(
        canAddItemToBag({ width: 5, height: 51, depth: 5 }, largeBag),
      ).toBe(false);
    });

    it('깊이가 가방보다 큰 아이템은 추가 불가해야 한다', () => {
      expect(
        canAddItemToBag({ width: 5, height: 5, depth: 51 }, largeBag),
      ).toBe(false);
    });

    it('bag이 null이면 추가 불가해야 한다', () => {
      expect(
        canAddItemToBag({ width: 5, height: 5, depth: 5 }, null),
      ).toBe(false);
    });

    it('bag이 {0,0,0}이면 모든 양수 아이템이 추가 불가해야 한다', () => {
      expect(
        canAddItemToBag({ width: 1, height: 1, depth: 1 }, zeroBag),
      ).toBe(false);
    });
  });

  describe('프리셋 아이템 vs 가방 크기', () => {
    it('큰 가방(50x50x50)에는 모든 프리셋 아이템이 들어가야 한다', () => {
      const largeBag: Bag = { width: 50, height: 50, depth: 50 };

      ITEM_LIST.forEach((item) => {
        expect(canAddItemToBag(item, largeBag)).toBe(true);
      });
    });

    it('작은 가방(5x5x5)에는 아이폰만 깊이(0.7cm)가 맞지만 너비(7.1cm)가 초과한다', () => {
      const tinyBag: Bag = { width: 5, height: 5, depth: 5 };

      ITEM_LIST.forEach((item) => {
        expect(canAddItemToBag(item, tinyBag)).toBe(false);
      });
    });

    it('노트북 15인치(34x23x2)는 너비 30cm 가방에 들어가지 않아야 한다', () => {
      const mediumBag: Bag = { width: 30, height: 30, depth: 30 };
      const notebook15 = ITEM_LIST.find((i) => i.id === 'preset-notebook-15');

      expect(notebook15).toBeDefined();
      expect(canAddItemToBag(notebook15!, mediumBag)).toBe(false);
    });
  });

  describe('ITEM_LIST 상수 무결성', () => {
    it('5개의 프리셋 아이템이 있어야 한다', () => {
      expect(ITEM_LIST).toHaveLength(5);
    });

    it('모든 프리셋 아이템은 고유 ID를 가져야 한다', () => {
      const ids = ITEM_LIST.map((item) => item.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(ids.length);
    });

    it('모든 프리셋 아이템의 치수는 양수여야 한다', () => {
      ITEM_LIST.forEach((item) => {
        expect(item.width).toBeGreaterThan(0);
        expect(item.height).toBeGreaterThan(0);
        expect(item.depth).toBeGreaterThan(0);
        expect(item.loadBear).toBeGreaterThan(0);
      });
    });

    it('모든 프리셋 아이템은 itemTitle이 있어야 한다', () => {
      ITEM_LIST.forEach((item) => {
        expect(item.itemTitle).toBeTruthy();
        expect(item.itemTitle.length).toBeGreaterThan(0);
      });
    });
  });
});
