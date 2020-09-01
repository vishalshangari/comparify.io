import { FeatureScores } from "../PersonalData";

export type DisplayedAudioFeatureKeys =
  | "valence"
  | "energy"
  | "danceability"
  | "tempo";

export type FeatureProps = {
  shortTerm: number;
  mediumTerm: number;
  longTerm: number;
};
export type AudioFeatureProps = {
  scores: FeatureScores;
};
