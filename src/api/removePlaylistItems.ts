/*
Author: Aidan
Created: 2024-03
*/
import { getErrorMessage } from "../helpers/getError";
import { getSpotifyClient } from "../helpers/withSpotifyClient";

type RemovePlaylistItemsProps = {
  playlistId: string;
  trackUris: string[];
};

export async function removePlaylistItems({ playlistId, trackUris }: RemovePlaylistItemsProps) {
  const { spotifyClient } = getSpotifyClient();

  try {
    const response = await spotifyClient.deletePlaylistsByPlaylistIdTracks(playlistId, {
      tracks: trackUris.map((uri) => ({ uri })),
    });
    return response;
  } catch (err) {
    const error = getErrorMessage(err);
    console.log("removeFromMySavedTracks.ts Error:", error);
    throw new Error(error);
  }
}
