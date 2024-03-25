import { showHUD } from "@raycast/api";
import { setSpotifyClient } from "./helpers/withSpotifyClient";
import { skipToNext } from "./api/skipToNext";
import { getCurrentlyPlaying } from "./api/getCurrentlyPlaying";

export default async function Command() {
  await setSpotifyClient();

  const currentlyPlayingData = await getCurrentlyPlaying();

  try {
    await skipToNext();
    await showHUD(`Skipped to ${currentlyPlayingData?.item.name}`);
  } catch (error) {
    await showHUD("Something went wrong");
  }
}
