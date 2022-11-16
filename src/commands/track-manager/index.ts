import { Command } from '../command.type';
import { trackManagerSlashCommand } from './track-manager.command';
import { trackManagerController } from './track-manager.controller';

export const trackManager: Command = {
  slashCommand: trackManagerSlashCommand,
  controller: trackManagerController,
};