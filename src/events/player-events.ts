import { type Player } from 'discord-player'
import { logger } from '../utils/logger.ts'

export const initPlayerEvents = async (player: Player): Promise<void> => {
  player.on('debug', async (message) => {
    logger.debug(`General player debug event: ${message}`)
  })
  player.events.on('error', (_queue: any, error) => {
    logger.error(`General player error event: ${error.message}`, error.stack)
  })

  player.events.on('playerStart', (queue: any, track) => {
    // Emitted when the player starts to play a song
    queue.metadata.send(`Started playing: **${track.title}**`)
  })

  player.events.on('audioTrackAdd', (queue: any, track) => {
    // Emitted when the player adds a single song to its queue
    queue.metadata.send(`Track **${track.title}** queued`)
  })

  player.events.on('audioTracksAdd', (queue: any, _track) => {
    // Emitted when the player adds multiple songs to its queue
    queue.metadata.send(`Multiple Track's queued`)
  })

  player.events.on('playerSkip', (queue: any, track) => {
    // Emitted when the audio player fails to load the stream for a song
    queue.metadata.send(`Skipping **${track.title}** due to an issue!`)
  })

  player.events.on('disconnect', (queue: any) => {
    // Emitted when the bot leaves the voice channel
    queue.metadata.send('Looks like my job here is done, leaving now!')
  })
  player.events.on('emptyChannel', (queue: any) => {
    // Emitted when the voice channel has been empty for the set threshold
    // Bot will automatically leave the voice channel with this event
    queue.metadata.send(`Leaving because no vc activity for the past 5 minutes`)
  })
  player.events.on('emptyQueue', (queue: any) => {
    // Emitted when the player queue has finished
    queue.metadata.send('Queue finished!')
  })
}
