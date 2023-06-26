import { SlashCommandBuilder } from 'discord.js'
import { type CommandInteraction } from 'discord.js'
import { type Command } from '../models/command.ts'

const beepCommand: Command = {
  data: new SlashCommandBuilder().setName('beep').setDescription('Beep!'),
  async execute(interaction: CommandInteraction): Promise<void> {
    await interaction.reply('Boop!')
  },
}

export { beepCommand }
