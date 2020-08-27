import axios from "axios";
import { DEV_URL } from "../constants";

export default async (ids: string[]) => {
  try {
    const { data } = await axios.post(
      `${DEV_URL}/api/get/artist-info/multiple`,
      {
        ids: ids.join(","),
      }
    );
    return data;
  } catch (error) {
    console.log(error);
  }
};
