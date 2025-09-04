import { TranscriptStrategy, TextStream, ChannelMetadata, StrategyDecision } from '../types/transcript';

export class InterruptStrategy implements TranscriptStrategy {
  shouldAddText(
    incomingStream: TextStream,
    activeChannel: ChannelMetadata | null,
    allChannels: Map<string, ChannelMetadata>
  ): StrategyDecision {
    const incomingChannel = allChannels.get(incomingStream.channelId);
    
    if (!incomingChannel) {
      return {
        action: 'ignore',
        reason: 'Channel metadata not found'
      };
    }

    if (incomingChannel.isMuted) {
      return {
        action: 'ignore',
        reason: 'Channel is muted'
      };
    }

    // If no active channel, allow the incoming stream
    if (!activeChannel) {
      return {
        action: 'add',
        reason: 'No active channel - adding text'
      };
    }

    // If it's the same channel as active, always add
    if (activeChannel.channelId === incomingStream.channelId) {
      return {
        action: 'add',
        reason: 'Same as active channel'
      };
    }

    // Higher priority interrupts lower priority
    if (incomingChannel.priority > activeChannel.priority) {
      return {
        action: 'interrupt',
        reason: `Higher priority (${incomingChannel.priority}) interrupting lower priority (${activeChannel.priority})`
      };
    }

    // Lower or equal priority gets buffered
    return {
      action: 'buffer',
      reason: `Lower priority (${incomingChannel.priority}) buffered behind active (${activeChannel.priority})`
    };
  }
}

export class QueueStrategy implements TranscriptStrategy {
  shouldAddText(
    incomingStream: TextStream,
    activeChannel: ChannelMetadata | null,
    allChannels: Map<string, ChannelMetadata>
  ): StrategyDecision {
    const incomingChannel = allChannels.get(incomingStream.channelId);
    
    if (!incomingChannel) {
      return {
        action: 'ignore',
        reason: 'Channel metadata not found'
      };
    }

    if (incomingChannel.isMuted) {
      return {
        action: 'ignore',
        reason: 'Channel is muted'
      };
    }

    // If no active channel, allow the incoming stream
    if (!activeChannel) {
      return {
        action: 'add',
        reason: 'No active channel - adding text'
      };
    }

    // If it's the same channel as active, always add
    if (activeChannel.channelId === incomingStream.channelId) {
      return {
        action: 'add',
        reason: 'Same as active channel'
      };
    }

    // In queue strategy, everyone waits - no interruption
    return {
      action: 'buffer',
      reason: 'Queue strategy - all speakers wait their turn'
    };
  }
}

// Additional strategy: First-Come-First-Served
export class FirstComeFirstServedStrategy implements TranscriptStrategy {
  shouldAddText(
    incomingStream: TextStream,
    activeChannel: ChannelMetadata | null,
    allChannels: Map<string, ChannelMetadata>
  ): StrategyDecision {
    const incomingChannel = allChannels.get(incomingStream.channelId);
    
    if (!incomingChannel) {
      return {
        action: 'ignore',
        reason: 'Channel metadata not found'
      };
    }

    if (incomingChannel.isMuted) {
      return {
        action: 'ignore',
        reason: 'Channel is muted'
      };
    }

    // If no active channel, allow the incoming stream
    if (!activeChannel) {
      return {
        action: 'add',
        reason: 'No active channel - adding text'
      };
    }

    // If it's the same channel as active, always add
    if (activeChannel.channelId === incomingStream.channelId) {
      return {
        action: 'add',
        reason: 'Same as active channel'
      };
    }

    // First come, first served - active channel continues
    return {
      action: 'buffer',
      reason: 'First-come-first-served - active channel continues'
    };
  }
}