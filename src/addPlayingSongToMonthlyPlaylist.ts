/*
Author: Aidan
Created: 2024-03
*/
import { showHUD } from "@raycast/api";
import { setSpotifyClient } from "./helpers/withSpotifyClient";
import { getCurrentlyPlaying } from "./api/getCurrentlyPlaying";
import { addToPlaylist } from "./api/addToPlaylist";
import { getError } from "./helpers/getError";
import { getUserPlaylists } from "./api/getUserPlaylists";
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
    return await showHUD("Cannot add episodes to monthly playlist");
  }

  const myPlaylistsData = await getUserPlaylists();

  //gets current month in format "YYYY-MM"
  const currentMonth = new Date().toISOString().slice(0, 7);
  const currentMonthPlaylist = myPlaylistsData.items.find((playlist) => playlist.name === currentMonth);
  const currentMonthPlaylistId = currentMonthPlaylist.id;

  try {
    await addToPlaylist({
      playlistId: currentMonthPlaylistId,
      trackUris: [currentlyPlayingData.item.uri],
    });
    await showHUD(`Added ${currentlyPlayingData.item.name} to ${currentMonthPlaylist.name}`);

    if (currentPlaylist == `spotify:playlist:${processingPlaylistId}`) {
      // If listening in Processing, remove from Processing playlist
      await removePlaylistItems({
        playlistId: currentPlaylist.split(":")[2],
        trackUris: [currentlyPlayingData.item.uri],
      });
      await showHUD(`Removed ${currentlyPlayingData.item.name} from Processing`);
    }
  } catch (error) {
    await showHUD("Something went wrong");
    console.log("addPlayingSongToMonthlyPlaylist.ts Error:", getError(error));
  }
}
