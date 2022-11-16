import { Player, Queue, Track } from "discord-player";
import { CommandInteraction, Guild, GuildMember, Interaction, InteractionReplyOptions, Message, MessageActionRow, MessageEmbed, MessageSelectMenu, ReplyMessageOptions, SelectMenuInteraction, TextBasedChannel, VoiceChannel } from "discord.js";
import { TrackManagerMenuTypes, TrackManagerOptions } from "./track-manager.command";
import { MessageComponentTypes } from "discord.js/typings/enums";

export interface PlayerQueueMetadata {
  trackRequesterMap: Map<string, GuildMember>;
}

const getGuildQueue = (player: Player, guild: Guild) => {
  const queue: Queue<PlayerQueueMetadata> = 
    player.getQueue(guild) ||
    player.createQueue(guild, {
      metadata: {
        trackRequesterMap: new Map<string, GuildMember>(),
      }
    });

  return queue;
}

export const addTrack = async (interaction: CommandInteraction, player: Player) => {
  const { guild, member } = interaction;

  if (!guild) {
    return await interaction.reply("This command can only be used in a server.");
  }

  if (!(member instanceof GuildMember)) {
    return await interaction.reply("Internal error: member is not a GuildMember");
  }

  if (!member.voice.channel) {
    await interaction.reply("You must be in a voice channel to use this command.");
    return;
  }

  const query = interaction.options.getString(TrackManagerOptions.Query);
  if (!query) {
    return await interaction.reply("Query must be provided.");
  }

  interaction.deferReply();
  
  const { tracks, playlist } = await player.search(query, {
    requestedBy: member.user,
  });

  if (tracks.length === 0 && !playlist) {
    return await interaction.followUp("Nothing found.");
  }

  const queue = getGuildQueue(player, guild);

  if (playlist) {
    queue.addTracks(playlist.tracks);
    for (const track of playlist.tracks) {
      queue.metadata?.trackRequesterMap.set(track.id, member);
    }

    const previewTracks = playlist.tracks.slice(0, 5);
    await interaction.followUp({
      embeds: [{
        color: 0xf3680c,
        title: playlist.title,
        description: `Added ${playlist.tracks.length} tracks to the queue.`,
        fields: [{
          name: 'Some of the tracks:',
          value: previewTracks.map(track => `- ${track.title}`).join('\n')
        }],
        footer: {
          text: `© ${interaction.client.user!.username}`,
          iconURL: interaction.client.user!.displayAvatarURL(),
        },
        timestamp: new Date(),
      }],
    });
  } else {
    let track: Track = tracks[0];
    let interactionMessage: Message;
    
    if (tracks.length > 1) {
      const previewTracks = tracks.slice(0, 5);
      interactionMessage = await interaction.followUp({
        content: `**Multiple tracks found. Select a track to add to the queue.**`,
        components: [
          new MessageActionRow()
          .addComponents(
            new MessageSelectMenu()
            .setCustomId(TrackManagerMenuTypes.SelectTrack)
            .setPlaceholder('Select a track')
            .setOptions(previewTracks.map(track => ({
              label: track.title,
              description: track.author,
              value: track.id,
            })))
          )]
      }) as Message;

      try {
        const componentInteraction = await interactionMessage.awaitMessageComponent({ time: 60000, componentType: MessageComponentTypes.SELECT_MENU });
        const selectedTrack = tracks.find(track => track.id === componentInteraction.values[0]);
        if (!selectedTrack) {
          return void await componentInteraction.reply("Something went wrong.\nErr: Track component value not found in tracks array.");
        }

        await interactionMessage.delete();

        track = selectedTrack;
      } catch {
        return void await interactionMessage.reply("No track selected. Nothing added to the queue.");
      }
    }

    queue.addTrack(track);
    queue.metadata?.trackRequesterMap.set(track.id, member);
    const interactionReplyOptions: InteractionReplyOptions & ReplyMessageOptions = {
      embeds: [{
        color: 0xf3680c,
        title: track.title,
        description: `Added ${track.author} - ${track.title} to the queue.`,
        timestamp: new Date(),
        footer: {
          text: `© ${interaction.client.user!.username}`,
          iconURL: interaction.client.user!.displayAvatarURL(),
        },
      }]
    }

    if (tracks.length === 1) {
      await interaction.followUp(interactionReplyOptions)
    } else {
      await interactionMessage!.channel.send(interactionReplyOptions);
    }
  }
  
  if (!queue.connection || queue.connection.channel !== member.voice.channel) {
    await queue.connect(member.voice.channel);
  }

  if (!queue.playing) {
    await queue.play();
  }
}












export function skipTrack(interaction: CommandInteraction, player: Player) {
  const { guild } = interaction;

  if (!guild) {
    return interaction.reply("This command can only be used in a server.");
  }

  const queue = player.getQueue(guild);
  if (!queue) {
    return interaction.reply("No queue found.");
  }

  queue.skip();
  interaction.reply("Skipped.");
}










export function clearTracks(interaction: CommandInteraction, player: Player) {
  const { guild } = interaction;

  if (!guild) {
    return interaction.reply("This command can only be used in a server.");
  }

  const queue = player.getQueue(guild);
  if (!queue) {
    return interaction.reply("No queue found.");
  }

  queue.destroy(true);
}


export function handle() {

}