import { AppToolkitInstances } from "../app-toolkit-instaces.type";
import { handleInteractionCreate } from "./handle-interaction-create";
import { handleVoiceStateUpdate } from "./handle-voice-state-update";

export function loadEventHanler(toolkitInstances: AppToolkitInstances) {
  const { client } = toolkitInstances;
  
  client.on('voiceStateUpdate', handleVoiceStateUpdate(toolkitInstances));
  client.on('interactionCreate', handleInteractionCreate(toolkitInstances));
}