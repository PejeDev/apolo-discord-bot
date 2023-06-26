import 'dotenv/config'

const token = process.env.BOT_TOKEN ?? ''

export interface Config {
  botToken: string
  botId: string
  port: number
  debug: boolean
  botGuildId: string
  ytCookie: string
  ytToken: string
}

export const AppConfig: Config = {
  botToken: token,
  botId: process.env.BOT_ID ?? '',
  port: 3000,
  debug: process.env.DEBUG === 'true',
  botGuildId: process.env.BOT_GUILD_ID ?? '',
  ytCookie: process.env.YT_COOKIE ?? '',
  ytToken: process.env.YT_TOKEN ?? '',
}
