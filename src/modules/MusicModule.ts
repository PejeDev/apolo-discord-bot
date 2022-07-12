import {
  AudioPlayer,
  AudioPlayerStatus,
  createAudioPlayer,
  createAudioResource,
  DiscordGatewayAdapterCreator,
  joinVoiceChannel,
  VoiceConnection
} from '@discordjs/voice';
import {
  CommandInteraction,
  Guild,
  GuildMember,
  StageChannel,
  VoiceChannel
} from 'discord.js';
import ytdl from 'ytdl-core';
import { Song } from '@/models/Music';
import Logger from '@/utils/Logger';

class MusicModule {
  public queue: Song[];

  public player: AudioPlayer;

  public connection: VoiceConnection;

  public member: GuildMember;

  public guild: Guild;

  public voiceChannel: VoiceChannel | StageChannel;

  public channel: any;

  constructor() {
    this.queue = [];
    this.player = createAudioPlayer();

    this.player.on(AudioPlayerStatus.Idle, async () => {
      try {
        this.queue.shift();
        if (this.queue.length === 0) {
          return this.channel.send('No more songs in the queue!');
        }
        const asset = ytdl(this.queue[0].url, {
          quality: 'highestaudio',
          filter: 'audioonly'
        });
        const source = createAudioResource(asset);
        await this.player.play(source);
        return this.channel.send(`Now playing: ${this.queue[0].title}`);
      } catch (error) {
        return Logger.log.error(error);
      }
    });
  }

  public async play(
    interaction: CommandInteraction,
    args: string
  ): Promise<void> {
    try {
      if (!this.connection) {
        await this.initializeConnection(interaction);
      } else {
        await this.initializeInteractionData(interaction);
      }
      if (!this.voiceChannel) {
        interaction.editReply(
          'You need to be in a voice channel to play music!'
        );
        return;
      }

      const permissions = this.voiceChannel.permissionsFor(
        interaction.client.user
      );

      if (!permissions.has('CONNECT') || !permissions.has('SPEAK')) {
        interaction.editReply(
          'I need the permissions to join and speak in your voice channel!'
        );
        return;
      }

      const songInfo = await ytdl.getInfo(args);
      const song: Song = {
        title: songInfo.videoDetails.title,
        url: songInfo.videoDetails.video_url,
        requester: this.member.nickname || this.member.user.username,
        channel: interaction.channel.id
      };

      if (this.queue.length === 0) {
        this.queue.push(song);
        this.playSong(interaction, song);
        return;
      }
      this.queue.push(song);
      interaction.editReply(`Added ${song.title} to the queue!`);
    } catch (error) {
      Logger.log.info(interaction);
      await interaction.editReply('la baba ye');
    }
  }

  public async skip(interaction: CommandInteraction): Promise<void> {
    try {
      if (!this.voiceChannel) {
        interaction.editReply(
          'You need to be in a voice channel to skip the music!'
        );
        return;
      }
      this.queue.shift();
      if (this.queue.length === 0) {
        interaction.editReply('There is no song in the queue!');
      }
      this.playSong(interaction, this.queue[0]);
      return;
    } catch (error) {
      interaction.editReply(`Failed to skip: ${error}`);
    }
  }

  public async stop(interaction: CommandInteraction): Promise<void> {
    try {
      if (!this.voiceChannel) {
        interaction.editReply(
          'You need to be in a voice channel to stop the music!'
        );
        return;
      }
      this.queue = [];
      this.player.stop();
      interaction.editReply('Stopped the music and cleared the queue!');
    } catch (error) {
      interaction.editReply(`Failed to stop: ${error}`);
    }
  }

  public async resume(interaction: CommandInteraction): Promise<void> {
    try {
      if (!this.voiceChannel) {
        interaction.editReply('You need to be in a voice channel to resume!');
        return;
      }
      this.player.unpause();
      interaction.editReply('Resumed the music!');
    } catch (error) {
      interaction.editReply(`Failed to resume: ${error}`);
    }
  }

  public async pause(interaction: CommandInteraction): Promise<void> {
    try {
      if (!this.voiceChannel) {
        interaction.editReply('You need to be in a voice channel to pause!');
        return;
      }
      this.player.pause();
      interaction.editReply('Paused the music!');
    } catch (error) {
      interaction.editReply(`Failed to pause: ${error}`);
    }
  }

  public async leave(interaction: CommandInteraction): Promise<void> {
    try {
      if (!this.voiceChannel) {
        interaction.editReply('You need to be in a voice channel to leave!');
        return;
      }
      this.queue = [];
      this.player.stop();
      this.player.removeAllListeners();
      this.connection.destroy();
      this.connection = undefined;
      interaction.editReply('Left the voice channel!');
    } catch (error) {
      interaction.editReply(`Failed to leave: ${error}`);
    }
  }

  public async showQueue(interaction: CommandInteraction): Promise<void> {
    if (this.queue.length === 0) {
      interaction.editReply('There is no song in the queue!');
    } else {
      const queue = this.queue.map(
        (song, index) => `${index + 1}. ${song.title}`
      );
      interaction.editReply(`Current queue: \n${queue.join('\n')}`);
    }
  }

  private async playSong(
    interaction: CommandInteraction,
    song: any
  ): Promise<void> {
    try {
      const stream = ytdl(song.url, {
        quality: 'highestaudio',
        filter: 'audioonly'
      });
      const resource = createAudioResource(stream);
      await this.player.play(resource);

      interaction.editReply(`Now playing: ${song.title}`);
      return;
    } catch (error) {
      interaction.editReply(`Failed to play song: ${error}`);
    }
  }

  private async initializeInteractionData(
    interaction: CommandInteraction
  ): Promise<void> {
    this.guild = interaction.client.guilds.cache.get(interaction.guildId);
    this.member = this.guild.members.cache.get(interaction.member.user.id);
    this.voiceChannel = this.member.voice.channel;
    this.channel = await interaction.client.channels.fetch(
      interaction.channelId
    );
  }

  private async initializeConnection(
    interaction: CommandInteraction
  ): Promise<void> {
    await this.initializeInteractionData(interaction);
    this.connection = joinVoiceChannel({
      channelId: this.member.voice.channel.id,
      guildId: interaction.guildId,
      adapterCreator: this.guild
        .voiceAdapterCreator as unknown as DiscordGatewayAdapterCreator
    });
    await this.connection.subscribe(this.player);
  }
}

const musicModule = new MusicModule();

export { musicModule };
