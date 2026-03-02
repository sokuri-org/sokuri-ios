import axios from 'axios';
import { Bag, Item } from '@/types';

interface TransformedItem {
  itemName: string;
  itemIndex: number;
  itemScaleX: number;
  itemScaleY: number;
  itemScaleZ: number;
  itemW: number;
  itemH: number;
  itemD: number;
  loadBear: number;
}

interface PackingResult {
  bag: unknown;
  placements: unknown;
}

export const simulatePacking = async (
  bag: Bag,
  items: Item[],
): Promise<PackingResult> => {
  const transformedItems: TransformedItem[] = items.map((item, index) => ({
    itemName: item.itemTitle,
    itemIndex: index,
    itemScaleX: 1,
    itemScaleY: 1,
    itemScaleZ: 1,
    itemW: item.width,
    itemH: item.height,
    itemD: item.depth,
    loadBear: 1000,
  }));

  try {
    const res = await axios.post<PackingResult>(
      'http://192.168.200.178:8000/pack',
      {
        bag: [bag.width, bag.height, bag.depth],
        items: transformedItems,
      },
    );
    return res?.data;
  } catch (error) {
    console.error(
      '시뮬레이션 API 실패:',
      (error as any)?.response?.data ||
        (error as any).message ||
        error,
    );
    return {
      bag: null,
      placements: null,
    };
  }
};
