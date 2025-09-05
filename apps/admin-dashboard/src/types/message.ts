import { Speaker } from './speaker';
import { TextStream } from './transcript';

export class Message {
  id: string;
  speaker: Speaker;
  textStreams: TextStream[];
  isSynced: boolean;
  isFinal: boolean;

  constructor(
    id: string,
    speaker: Speaker,
    textStreams: TextStream[],
    isSynced: boolean,
    isFinal: boolean
  ) {
    this.id = id;
    this.speaker = speaker;
    this.textStreams = textStreams;
    this.isSynced = isSynced;
    this.isFinal = isFinal;
  }

  public get text(): string {
    return this.textStreams.map((stream) => stream.tokens.join(' ')).join(' ');
  }

  public get timestamp(): number {
    return this.textStreams[0].timestamps[0];
  }

  public get channelId(): string {
    return this.speaker.channel.id;
  }

  public get messageId(): string {
    return this.id;
  }
}
