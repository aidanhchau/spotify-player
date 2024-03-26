import { showHUD } from "@raycast/api";
import { setSpotifyClient } from "./helpers/withSpotifyClient";
import { getCurrentlyPlaying } from "./api/getCurrentlyPlaying";
import { skipToNext } from "./api/skipToNext";
import { removePlaylistItems } from "./api/removePlaylistItems";

const processingPlaylistId = "5Gb7IXan8Yxr9xk8Ua9gib"; // get this from the url of the playlist

export default async function Command() {
  await setSpotifyClient();

  const currentlyPlayingData = await getCurrentlyPlaying();
  const currentPlaylist = currentlyPlayingData.context.uri;
  const nothingIsPlaying = !currentlyPlayingData || !currentlyPlayingData?.item;
  const isTrack = currentlyPlayingData?.currently_playing_type !== "episode";

  if (nothingIsPlaying) {
    return await showHUD("Nothing is currently playing");
  }

  if (!isTrack) {
    return await showHUD("Liking episodes is not supported yet");
  }

  try {
    await skipToNext();
    await showHUD("Skipped to next");

    if (currentPlaylist == `spotify:playlist:${processingPlaylistId}`) {
      // If listening in Processing, remove from Processing playlist
      await removePlaylistItems({
        playlistId: currentPlaylist.split(":")[2],
        trackUris: [currentlyPlayingData.item.uri],
      });
      await showHUD(`Skipped & Removed ${currentlyPlayingData.item.name} from Processing`);
    }
  } catch (error) {
    await showHUD("Nothing is currently playing");
  }
}
