import pino from 'pino';
import pretty from 'pino-pretty';
import { Bot } from '@/bot';
import Discord from 'discord.js';

class Logger {
  public log: pino.Logger;

  constructor() {
    const stream = pretty({
      colorize: true,
      translateTime: 'SYS:standard',
      ignore: 'hostname,pid'
    });

    this.log = pino(stream);
  }

  public async sendToErrorLog(error: Error): Promise<void> {
    const channel = (await Bot.client.channels.fetch(
      '995947537909428284'
    )) as Discord.TextChannel;
    const message = `๐งจ **${error.name}** \n\n ๐ฌ **Msg:** ${error.message}\n\n ๐ฅ **Stack:**\n  \`${error.stack}\``;
    channel.send(message);
  }
}

export default new Logger();
