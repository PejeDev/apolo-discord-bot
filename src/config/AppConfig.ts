import dotenv from 'dotenv';
import * as pjson from '../../package.json';

dotenv.config();

const AppConfig = {
	name: pjson.name,
	port: parseInt(process.env.PORT, 10),
	version: pjson.version,
	selfUrl: process.env.SELF_URL,
	debug: process.env.DEBUG === 'TRUE',
	botToken: process.env.BOT_TOKEN,
	ytToken: process.env.YT_TOKEN,
	botClientId: process.env.BOT_CLIENT_ID,
	botGuildId: process.env.BOT_GUILD_ID
};

export { AppConfig };
