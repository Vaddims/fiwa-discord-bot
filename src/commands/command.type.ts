import { SlashCommandSubcommandsOnlyBuilder } from "@discordjs/builders";
import { CommandInteraction, Interaction, SelectMenuInteraction } from "discord.js";
import { AppToolkitInstances } from "../app-toolkit-instaces.type";


export interface CommandControllerOptions<T extends Interaction> {
  appToolkitInstances: AppToolkitInstances,
  interaction: T,
}

export type Controller<T extends Interaction> = (options: CommandControllerOptions<T>) => void;
export type CommandController = Controller<CommandInteraction>;
export type SelectMenuController = Controller<SelectMenuInteraction>;

export interface Command {
  readonly slashCommand: SlashCommandSubcommandsOnlyBuilder;
  readonly controller: CommandController;
  readonly selectMenuTypes?: string[];
  readonly selectMenuController?: SelectMenuController;
}