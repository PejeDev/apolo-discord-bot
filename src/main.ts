import express, { type Request, type Response } from 'express'
import { AppConfig as app } from './config/app-config.ts'
import { logger } from './utils/logger.ts'
import { bot } from './bot.ts'

const server = express()

server.get('/api/health', (req: Request, res: Response) => {
  res.send('OK')
})

server.listen(app.port, () => {
  if (app.debug) logger.info(JSON.stringify(app))
})

process.on('unhandledRejection', (error: Error) => {
  logger.unsuccessful('😭 Unexpecter error', error.message, error.stack)
})

await bot.listen()
