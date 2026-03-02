import { Item } from '@/types';

type PresetItem = Omit<Item, 'position'>;

const ITEM_LIST: PresetItem[] = [
  {
    id: 'preset-book',
    itemTitle: '책',
    width: 14.5,
    height: 20,
    depth: 1.5,
    loadBear: 500,
  },
  {
    id: 'preset-notebook-13',
    itemTitle: '노트북 13인치',
    width: 31,
    height: 21,
    depth: 2,
    loadBear: 2000,
  },
  {
    id: 'preset-notebook-15',
    itemTitle: '노트북 15인치',
    width: 34,
    height: 23,
    depth: 2,
    loadBear: 1000,
  },
  {
    id: 'preset-tumbler',
    itemTitle: '텀블러',
    width: 7.3,
    height: 17.4,
    depth: 7.3,
    loadBear: 5000,
  },
  {
    id: 'preset-iphone-12',
    itemTitle: '아이폰 12',
    width: 7.1,
    height: 14.7,
    depth: 0.7,
    loadBear: 350,
  },
];

export { ITEM_LIST };
