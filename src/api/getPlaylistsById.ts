/*
Author: Aidan
Created: 2024-03
*/
import { getErrorMessage } from "../helpers/getError";
import { getSpotifyClient } from "../helpers/withSpotifyClient";

type GetPlaylistByIdProps = { playlistId: string };

export async function getPlaylistById({ playlistId }: GetPlaylistByIdProps) {
  const { spotifyClient } = getSpotifyClient();
  try {
    const response = await spotifyClient.getPlaylistsByPlaylistId(playlistId);
    return response;
  } catch (err) {
    const error = getErrorMessage(err);
    console.log("getPlaylistById.ts Error:", error);
    throw new Error(error);
  }
}
