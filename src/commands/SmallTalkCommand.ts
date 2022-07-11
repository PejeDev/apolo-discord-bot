import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction } from 'discord.js';
import { Command } from '@/models/Command';

const beepCommand: Command = {
  data: new SlashCommandBuilder().setName('beep').setDescription('Beep!'),
  async execute(interaction: CommandInteraction): Promise<void> {
    return interaction.reply('Boop!');
  }
};

export { beepCommand };
