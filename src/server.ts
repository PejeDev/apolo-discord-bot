import express, { Request, Response } from 'express';
import { Bot } from '@/bot';
import { AppConfig as app } from '@/config/AppConfig';
import Logger from '@/utils/Logger';

const server = express();

server.get('/api/health', (req: Request, res: Response) => {
  res.send('OK');
});

server.listen(app.port, () => {
  if (app.debug) Logger.log.info(app);
});

process.on('unhandledRejection', (error: Error) => {
  Logger.log.error(error);
  Logger.sendToErrorLog(error);
});

Bot.listen();
