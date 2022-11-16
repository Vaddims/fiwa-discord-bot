import { Interaction } from "discord.js";
import { AppToolkitInstances } from "../app-toolkit-instaces.type";
import { commandMap, selectMenuMap } from "../commands/command.map";

export function handleInteractionCreate(appToolkitInstances: AppToolkitInstances) {
  return function(interaction: Interaction) {
    if (interaction.isCommand()) {
      commandMap.get(interaction.commandName)?.controller({
        appToolkitInstances,
        interaction,
      });
    }

    if (interaction.isSelectMenu()) {
      selectMenuMap.get(interaction.customId)?.selectMenuController?.({
        appToolkitInstances,
        interaction,
      });
    }
  }
}