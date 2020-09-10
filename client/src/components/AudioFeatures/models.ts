import { FeatureScores } from "../PersonalData";

export type FeatureProps = {
  shortTerm: number;
  mediumTerm: number;
  longTerm: number;
};
export type AudioFeatureProps = {
  scores: FeatureScores;
};
