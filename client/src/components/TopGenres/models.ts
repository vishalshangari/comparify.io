import { TopGenresDataType } from "../PersonalData";
export type TopGenresProps = {
  data: null | TopGenresDataType;
};
export type CurrentDisplayDataStateType = keyof TopGenresDataType;
