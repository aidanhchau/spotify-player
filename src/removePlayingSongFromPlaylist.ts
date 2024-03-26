/*
Author: Aidan
Created: 2024-03
*/
import { showHUD } from "@raycast/api";
import { setSpotifyClient } from "./helpers/withSpotifyClient";
import { getCurrentlyPlaying } from "./api/getCurrentlyPlaying";
import { getError } from "./helpers/getError";
import { removePlaylistItems } from "./api/removePlaylistItems";
import { getPlaylistById } from "./api/getPlaylistsById";

export default async function Command() {
  await setSpotifyClient();

  const currentlyPlayingData = await getCurrentlyPlaying();
  const nothingIsPlaying = !currentlyPlayingData || !currentlyPlayingData?.item;
  const isTrack = currentlyPlayingData?.currently_playing_type !== "episode";

  if (nothingIsPlaying) {
    return await showHUD("Nothing is currently playing");
  }

  if (!isTrack) {
    return await showHUD("Cannot remove episodes from playlist");
  }

  const currentPlaylistUri = currentlyPlayingData.context.uri;
  const currentPlaylistType = currentPlaylistUri.split(":")[1];
  if (currentPlaylistType !== "playlist") {
    return await showHUD(`Cannot remove songs from non-playlist (${currentPlaylistType})`);
  }
  const currentPlaylist = await getPlaylistById({ playlistId: currentPlaylistUri.split(":")[2] });

  try {
    await removePlaylistItems({
      playlistId: currentPlaylist.id,
      trackUris: [currentlyPlayingData.item.uri],
    });
    await showHUD(`Removed ${currentlyPlayingData.item.name} from ${currentPlaylist.name}`);
  } catch (error) {
    await showHUD("Something went wrong");
    console.log("removePlayingSongFromPlaylist.ts Error:", getError(error));
  }
}
