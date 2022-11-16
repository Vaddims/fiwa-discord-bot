import { Player, Queue } from "discord-player";
import { PlayerQueueMetadata } from "../commands/track-manager/track-manager.service";

export function handlePlayerTrackStart(player: Player, queue: Queue<PlayerQueueMetadata>) {
  const { current: currentTrack } = queue;
  const requestedBy = queue.metadata?.trackRequesterMap.get(currentTrack.id);
  if (!requestedBy) {
    queue.skip();
    return;
  }
}