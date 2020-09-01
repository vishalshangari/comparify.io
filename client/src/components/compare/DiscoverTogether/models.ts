import { ComparisonData } from "../Comparify";
import { LoadedArtist } from "../../TopArtists";
import { LoadedTrack } from "../../TopTracks";

export type DiscoverTogetherProps = {
  genresComparison: null | ComparisonData<string>;
  artistsComparison: null | ComparisonData<string>;
  tracksComparison: null | ComparisonData<string>;
};
