import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction } from 'discord.js';
import { Command } from '@/models/Command';
import { musicModule } from '@/modules/MusicModule';

const playCommand: Command = {
	data: new SlashCommandBuilder()
		.setName('play')
		.setDescription('Play a song from YouTube')
		.addStringOption((option) =>
			option
				.setName('song')
				.setDescription('The url or search query of the song to play')
				.setRequired(true)
		),
	async execute(interaction: CommandInteraction): Promise<void> {
		musicModule.play(interaction, interaction.options.getString('song'));
	}
};

const skipCommand: Command = {
	data: new SlashCommandBuilder()
		.setName('skip')
		.setDescription('Skip the current song'),
	async execute(interaction: CommandInteraction): Promise<void> {
		musicModule.skip(interaction);
	}
};

const stopCommand: Command = {
	data: new SlashCommandBuilder()
		.setName('stop')
		.setDescription('Clear the queue and stop the music'),
	async execute(interaction: CommandInteraction): Promise<void> {
		musicModule.stop(interaction);
	}
};

const leaveCommand: Command = {
	data: new SlashCommandBuilder()
		.setName('leave')
		.setDescription('Leave the voice channel'),
	async execute(interaction: CommandInteraction): Promise<void> {
		musicModule.leave(interaction);
	}
};

const pauseCommand: Command = {
	data: new SlashCommandBuilder()
		.setName('pause')
		.setDescription('Pause the music'),
	async execute(interaction: CommandInteraction): Promise<void> {
		musicModule.pause(interaction);
	}
};

const resumeCommand: Command = {
	data: new SlashCommandBuilder()
		.setName('resume')
		.setDescription('Resume the music'),
	async execute(interaction: CommandInteraction): Promise<void> {
		musicModule.resume(interaction);
	}
};

const queueCommand: Command = {
	data: new SlashCommandBuilder()
		.setName('queue')
		.setDescription('Show the current queue'),
	async execute(interaction: CommandInteraction): Promise<void> {
		musicModule.showQueue(interaction);
	}
};

export {
	playCommand,
	skipCommand,
	stopCommand,
	leaveCommand,
	pauseCommand,
	resumeCommand,
	queueCommand
};
