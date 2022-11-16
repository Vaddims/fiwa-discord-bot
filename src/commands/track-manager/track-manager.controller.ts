import { CommandController } from '../command.type';
import { TrackManagerCommandTypes } from './track-manager.command';
import { addTrack, skipTrack, clearTracks } from './track-manager.service';

export const trackManagerController: CommandController = (options) => {
  const { appToolkitInstances, interaction } = options;
  const { player } = appToolkitInstances;

  switch(interaction.options.getSubcommand(true)) {
    case TrackManagerCommandTypes.Add:
      addTrack(interaction, player);
      break;

    case TrackManagerCommandTypes.Skip:
      skipTrack(interaction, player);
      break;

    case TrackManagerCommandTypes.Clear:
      clearTracks(interaction, player);
      break;
  }
}