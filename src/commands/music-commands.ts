import { SlashCommandBuilder } from 'discord.js'
import { type CommandInteraction } from 'discord.js'
import { type Command } from '../models/command.ts'
import { musicModule } from '../modules/music-module.ts'

export const playCommand: Command = {
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
    const query = interaction.options.get('song')?.value as string
    await interaction.deferReply()
    await musicModule.play(interaction, query)
  },
}

export const skipCommand: Command = {
  data: new SlashCommandBuilder()
    .setName('skip')
    .setDescription('Skip the current song'),
  async execute(interaction: CommandInteraction): Promise<void> {
    await interaction.deferReply()

    await musicModule.skip(interaction)
  },
}

export const clearCommand: Command = {
  data: new SlashCommandBuilder()
    .setName('clear')
    .setDescription('Clear the queue and stop the music'),
  async execute(interaction: CommandInteraction): Promise<void> {
    await interaction.deferReply()

    await musicModule.clear(interaction)
  },
}

export const shuffleCommand: Command = {
  data: new SlashCommandBuilder()
    .setName('shuffle')
    .setDescription('Shuffle the queue'),
  async execute(interaction: CommandInteraction): Promise<void> {
    await interaction.deferReply()

    await musicModule.shuffle(interaction)
  },
}
/* 
export const leaveCommand: Command = {
  data: new SlashCommandBuilder()
    .setName('leave')
    .setDescription('Leave the voice channel'),
  async execute(interaction: CommandInteraction): Promise<void> {
    await musicModule.leave(interaction)
  },
}

export const pauseCommand: Command = {
  data: new SlashCommandBuilder()
    .setName('pause')
    .setDescription('Pause the music'),
  async execute(interaction: CommandInteraction): Promise<void> {
    await musicModule.pause(interaction)
  },
}

export const resumeCommand: Command = {
  data: new SlashCommandBuilder()
    .setName('resume')
    .setDescription('Resume the music'),
  async execute(interaction: CommandInteraction): Promise<void> {
    await musicModule.resume(interaction)
  },
}

export const queueCommand: Command = {
  data: new SlashCommandBuilder()
    .setName('queue')
    .setDescription('Show the current queue'),
  async execute(interaction: CommandInteraction): Promise<void> {
    await musicModule.showQueue(interaction)
  },
}
 */
