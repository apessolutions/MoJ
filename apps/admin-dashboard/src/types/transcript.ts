export interface TextStream {
  id: string;
  channelId: string;
  messageId: string; // Based on isFinal count
  text: string;
  timestamp: number;
  isFinal: boolean;
  confidence?: number;
  sequenceNumber: number;
}

export interface ChannelMetadata {
  channelId: string;
  speakerId: string;
  priority: number;
  isActive: boolean;
  isMuted: boolean;
  displayName: string;
}

export interface StrategyDecision {
  action: 'add' | 'buffer' | 'interrupt' | 'ignore';
  reason: string;
}

export interface WebSocketMessage {
  text: string;
  isFinal: boolean;
  confidence?: number;
  timestamp?: number;
}

export interface TranscriptStrategy {
  shouldAddText(
    incomingStream: TextStream,
    activeChannel: ChannelMetadata | null,
    allChannels: Map<string, ChannelMetadata>
  ): StrategyDecision;
}