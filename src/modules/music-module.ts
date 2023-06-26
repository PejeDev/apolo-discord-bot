import {
  type GuildVoiceChannelResolvable,
  type CommandInteraction,
} from 'discord.js'
import { type Song } from '../models/music.ts'

import { useMasterPlayer, useQueue } from 'discord-player'

export const musicModule = {
  queue: [] as Song[],
  async play(interaction: CommandInteraction, args: string): Promise<void> {
    const player = useMasterPlayer()
    await interaction.editReply('Playing song...')
    const voiceChannel = await this.getVoiceChannel(interaction)
    if (voiceChannel === null || typeof voiceChannel === 'undefined') {
      await interaction.editReply('You need to be in a voice channel')
      return
    }
    if (player === null) {
      await interaction.editReply('Player has not been initialized...')
      return
    }

    await player.play(voiceChannel, args, {
      nodeOptions: {
        metadata: interaction.channel,
      },
    })
  },
  async skip(interaction: CommandInteraction): Promise<void> {
    await interaction.editReply('Skipping song...')
    const queue = useQueue(interaction.guildId ?? '')
    queue?.node.skip()
  },
  async shuffle(interaction: CommandInteraction): Promise<void> {
    await interaction.editReply('Shuffling queue...')
    const queue = useQueue(interaction.guildId ?? '')
    queue?.tracks.shuffle()
  },
  async clear(interaction: CommandInteraction): Promise<void> {
    await interaction.editReply('Clearing queue...')
    const queue = useQueue(interaction.guildId ?? '')
    queue?.clear()
  },
  async getVoiceChannel(
    interaction: CommandInteraction
  ): Promise<GuildVoiceChannelResolvable | undefined | null> {
    const memberId = interaction.member?.user.id ?? ''
    const member = interaction.guild?.members.cache.get(memberId)
    return member?.voice.channel
  },
}
