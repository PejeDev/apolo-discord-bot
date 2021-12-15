import { Client, Collection, Intents } from 'discord.js';
import { AppConfig } from '@/config/AppConfig';
import { Commands } from '@/commands';
import { Command } from '@/models/Command';
import * as cmi from '@/commands/index';

class ApoloBot {
	private token: string;

	private client: Client;

	private clientId: string;

	private commandsCollection: Collection<String, Command>;

	/**
	 * Constructor.
	 */
	constructor() {
		this.token = AppConfig.botToken;
		const myIntents = new Intents();
		myIntents.add(Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_VOICE_STATES);
		this.client = new Client({
			intents: myIntents
		});
		this.clientId = AppConfig.botClientId;
		this.commandsCollection = this.commandsBuild();
	}

	/**
	 * Initialize the bot and start listening for messages on the Discord server.
	 */
	public async listen(): Promise<void> {
		try {
			this.client.on('ready', () => {
				console.warn(`Logged in as ${this.client.user.tag}!`);
			});

			const commands = new Commands(this.clientId);
			await commands.deploy();

			this.client.on('interactionCreate', async (interaction) => {
				if (!interaction.isCommand()) return;

				const command = this.commandsCollection.get(interaction.commandName);

				if (!command) return;

				try {
					await command.execute(interaction);
				} catch (error) {
					console.error(error);
					interaction.reply({
						content: 'There was an error while executing this command!',
						ephemeral: true
					});
				}
			});

			this.client.login(this.token);
		} catch (error) {
			console.error(error);
			throw new Error(error);
		}
	}

	private commandsBuild(): Collection<String, Command> {
		try {
			const cml = Object.entries(cmi);
			const commandsCollection = new Collection<String, Command>();
			cml.forEach(([_key, value]) => {
				commandsCollection.set(value.data.name, value);
			});
			return commandsCollection;
		} catch (error) {
			console.error(error);
			throw new Error(error);
		}
	}
}

const Bot = new ApoloBot();
export { Bot };
