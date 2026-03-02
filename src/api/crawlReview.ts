import { CRAWL_API } from '@env';
import axios from 'axios';
import { Bag } from '@/types';

interface CrawlResponse {
  bag: Bag;
}

const API_URL = CRAWL_API;

export const crawlReviewData = async (
  url: string,
): Promise<CrawlResponse | unknown> => {
  try {
    const response = await axios.post<CrawlResponse>(API_URL, { url });
    return response.data;
  } catch (err) {
    console.error('크롤링 실패:', err);
    return err;
  }
};
