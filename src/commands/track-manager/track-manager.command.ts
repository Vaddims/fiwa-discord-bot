import { SlashCommandBuilder, SlashCommandSubcommandBuilder } from "@discordjs/builders";

export enum TrackManagerCommandTypes {
  Add = "add",
  Remove = "remove",
  Skip = "skip",
  Pause = "pause",
  Resume = "resume",
  Clear = "clear",
}

export enum TrackManagerOptions {
  Query = "query",
}

export const enum TrackManagerMenuTypes {
  SelectTrack = 'select-track',
}

export const trackManagerSlashCommand = new SlashCommandBuilder()
  .setName('track')
  .setDescription('Manage the queue.')
  .addSubcommand((subcommand) => subcommand
    .setName(TrackManagerCommandTypes.Add)
    .setDescription('start a track')
    .addStringOption((option) => option
      .setName(TrackManagerOptions.Query)
      .setDescription('the track to start')
      .setRequired(true)
    ))
  .addSubcommand((subcommand) => subcommand
    .setName(TrackManagerCommandTypes.Skip)
    .setDescription('Skip the current truck'))
  .addSubcommand((subcommand) => subcommand
    .setName(TrackManagerCommandTypes.Clear)
    .setDescription('Clear all the tracks'))
