import { CommandInteraction } from 'discord.js';

export interface Command {
	data: any;
	execute: (_interaction: CommandInteraction) => Promise<void>;
}
