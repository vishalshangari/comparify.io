import { UserInfo } from "../Comparify";

export type AudioFeaturesComparisonProps = {
  audioFeaturesComparisonData: null | AudioFeaturesComparisonDataType;
  creatorUserInfo: UserInfo;
  visitorUserInfo: UserInfo;
};

export type AudioFeatureDataForComparison = {
  visitor: number[];
  creator: number[];
};

export type AudioFeaturesComparisonDataType = {
  valence: AudioFeatureDataForComparison;
  energy: AudioFeatureDataForComparison;
  danceability: AudioFeatureDataForComparison;
  tempo: AudioFeatureDataForComparison;
};

export type AudioFeaturesState = keyof AudioFeaturesComparisonDataType;
