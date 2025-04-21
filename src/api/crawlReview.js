import { CRAWL_API } from "@env";
import axios from "axios";

const API_URL = CRAWL_API;

export const crawlReviewData = async (url) => {
  try {
    const response = await axios.post(API_URL, { url });
    return response.data;
  } catch (err) {
    console.error("크롤링 실패:", err);
    return err;
  }
};
