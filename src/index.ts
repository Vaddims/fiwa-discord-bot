import { Client, Intents } from 'discord.js';
import { token } from './config.json';
import { loadEventHanler } from './handlers/handle-event';
import { loadPlayerEventHandler } from './handlers/handle-player-event';
import { Player } from 'discord-player';
import './deploy-commands';

const client = new Client({intents: [
  Intents.FLAGS.GUILD_VOICE_STATES,
  Intents.FLAGS.GUILDS,
]});

const player = new Player(client, {
  ytdlOptions: {
    filter: 'audioonly',
    highWaterMark: 1 << 25,
    quality: 'highestaudio',
  }
});

loadEventHanler({ client, player });
loadPlayerEventHandler({ client, player });

client.login(token);