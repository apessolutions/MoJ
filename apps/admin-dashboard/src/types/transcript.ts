export interface TextStream {
  id: string; // messageId_sequenceNumber
  messageId: string; // channelId_messageNumber
  tokens: string[];
  timestamps: number[];
  isFinal: boolean;
  sequenceNumber: number;
}

export interface ChannelMetadata {
  channelId: string;
  speakerId: string;
  priority: number;
  port: number;
  isActive: boolean;
  isMuted: boolean;
  displayName: string;
}

export interface StrategyDecision {
  action: 'add' | 'buffer' | 'interrupt' | 'ignore';
  reason: string;
}

export interface WebSocketMessage {
  tokens: string[];
  timestamps: number[];
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
