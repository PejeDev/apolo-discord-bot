import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v9';
import { AppConfig } from '@/config/AppConfig';
import * as cmi from '@/commands/index';
import Logger from '@/utils/Logger';

class Commands {
  public commands: any;

  public clientId: string;

  public guildId: string;

  constructor(clientId: string) {
    this.clientId = clientId;
    this.guildId = AppConfig.botGuildId;
    this.commands = this.#buildCommands();
  }

  public async deploy() {
    const rest = new REST({ version: '9' }).setToken(AppConfig.botToken);
    Logger.log.info('Deploying commands...');
    await rest.put(
      Routes.applicationGuildCommands(this.clientId, this.guildId),
      {
        body: this.commands
      }
    );
  }

  #buildCommands(): any {
    const jsonCommands: any = [];
    const cml = Object.entries(cmi);
    cml.forEach(([_key, value]) => {
      jsonCommands.push(value.data.toJSON());
    });
    return jsonCommands;
  }
}

export { Commands };
