import { REST } from "@discordjs/rest";
import { token, clientId, guildId } from './config.json'
import { Routes } from 'discord-api-types/v9';
import { commandMap } from "./commands/command.map";
import { SlashCommandBuilder } from "@discordjs/builders";

const commands = [...commandMap.values()].map(command => command.slashCommand.toJSON());

const rest = new REST({ version: '9' }).setToken(token);

rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: commands })
	.then(() => console.log('Successfully registered application commands.'))
	.catch(console.error);

// const data = new SlashCommandBuilder()
// 	.setName('echo')
// 	.setDescription('Replies with your input!')
// 	.addStringOption(option =>
// 		option.setName('input')
// 			.setDescription('The input to echo back')
// 			.setRequired(true));

//       console.log(data.toJSON());