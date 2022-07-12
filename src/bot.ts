import { Client, Collection, Intents } from 'discord.js';
import { AppConfig } from '@/config/AppConfig';
import { Commands } from '@/commands';
import { Command } from '@/models/Command';
import * as cmi from '@/commands/index';
import Logger from './utils/Logger';

class ApoloBot {
  #token: string;

  public client: Client;

  clientId: string;

  #commandsCollection: Collection<String, Command>;

  /**
   * Constructor.
   */
  constructor() {
    this.#token = AppConfig.botToken;
    const myIntents = new Intents();
    myIntents.add(Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_VOICE_STATES);
    this.client = new Client({
      intents: myIntents
    });
    this.clientId = AppConfig.botClientId;
    this.#commandsCollection = this.#initCommands();
  }

  /**
   * Initialize the bot and start listening for messages on the Discord server.
   */
  public async listen(): Promise<void> {
    try {
      this.client.on('ready', () => {
        Logger.log.info(`Logged in as ${this.client.user.tag}!`);
      });

      const commands = new Commands(this.clientId);
      await commands.deploy();

      this.client.on('interactionCreate', async (interaction) => {
        if (!interaction.isCommand()) return;

        const command = this.#commandsCollection.get(interaction.commandName);

        if (!command) return;
        interaction.deferReply();
        await command.execute(interaction);
      });

      this.client.login(this.#token);
    } catch (error) {
      Logger.log.error(error);
    }
  }

  #initCommands(): Collection<String, Command> {
    try {
      const cml = Object.entries(cmi);
      const commandsCollection = new Collection<String, Command>();
      cml.forEach(([_key, value]) => {
        commandsCollection.set(value.data.name, value);
      });
      return commandsCollection;
    } catch (error) {
      throw new Error(error);
    }
  }
}

const Bot = new ApoloBot();
export { Bot };
