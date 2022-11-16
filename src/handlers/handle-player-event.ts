import { Queue } from "discord-player";
import { AppToolkitInstances } from "../app-toolkit-instaces.type";
import { PlayerQueueMetadata } from "../commands/track-manager/track-manager.service";
import { handlePlayerTrackStart } from "./handle-player-track-start";

export const loadPlayerEventHandler = (appToolkitInstances: AppToolkitInstances) => {
  const { player } = appToolkitInstances;

  // when player starts playing a track
  player.on('botDisconnect', (queue) => queue);
  player.on('channelEmpty', (queue) => queue);
  player.on('trackAdd', (queue, track) => queue);
  // player.on('trackEnd', (queue) => handlePlayerTrackEnd());
  player.on('trackStart', (queue) => handlePlayerTrackStart(player, queue as Queue<PlayerQueueMetadata>));
  player.on('tracksAdd', (queue, tracks) => queue);
}