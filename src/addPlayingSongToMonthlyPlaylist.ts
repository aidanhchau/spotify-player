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

export default async function Command() {
  await setSpotifyClient();

  const currentlyPlayingData = await getCurrentlyPlaying();
  const currentPlaylist = currentlyPlayingData.context.uri;
  if (currentPlaylist != "spotify:playlist:5Gb7IXan8Yxr9xk8Ua9gib") {
    return await showHUD("Cannot perform this action on this playlist");
  }
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
    await showHUD(`Added ${currentlyPlayingData.item.name} to ${currentMonth}`);
  } catch (error) {
    await showHUD("Something went wrong");
    console.log("addPlayingSongToMonthlyPlaylist.ts Error:", getError(error));
  }

  // //print myPlaylistsData
  // for (let i = 0; i < myPlaylistsData.items.length; i++) {
  //   console.log(myPlaylistsData.items[i].name);
  // }
}
