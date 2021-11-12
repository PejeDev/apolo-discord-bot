import dotenv from 'dotenv';
import * as pjson from '../../package.json';

dotenv.config();

const AppConfig = {
	name: pjson.name,
	port: parseInt(process.env.PORT, 10),
	version: pjson.version,
	selfUrl: process.env.SELF_URL,
	debug: process.env.DEBUG === 'TRUE',
	botToken: process.env.BOT_TOKEN
};

export { AppConfig };
