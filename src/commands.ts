import { REST } from '@discordjs/rest'
import { Routes } from '@discordjs/core'
import { AppConfig } from './config/app-config.ts'
import * as cmi from './commands/index.ts'
import { logger } from './utils/logger.ts'
import { Collection } from 'discord.js'
import { type Command } from './models/command.ts'

export const commands: Collection<string, Command> = buildCommands()

function buildCommands(): Collection<string, Command> {
  const cml = Object.entries(cmi)
  const commandsCollection = new Collection<string, Command>()
  cml.forEach(([_key, value]) => {
    commandsCollection.set(value.data.name, value)
  })
  return commandsCollection
}

function buildJsonCommands(): any {
  const jsonCommands: any = []
  const cml = Object.entries(cmi)
  cml.forEach(([_key, value]) => {
    jsonCommands.push(value.data.toJSON())
  })
  return jsonCommands
}

export async function deployCommands(): Promise<void> {
  const rest = new REST({ version: '10' }).setToken(AppConfig.botToken)
  const commands = buildJsonCommands()
  logger.info('Deploying commands...')
  await rest.put(
    Routes.applicationGuildCommands(AppConfig.botId, AppConfig.botGuildId),
    {
      body: commands,
    }
  )
  logger.success('Deployed commands!')
}
