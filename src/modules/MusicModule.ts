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
        return console.error(error);
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
        return interaction.reply(
          'You need to be in a voice channel to play music!'
        );
      }

      const permissions = this.voiceChannel.permissionsFor(
        interaction.client.user
      );

      if (!permissions.has('CONNECT') || !permissions.has('SPEAK')) {
        return interaction.reply(
          'I need the permissions to join and speak in your voice channel!'
        );
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
        return this.playSong(interaction, song);
      }
      this.queue.push(song);
      return interaction.reply(`Added ${song.title} to the queue!`);
    } catch (error) {
      return interaction.reply(`Failed to initialize connection: ${error}`);
    }
  }

  public async skip(interaction: CommandInteraction): Promise<void> {
    try {
      if (!this.voiceChannel) {
        return interaction.reply(
          'You need to be in a voice channel to skip the music!'
        );
      }
      this.queue.shift();
      if (this.queue.length === 0) {
        interaction.reply('There is no song in the queue!');
      }
      return this.playSong(interaction, this.queue[0]);
    } catch (error) {
      return interaction.reply(`Failed to skip: ${error}`);
    }
  }

  public async stop(interaction: CommandInteraction): Promise<void> {
    try {
      if (!this.voiceChannel) {
        return interaction.reply(
          'You need to be in a voice channel to stop the music!'
        );
      }
      this.queue = [];
      this.player.stop();
      return interaction.reply('Stopped the music and cleared the queue!');
    } catch (error) {
      return interaction.reply(`Failed to stop: ${error}`);
    }
  }

  public async resume(interaction: CommandInteraction): Promise<void> {
    try {
      if (!this.voiceChannel) {
        return interaction.reply(
          'You need to be in a voice channel to resume!'
        );
      }
      this.player.unpause();
      return interaction.reply('Resumed the music!');
    } catch (error) {
      return interaction.reply(`Failed to resume: ${error}`);
    }
  }

  public async pause(interaction: CommandInteraction): Promise<void> {
    try {
      if (!this.voiceChannel) {
        return interaction.reply('You need to be in a voice channel to pause!');
      }
      this.player.pause();
      return interaction.reply('Paused the music!');
    } catch (error) {
      return interaction.reply(`Failed to pause: ${error}`);
    }
  }

  public async leave(interaction: CommandInteraction): Promise<void> {
    try {
      if (!this.voiceChannel) {
        return interaction.reply('You need to be in a voice channel to leave!');
      }
      this.queue = [];
      this.player.stop();
      this.player.removeAllListeners();
      this.connection.destroy();
      this.connection = undefined;
      return interaction.reply('Left the voice channel!');
    } catch (error) {
      return interaction.reply(`Failed to leave: ${error}`);
    }
  }

  public async showQueue(interaction: CommandInteraction): Promise<void> {
    try {
      if (!this.voiceChannel) {
        return interaction.reply('You need to be in a voice channel to queue!');
      }
      if (this.queue.length === 0) {
        return interaction.reply('There is no song in the queue!');
      }
      const queue = this.queue.map(
        (song, index) => `${index + 1}. ${song.title}`
      );
      return interaction.reply(`Current queue: ${queue.join('\n')}`);
    } catch (error) {
      return interaction.reply(`Failed to queue: ${error}`);
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

      return interaction.reply(`Now playing: ${song.title}`);
    } catch (error) {
      return interaction.reply(`Failed to play song: ${error}`);
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
