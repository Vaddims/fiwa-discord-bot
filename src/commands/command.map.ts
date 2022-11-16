import * as Commands from '.';
import { Command } from "./command.type";

export const commandMap = new Map<string, Command>();
export const selectMenuMap = new Map<string, Command>();
for (const command of Object.values(Commands)) {
  commandMap.set(command.slashCommand.name, command);
  if (command.selectMenuTypes) {
    for (const selectMenuType of command.selectMenuTypes) {
      selectMenuMap.set(selectMenuType, command);
    }
  }
}