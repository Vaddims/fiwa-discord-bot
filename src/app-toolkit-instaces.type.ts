import { Player } from "discord-player";
import { Client } from "discord.js";

export interface AppToolkitInstances {
  client: Client;
  player: Player;
}