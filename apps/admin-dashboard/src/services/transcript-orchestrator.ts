import { Message } from 'src/types/message';
import { Speaker } from 'src/types/speaker';
import { getChannelIdFromMessageId } from 'src/utils/socket-message';

import {
  ChannelMetadata,
  TextStream,
  TranscriptStrategy,
} from '../types/transcript';

import { ChannelService } from './channel-service';
import { InterruptStrategy } from './transcript-strategies';

export class TranscriptOrchestrator {
  private speakers = new Map<string, Speaker>();
  private messages: Message[] = [];
  private bufferedMessages: Message[] = [];
  private strategy: TranscriptStrategy;
  private onTranscriptUpdateCallback: (messages: Message[]) => void;

  constructor(
    strategy: TranscriptStrategy = new InterruptStrategy(),
    onTranscriptUpdateCallback: (messages: Message[]) => void
  ) {
    this.strategy = strategy;
    this.onTranscriptUpdateCallback = onTranscriptUpdateCallback;
  }

  public addSpeaker(
    name: string,
    channelId: string,
    websocketUrl: string,
    priority: number
  ): Speaker {
    const channel = new ChannelService(channelId, websocketUrl, (stream) =>
      this.addToTranscript(stream)
    );

    const speaker = new Speaker(name, channel, false, priority);
    // Store metadata
    this.speakers.set(channelId, speaker);

    return speaker;
  }

  public removeSpeaker(channelId: string): void {
    const speaker = this.speakers.get(channelId);
    if (speaker) {
      speaker.channel.close();
      this.speakers.delete(channelId);
    }

    this.speakers.delete(channelId);
  }

  // public setStrategy(strategy: TranscriptStrategy): void {
  //   this.strategy = strategy;
  //   console.log(
  //     `[TranscriptOrchestrator] Strategy changed to: ${strategy.constructor.name}`
  //   );
  // }

  // public handleTextStream(stream: TextStream): void {
  //   const activeChannel = this.activeChannelId
  //     ? this.channelMetadata.get(this.activeChannelId) || null
  //     : null;

  //   console.log(
  //     `[TranscriptOrchestrator] Processing stream from ${stream.channelId}, active: ${this.activeChannelId}`
  //   );

  //   const decision = this.strategy.shouldAddText(
  //     stream,
  //     activeChannel,
  //     this.channelMetadata
  //   );

  //   console.log(
  //     `[TranscriptOrchestrator] Strategy decision: ${decision.action} - ${decision.reason}`
  //   );

  //   switch (decision.action) {
  //     case 'add':
  //       this.addToTranscript(stream);
  //       this.setActiveChannel(stream.channelId);

  //       // If speaker finishes (isFinal=true), process buffered streams
  //       if (stream.isFinal) {
  //         this.onSpeakerFinished(stream.channelId);
  //       }
  //       break;

  //     case 'interrupt':
  //       // Add interruption marker and switch active speaker
  //       this.addInterruptionMarker(stream.channelId, this.activeChannelId!);
  //       this.addToTranscript(stream);
  //       this.setActiveChannel(stream.channelId);

  //       if (stream.isFinal) {
  //         this.onSpeakerFinished(stream.channelId);
  //       }
  //       break;

  //     case 'buffer':
  //       this.addToBuffer(stream);
  //       break;

  //     case 'ignore':
  //       // Do nothing
  //       break;
  //   }
  // }

  private getMessageOrCreate(stream: TextStream): Message {
    console.log(
      `[TranscriptOrchestrator] Getting message or creating new one for stream: ${stream}`
    );

    const speaker = this.speakers.get(
      getChannelIdFromMessageId(stream.messageId)
    );
    if (!speaker) {
      throw new Error(`Speaker not found for message: ${stream.messageId}`);
    }
    if (this.messages.length > 0) {
      const message = this.messages[this.messages.length - 1];

      if (message.id === stream.messageId && !message.isFinal) {
        return message;
      }
    }

    const newMessage = new Message(
      stream.messageId,
      speaker,
      [],
      false,
      stream.isFinal
    );
    this.messages.push(newMessage);
    return newMessage;
  }
  private addToTranscript(stream: TextStream): void {
    const message = this.getMessageOrCreate(stream);
    message.textStreams.push(stream);
    message.isFinal = stream.isFinal;

    if (this.onTranscriptUpdateCallback) {
      console.log('Number of messages: ', this.messages.length);
      this.onTranscriptUpdateCallback([...this.messages]);
    }
  }

  // private addInterruptionMarker(
  //   interruptingChannelId: string,
  //   interruptedChannelId: string
  // ): void {
  //   const interruptingChannel = this.channelMetadata.get(interruptingChannelId);
  //   const interruptedChannel = this.channelMetadata.get(interruptedChannelId);

  //   if (!interruptingChannel || !interruptedChannel) return;

  //   const interruptionMarker: TextStream = {
  //     id: `interruption-${Date.now()}`,
  //     channelId: 'system',
  //     messageId: 'interruption',
  //     text: `[${interruptingChannel.displayName} interrupted ${interruptedChannel.displayName}]`,
  //     timestamp: Date.now(),
  //     isFinal: true,
  //     sequenceNumber: this.transcriptHistory.length,
  //   };

  //   this.addToTranscript(interruptionMarker);
  // }

  // private addToBuffer(stream: TextStream): void {
  //   const buffered = this.bufferedStreams.get(stream.channelId) || [];
  //   buffered.push({
  //     stream,
  //     receivedAt: Date.now(),
  //   });
  //   this.bufferedStreams.set(stream.channelId, buffered);

  //   console.log(
  //     `[TranscriptOrchestrator] Buffered stream from ${
  //       stream.channelId
  //     }: ${stream.text.substring(0, 30)}...`
  //   );
  // }

  // private setActiveChannel(channelId: string): void {
  //   if (this.activeChannelId !== channelId) {
  //     const previousActive = this.activeChannelId;
  //     this.activeChannelId = channelId;

  //     // Update metadata
  //     if (previousActive) {
  //       const prevChannel = this.channelMetadata.get(previousActive);
  //       if (prevChannel) {
  //         prevChannel.isActive = false;
  //       }
  //     }

  //     const newActive = this.channelMetadata.get(channelId);
  //     if (newActive) {
  //       newActive.isActive = true;
  //     }

  //     console.log(
  //       `[TranscriptOrchestrator] Active channel changed: ${previousActive} -> ${channelId}`
  //     );
  //   }
  // }

  // private onSpeakerFinished(channelId: string): void {
  //   console.log(`[TranscriptOrchestrator] Speaker finished: ${channelId}`);

  //   // Mark channel as inactive
  //   const channel = this.channelMetadata.get(channelId);
  //   if (channel) {
  //     channel.isActive = false;
  //   }

  //   // Clear active channel
  //   if (this.activeChannelId === channelId) {
  //     this.activeChannelId = null;
  //   }

  //   // Process any buffered streams
  //   this.processBufferedStreams();
  // }

  // private processBufferedStreams(): void {
  //   console.log(`[TranscriptOrchestrator] Processing buffered streams...`);

  //   // Get all buffered streams with their priorities
  //   const allBuffered: {
  //     channelId: string;
  //     stream: BufferedStream;
  //     priority: number;
  //   }[] = [];

  //   for (const [channelId, streams] of this.bufferedStreams.entries()) {
  //     const metadata = this.channelMetadata.get(channelId);
  //     if (metadata && streams.length > 0) {
  //       // Get the oldest buffered stream for this channel
  //       const oldestStream = streams[0];
  //       allBuffered.push({
  //         channelId,
  //         stream: oldestStream,
  //         priority: metadata.priority,
  //       });
  //     }
  //   }

  //   if (allBuffered.length === 0) {
  //     console.log(`[TranscriptOrchestrator] No buffered streams to process`);
  //     return;
  //   }

  //   // Sort by priority (highest first), then by receivedAt (oldest first)
  //   allBuffered.sort((a, b) => {
  //     if (a.priority !== b.priority) {
  //       return b.priority - a.priority; // Higher priority first
  //     }
  //     return a.stream.receivedAt - b.stream.receivedAt; // Older first
  //   });

  //   // Process the highest priority buffered stream
  //   const nextToProcess = allBuffered[0];
  //   const bufferedStreams =
  //     this.bufferedStreams.get(nextToProcess.channelId) || [];

  //   if (bufferedStreams.length > 0) {
  //     const bufferedStream = bufferedStreams.shift()!; // Remove from buffer
  //     this.bufferedStreams.set(nextToProcess.channelId, bufferedStreams);

  //     console.log(
  //       `[TranscriptOrchestrator] Processing buffered stream from ${nextToProcess.channelId}`
  //     );

  //     // Process as if it just arrived
  //     this.handleTextStream(bufferedStream.stream);
  //   }
  // }

  // public getTranscriptHistory(): TextStream[] {
  //   return [...this.transcriptHistory];
  // }

  // public getActiveChannel(): ChannelMetadata | null {
  //   return this.activeChannelId
  //     ? this.channelMetadata.get(this.activeChannelId) || null
  //     : null;
  // }

  // public getAllChannels(): ChannelMetadata[] {
  //   return Array.from(this.channelMetadata.values());
  // }

  // public getChannelStats(): {
  //   [channelId: string]: { buffered: number; active: boolean };
  // } {
  //   const stats: {
  //     [channelId: string]: { buffered: number; active: boolean };
  //   } = {};

  //   for (const [channelId, metadata] of this.channelMetadata) {
  //     const buffered = this.bufferedStreams.get(channelId) || [];
  //     stats[channelId] = {
  //       buffered: buffered.length,
  //       active: metadata.isActive,
  //     };
  //   }

  //   return stats;
  // }

  public clearTranscript(): void {
    this.messages = [];
    this.bufferedMessages = [];
    if (this.onTranscriptUpdateCallback) {
      this.onTranscriptUpdateCallback([]);
    }

    console.log(`[TranscriptOrchestrator] Transcript cleared`);
  }
}
