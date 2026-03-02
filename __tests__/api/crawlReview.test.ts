import axios from 'axios';
import { crawlReviewData } from '../../src/api/crawlReview';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('crawlReviewData', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('성공 시 response.data를 반환해야 한다', async () => {
    const mockResponse = {
      data: {
        bag: { width: 30, height: 40, depth: 15 },
      },
    };
    mockedAxios.post.mockResolvedValue(mockResponse);

    const result = await crawlReviewData('https://example.com/product');

    expect(result).toEqual(mockResponse.data);
    expect(mockedAxios.post).toHaveBeenCalledWith(
      expect.any(String),
      { url: 'https://example.com/product' },
    );
  });

  it('응답 데이터에 bag 정보가 포함되어야 한다', async () => {
    const mockData = {
      bag: { width: 25, height: 35, depth: 10 },
    };
    mockedAxios.post.mockResolvedValue({ data: mockData });

    const result = await crawlReviewData('https://example.com') as any;

    expect(result.bag).toBeDefined();
    expect(result.bag.width).toBe(25);
    expect(result.bag.height).toBe(35);
    expect(result.bag.depth).toBe(10);
  });

  it('네트워크 오류 시 throw하지 않고 error 객체를 반환해야 한다', async () => {
    const networkError = new Error('Network Error');
    mockedAxios.post.mockRejectedValue(networkError);

    // throw하지 않고 에러를 반환함 (현재 구현의 동작을 명세화)
    const result = await crawlReviewData('https://example.com');

    expect(result).toBe(networkError);
  });

  it('HTTP 에러 응답 시에도 throw하지 않고 error 객체를 반환해야 한다', async () => {
    const httpError = {
      response: { status: 500, data: { detail: '서버 오류' } },
      message: 'Request failed with status code 500',
    };
    mockedAxios.post.mockRejectedValue(httpError);

    const result = await crawlReviewData('https://example.com');

    expect(result).toBe(httpError);
  });

  it('빈 URL을 전달해도 API 호출이 이루어져야 한다 (유효성 검사 없음)', async () => {
    mockedAxios.post.mockResolvedValue({ data: {} });

    await crawlReviewData('');

    expect(mockedAxios.post).toHaveBeenCalledWith(
      expect.any(String),
      { url: '' },
    );
  });
});
