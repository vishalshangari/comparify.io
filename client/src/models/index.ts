export type APIError = {
  isError: boolean;
  status: number;
  message: string;
};

export enum DisplayPeriods {
  shortTerm = "shortTerm",
  mediumTerm = "mediumTerm",
  longTerm = "longTerm",
}
