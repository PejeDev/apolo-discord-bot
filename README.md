# ð©âð¤Apolo Discord Bot ð¤

[![uptime](https://status.pejedev.xyz/api/badge/1/uptime/24)](https://status.pejedev.xyz/status/me)
[![GPLv3 License](https://img.shields.io/badge/License-GPL%20v3-yellow.svg)](https://opensource.org/licenses/)
[![CI status](https://img.shields.io/github/workflow/status/PejeDev/apolo-discord-bot/CD)](https://github.com/PejeDev/apolo-discord-bot/actions/workflows/ci.yml)
![GitHub branch checks state](https://img.shields.io/github/checks-status/PejeDev/apolo-discord-bot/main)

Apolo is a open source discord bot in constant development, designed for private usage, many of the services integrated for this project could be private or designed for personal use. the bot is fully customizable and support the implementation of new modules to expand their they functionalities.

## Features

- ð©âð¤ Play music from urls and query search ð¤ð»
- ð©ð»âð¨ Paint AI generated images ð¤ (WIP)
- ð Monitor game server and services status ðð» (WIP)
- ð¤¡ Post memes and jokes ð (WIP)

## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

`PORT`: Server port in which the project will run

`SELF_URL`: Url in which the server is running

`DEBUG`: To enable debug functionalities

`BOT_TOKEN`: Discord bot token from discord developer console

`YT_TOKEN`: Youtube api access token

`BOT_CLIENT_ID`: Discord client id of the bot

`BOT_GUILD_ID`: Discord guild id in which the bot will be running

## Run Locally

Clone the project

```bash
  git clone https://github.com/PejeDev/apolo-discord-bot.git
```

Go to the project directory

```bash
  cd apolo-discord-bot
```

Install dependencies

```bash
  yarn install
```

Start the server

```bash
  yarn run start
```

## Authors

- [@PejeDev](https://github.com/PejeDev)

## License

[GPLv3](https://choosealicense.com/licenses/gpl-3.0/) GNU General Public License v3.0
