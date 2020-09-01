import { UserInfo } from "../Comparify";

export type ObscurityComparisonDataType = {
  visitor: number;
  creator: number;
};

export type ObscurityComparisonProps = {
  obscurityComparisonData: null | ObscurityComparisonDataType;
  creatorUserInfo: UserInfo;
  visitorUserInfo: UserInfo;
};
