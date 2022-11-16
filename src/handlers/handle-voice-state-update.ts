import { Client, VoiceState } from "discord.js";
import { AppToolkitInstances } from "../app-toolkit-instaces.type";
import { customVoiceRoomManager } from "../middleware/services/custom-voice-room-manager";

export function handleVoiceStateUpdate(toolkitInstances: AppToolkitInstances) {
  return function(oldState: VoiceState, newState: VoiceState) {
    customVoiceRoomManager(oldState, newState);
  }
}