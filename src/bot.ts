import { Client, Events, GatewayIntentBits } from 'discord.js'
import { AppConfig } from './config/app-config.ts'
import { logger } from './utils/logger.ts'
import { commands, deployCommands } from './commands.ts'
import { Player } from 'discord-player'
import { initPlayerEvents } from './events/player-events.ts'

export interface Bot {
  client: Client<true>
  listen: () => Promise<void>
}

export const bot: Bot = {
  client: new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates],
  }),
  async listen(): Promise<void> {
    const player = Player.singleton(bot.client, {
      ytdlOptions: {
        requestOptions: {
          headers: {
            cookie: AppConfig.ytCookie,
            'x-youtube-identity-token': AppConfig.ytToken,
          },
        },
      },
    })
    await player.extractors.loadDefault()

    await initPlayerEvents(player)

    this.client.once(Events.ClientReady, async (c: Client<true>) => {
      await c.application.commands.set([])
      logger.success(`Ready! Logged in as ${c.user.tag}`)
      await deployCommands()
    })
    this.client.on(Events.InteractionCreate, async (interaction) => {
      if (!interaction.isChatInputCommand()) return
      const command = commands.get(interaction.commandName)
      if (command) {
        await command.execute(interaction)
      }
    })
    await this.client.login(AppConfig.botToken)
  },
}
