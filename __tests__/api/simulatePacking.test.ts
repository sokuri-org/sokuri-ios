import axios from 'axios';
import { simulatePacking } from '../../src/api/simulatePacking';
import { Bag, Item } from '../../src/types';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

const mockBag: Bag = { width: 30, height: 40, depth: 20 };

const mockItems: Item[] = [
  {
    id: 'item-1',
    itemTitle: '책',
    width: 14.5,
    height: 20,
    depth: 1.5,
    loadBear: 500,
    position: { x: 0, y: 0, z: 0 },
  },
  {
    id: 'item-2',
    itemTitle: '텀블러',
    width: 7.3,
    height: 17.4,
    depth: 7.3,
    loadBear: 5000,
    position: { x: 0, y: 0, z: 0 },
  },
];

describe('simulatePacking', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('성공 시 패킹 결과를 반환해야 한다', async () => {
    const mockResult = {
      bag: [30, 40, 20],
      placements: [{ itemIndex: 0, x: 0, y: 0, z: 0 }],
    };
    mockedAxios.post.mockResolvedValue({ data: mockResult });

    const result = await simulatePacking(mockBag, mockItems);

    expect(result).toEqual(mockResult);
  });

  it('bag을 [width, height, depth] 배열로 변환하여 전송해야 한다', async () => {
    mockedAxios.post.mockResolvedValue({ data: {} });

    await simulatePacking(mockBag, mockItems);

    const callPayload = mockedAxios.post.mock.calls[0][1] as any;
    expect(callPayload.bag).toEqual([30, 40, 20]);
  });

  it('items를 서버 형식으로 변환해야 한다 (itemName, itemW/H/D)', async () => {
    mockedAxios.post.mockResolvedValue({ data: {} });

    await simulatePacking(mockBag, mockItems);

    const callPayload = mockedAxios.post.mock.calls[0][1] as any;
    const transformedItem = callPayload.items[0];

    expect(transformedItem.itemName).toBe('책');
    expect(transformedItem.itemIndex).toBe(0);
    expect(transformedItem.itemW).toBe(14.5);
    expect(transformedItem.itemH).toBe(20);
    expect(transformedItem.itemD).toBe(1.5);
    expect(transformedItem.itemScaleX).toBe(1);
  });

  it('[동작 명세화] loadBear는 항상 1000으로 하드코딩되어 전송된다', async () => {
    mockedAxios.post.mockResolvedValue({ data: {} });

    await simulatePacking(mockBag, mockItems);

    const callPayload = mockedAxios.post.mock.calls[0][1] as any;
    // 원본 아이템의 loadBear(500)가 아닌 1000으로 보냄
    expect(callPayload.items[0].loadBear).toBe(1000);
    // 원본 아이템의 loadBear(5000)도 1000으로 보냄
    expect(callPayload.items[1].loadBear).toBe(1000);
  });

  it('API 실패 시 throw하지 않고 { bag: null, placements: null }을 반환해야 한다', async () => {
    mockedAxios.post.mockRejectedValue(new Error('Connection refused'));

    const result = await simulatePacking(mockBag, mockItems);

    expect(result).toEqual({ bag: null, placements: null });
  });

  it('빈 items 배열도 처리해야 한다', async () => {
    mockedAxios.post.mockResolvedValue({ data: { bag: [], placements: [] } });

    const result = await simulatePacking(mockBag, []);

    expect(mockedAxios.post).toHaveBeenCalled();
    const callPayload = mockedAxios.post.mock.calls[0][1] as any;
    expect(callPayload.items).toEqual([]);
  });
});
