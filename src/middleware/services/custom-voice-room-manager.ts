import { CategoryChannel, GuildMember, Permissions, VoiceChannel, VoiceState } from "discord.js";
import { ChannelTypes } from "discord.js/typings/enums";

interface MemberVoiceChannelBind {
  member: GuildMember;
  voiceChannel: VoiceChannel;
}

let customChannelCategory: CategoryChannel | null = null;
const memberVoiceChannelBinds: MemberVoiceChannelBind[] = [];

export async function customVoiceRoomManager(oldState: VoiceState, newState: VoiceState) {
  const oldChannel = oldState.channel;
  const newChannel = newState.channel;
  const member = newState.member;

  if (!member) {
    return;
  }

  if (oldChannel === newChannel) {
    return;
  }

  if (newChannel && newChannel.id === '736918581744500766') {
    const voiceChannelBind = memberVoiceChannelBinds.find(bind => bind.member === member);
    if (voiceChannelBind) {
      await member.voice.setChannel(voiceChannelBind.voiceChannel);
    } else {
      if (!customChannelCategory) {
        customChannelCategory = await newChannel.guild.channels.create(`🏢 ┇Комнаты`, {
          type: ChannelTypes.GUILD_CATEGORY,
          position: 0,
        });
      }

      const username = newState.member?.nickname || newState.member?.user.username || 'Неизвестного';

      const voiceChannel = await newChannel.guild.channels.create(`Комната ${username}`, {
        type: ChannelTypes.GUILD_VOICE,
        parent: customChannelCategory,
        permissionOverwrites: [{
          id: member.id,
          allow: [
            Permissions.FLAGS.MANAGE_CHANNELS,
            Permissions.FLAGS.CREATE_INSTANT_INVITE,
            Permissions.FLAGS.DEAFEN_MEMBERS,
            Permissions.FLAGS.MOVE_MEMBERS,
            Permissions.FLAGS.PRIORITY_SPEAKER,
            Permissions.FLAGS.MANAGE_ROLES,
          ],
        }]
      });
  
      memberVoiceChannelBinds.push({
        member,
        voiceChannel
      });
  
      await member.voice.setChannel(voiceChannel);
    }
  }

  const oldVoiceChannelBind = memberVoiceChannelBinds.find(bind => bind.voiceChannel.id === oldChannel?.id);
  if (oldChannel && customChannelCategory && oldVoiceChannelBind && oldChannel.members.size === 0) {
    if (newChannel?.id !== '736918581744500766') {
      memberVoiceChannelBinds.splice(memberVoiceChannelBinds.indexOf(oldVoiceChannelBind), 1);
      await oldChannel.delete();
  
      if (customChannelCategory) {
        if (customChannelCategory.children.size === 0) {
          await customChannelCategory.delete();
          customChannelCategory = null;
        }
      }
    } else {
      member.voice.setChannel(oldChannel);
    }
  }
}