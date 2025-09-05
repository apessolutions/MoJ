import { ChannelService } from 'src/services/channel-service';

export class Speaker {
  name: string;
  channel: ChannelService;
  isMuted: boolean;
  isActive: boolean;
  priority: number;

  constructor(
    name: string,
    channel: ChannelService,
    isMuted: boolean,
    priority: number
  ) {
    this.name = name;
    this.channel = channel;
    this.isMuted = isMuted;
    this.isActive = false;
    this.priority = priority;
  }

  public get channelId(): string {
    return this.channel.id;
  }
}
