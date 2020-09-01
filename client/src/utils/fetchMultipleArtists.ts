import axios from "axios";
import { DEV_URL } from "../constants";

export default async (ids: string[]) => {
  if (!Array.isArray(ids) || !ids.length) {
    return null;
  }
  try {
    const { data } = await axios.get(
      `${DEV_URL}/api/get/artist-info/multiple`,
      {
        params: { ids: ids.join(",") },
      }
    );
    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
