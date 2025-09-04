import {
  ChannelMetadata,
  TextStream,
  TranscriptStrategy,
} from '../types/transcript';

import { ChannelService } from './channel-service';
import { InterruptStrategy } from './transcript-strategies';

interface BufferedStream {
  stream: TextStream;
  receivedAt: number;
}

export class TranscriptOrchestrator {
  private channels = new Map<string, ChannelService>();
  private channelMetadata = new Map<string, ChannelMetadata>();
  private bufferedStreams = new Map<string, BufferedStream[]>(); // channelId -> buffered streams
  private activeChannelId: string | null = null;
  private strategy: TranscriptStrategy;
  private onTranscriptUpdateCallback?: (streams: TextStream[]) => void;
  private transcriptHistory: TextStream[] = [];

  constructor(
    strategy: TranscriptStrategy = new InterruptStrategy(),
    onTranscriptUpdateCallback?: (streams: TextStream[]) => void
  ) {
    this.strategy = strategy;
    this.onTranscriptUpdateCallback = onTranscriptUpdateCallback;
  }

  public addChannel(
    metadata: ChannelMetadata,
    websocketUrl: string
  ): ChannelService {
    console.log(
      `[TranscriptOrchestrator] Adding channel: ${metadata.channelId} (${metadata.displayName})`
    );

    // Store metadata
    this.channelMetadata.set(metadata.channelId, metadata);

    // Initialize buffered streams for this channel
    this.bufferedStreams.set(metadata.channelId, []);

    // Create channel service with callback
    const channelService = new ChannelService(
      metadata,
      websocketUrl,
      (stream: TextStream) => this.handleTextStream(stream)
    );

    this.channels.set(metadata.channelId, channelService);
    return channelService;
  }

  public removeChannel(channelId: string): void {
    console.log(`[TranscriptOrchestrator] Removing channel: ${channelId}`);

    const channelService = this.channels.get(channelId);
    if (channelService) {
      channelService.close();
      this.channels.delete(channelId);
    }

    this.channelMetadata.delete(channelId);
    this.bufferedStreams.delete(channelId);

    // If this was the active channel, find next active or set to null
    if (this.activeChannelId === channelId) {
      this.activeChannelId = null;
      this.processBufferedStreams();
    }
  }

  public setStrategy(strategy: TranscriptStrategy): void {
    this.strategy = strategy;
    console.log(
      `[TranscriptOrchestrator] Strategy changed to: ${strategy.constructor.name}`
    );
  }

  public handleTextStream(stream: TextStream): void {
    const activeChannel = this.activeChannelId
      ? this.channelMetadata.get(this.activeChannelId) || null
      : null;

    console.log(
      `[TranscriptOrchestrator] Processing stream from ${stream.channelId}, active: ${this.activeChannelId}`
    );

    const decision = this.strategy.shouldAddText(
      stream,
      activeChannel,
      this.channelMetadata
    );

    console.log(
      `[TranscriptOrchestrator] Strategy decision: ${decision.action} - ${decision.reason}`
    );

    switch (decision.action) {
      case 'add':
        this.addToTranscript(stream);
        this.setActiveChannel(stream.channelId);

        // If speaker finishes (isFinal=true), process buffered streams
        if (stream.isFinal) {
          this.onSpeakerFinished(stream.channelId);
        }
        break;

      case 'interrupt':
        // Add interruption marker and switch active speaker
        this.addInterruptionMarker(stream.channelId, this.activeChannelId!);
        this.addToTranscript(stream);
        this.setActiveChannel(stream.channelId);

        if (stream.isFinal) {
          this.onSpeakerFinished(stream.channelId);
        }
        break;

      case 'buffer':
        this.addToBuffer(stream);
        break;

      case 'ignore':
        // Do nothing
        break;
    }
  }

  private addToTranscript(stream: TextStream): void {
    this.transcriptHistory.push(stream);
    console.log(
      `[TranscriptOrchestrator] Added to transcript: ${stream.text.substring(
        0,
        50
      )}...`
    );

    if (this.onTranscriptUpdateCallback) {
      this.onTranscriptUpdateCallback([...this.transcriptHistory]);
    }
  }

  private addInterruptionMarker(
    interruptingChannelId: string,
    interruptedChannelId: string
  ): void {
    const interruptingChannel = this.channelMetadata.get(interruptingChannelId);
    const interruptedChannel = this.channelMetadata.get(interruptedChannelId);

    if (!interruptingChannel || !interruptedChannel) return;

    const interruptionMarker: TextStream = {
      id: `interruption-${Date.now()}`,
      channelId: 'system',
      messageId: 'interruption',
      text: `[${interruptingChannel.displayName} interrupted ${interruptedChannel.displayName}]`,
      timestamp: Date.now(),
      isFinal: true,
      sequenceNumber: this.transcriptHistory.length,
    };

    this.addToTranscript(interruptionMarker);
  }

  private addToBuffer(stream: TextStream): void {
    const buffered = this.bufferedStreams.get(stream.channelId) || [];
    buffered.push({
      stream,
      receivedAt: Date.now(),
    });
    this.bufferedStreams.set(stream.channelId, buffered);

    console.log(
      `[TranscriptOrchestrator] Buffered stream from ${
        stream.channelId
      }: ${stream.text.substring(0, 30)}...`
    );
  }

  private setActiveChannel(channelId: string): void {
    if (this.activeChannelId !== channelId) {
      const previousActive = this.activeChannelId;
      this.activeChannelId = channelId;

      // Update metadata
      if (previousActive) {
        const prevChannel = this.channelMetadata.get(previousActive);
        if (prevChannel) {
          prevChannel.isActive = false;
        }
      }

      const newActive = this.channelMetadata.get(channelId);
      if (newActive) {
        newActive.isActive = true;
      }

      console.log(
        `[TranscriptOrchestrator] Active channel changed: ${previousActive} -> ${channelId}`
      );
    }
  }

  private onSpeakerFinished(channelId: string): void {
    console.log(`[TranscriptOrchestrator] Speaker finished: ${channelId}`);

    // Mark channel as inactive
    const channel = this.channelMetadata.get(channelId);
    if (channel) {
      channel.isActive = false;
    }

    // Clear active channel
    if (this.activeChannelId === channelId) {
      this.activeChannelId = null;
    }

    // Process any buffered streams
    this.processBufferedStreams();
  }

  private processBufferedStreams(): void {
    console.log(`[TranscriptOrchestrator] Processing buffered streams...`);

    // Get all buffered streams with their priorities
    const allBuffered: {
      channelId: string;
      stream: BufferedStream;
      priority: number;
    }[] = [];

    for (const [channelId, streams] of this.bufferedStreams.entries()) {
      const metadata = this.channelMetadata.get(channelId);
      if (metadata && streams.length > 0) {
        // Get the oldest buffered stream for this channel
        const oldestStream = streams[0];
        allBuffered.push({
          channelId,
          stream: oldestStream,
          priority: metadata.priority,
        });
      }
    }

    if (allBuffered.length === 0) {
      console.log(`[TranscriptOrchestrator] No buffered streams to process`);
      return;
    }

    // Sort by priority (highest first), then by receivedAt (oldest first)
    allBuffered.sort((a, b) => {
      if (a.priority !== b.priority) {
        return b.priority - a.priority; // Higher priority first
      }
      return a.stream.receivedAt - b.stream.receivedAt; // Older first
    });

    // Process the highest priority buffered stream
    const nextToProcess = allBuffered[0];
    const bufferedStreams =
      this.bufferedStreams.get(nextToProcess.channelId) || [];

    if (bufferedStreams.length > 0) {
      const bufferedStream = bufferedStreams.shift()!; // Remove from buffer
      this.bufferedStreams.set(nextToProcess.channelId, bufferedStreams);

      console.log(
        `[TranscriptOrchestrator] Processing buffered stream from ${nextToProcess.channelId}`
      );

      // Process as if it just arrived
      this.handleTextStream(bufferedStream.stream);
    }
  }

  public getTranscriptHistory(): TextStream[] {
    return [...this.transcriptHistory];
  }

  public getActiveChannel(): ChannelMetadata | null {
    return this.activeChannelId
      ? this.channelMetadata.get(this.activeChannelId) || null
      : null;
  }

  public getAllChannels(): ChannelMetadata[] {
    return Array.from(this.channelMetadata.values());
  }

  public getChannelStats(): {
    [channelId: string]: { buffered: number; active: boolean };
  } {
    const stats: {
      [channelId: string]: { buffered: number; active: boolean };
    } = {};

    for (const [channelId, metadata] of this.channelMetadata) {
      const buffered = this.bufferedStreams.get(channelId) || [];
      stats[channelId] = {
        buffered: buffered.length,
        active: metadata.isActive,
      };
    }

    return stats;
  }

  public clearTranscript(): void {
    this.transcriptHistory = [];
    this.bufferedStreams.clear();
    this.activeChannelId = null;

    // Reset all channels to inactive
    for (const metadata of this.channelMetadata.values()) {
      metadata.isActive = false;
    }

    if (this.onTranscriptUpdateCallback) {
      this.onTranscriptUpdateCallback([]);
    }

    console.log(`[TranscriptOrchestrator] Transcript cleared`);
  }
}
