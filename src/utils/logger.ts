import chalk from 'chalk'
import os from 'os'

const hostname = os.hostname() ?? 'unknown'
const preAppend = `[${hostname}] [${
  process.pid
}] [${new Date().toLocaleString()}]:`

export const logger = {
  info: (message: string) => {
    console.info(chalk.blueBright(`${preAppend} 🐙 info: ${message}`))
  },
  error: (message: string, trace?: string) => {
    console.error(
      chalk.redBright(
        `${preAppend} ‼️ error: ${message}, trace: ${trace ?? ''}`
      )
    )
  },
  debug: (message: string) => {
    console.debug(chalk.magenta(`${preAppend} 🐛 debug: ${message}`))
  },
  warn: (message: string) => {
    console.warn(chalk.yellowBright(`${preAppend} ⚠️ warn: ${message}`))
  },
  bot: (message: string) => {
    console.log(chalk.cyanBright(`${preAppend} 🤖 bot: ${message}`))
  },
  success: (message: string) => {
    console.log(chalk.greenBright(`${preAppend} ✅ success: ${message}`))
  },
  unsuccessful: (message: string, error?: string, trace?: string) => {
    console.log(chalk.redBright(`${preAppend} ❌ unsuccessful: ${message}`))
    if (error != null) logger.error(error, trace)
  },
}
