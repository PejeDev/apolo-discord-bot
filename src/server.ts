import express, { Request, Response } from 'express';
import { Bot } from '@/bot';
import { AppConfig as app } from '@/config/AppConfig';

const server = express();

server.get('/api/health', (req: Request, res: Response) => {
	res.send('OK');
});

server.listen(app.port, () => {
	if (app.debug) console.warn(app);
});

Bot.listen();
