import {
  ChannelMetadata,
  TextStream,
  WebSocketMessage,
} from '../types/transcript';

export class ChannelService {
  private websocket: WebSocket | null = null;
  private messageIdCounter = 0;
  private sequenceCounter = 0;
  private metadata: ChannelMetadata;
  private onTextStreamCallback?: (stream: TextStream) => void;

  constructor(
    metadata: ChannelMetadata,
    websocketUrl: string,
    onTextStreamCallback?: (stream: TextStream) => void
  ) {
    this.metadata = metadata;
    this.onTextStreamCallback = onTextStreamCallback;
    this.initWebSocket(websocketUrl);
  }

  private initWebSocket(url: string): void {
    try {
      this.websocket = new WebSocket(url);

      this.websocket.onopen = () => {
        console.log(
          `[ChannelService] WebSocket connected for channel ${this.metadata.channelId}`
        );
      };

      this.websocket.onmessage = (event) => {
        console.log('event', event);
        this.onWebSocketMessage(event);
      };

      this.websocket.onclose = () => {
        console.log(
          `[ChannelService] WebSocket closed for channel ${this.metadata.channelId}`
        );
      };

      this.websocket.onerror = (error) => {
        console.error(
          `[ChannelService] WebSocket error for channel ${this.metadata.channelId}:`,
          error
        );
      };
    } catch (error) {
      console.error(`[ChannelService] Failed to initialize WebSocket:`, error);
    }
  }

  private onWebSocketMessage(event: MessageEvent): void {
    if (this.metadata.isMuted) {
      console.log(
        `[ChannelService] Ignoring message - channel ${this.metadata.channelId} is muted`
      );
      return;
    }

    try {
      const message: WebSocketMessage = JSON.parse(event.data);

      // Increment message ID each time isFinal is true
      if (message.isFinal) {
        this.messageIdCounter++;
      }

      const textStream: TextStream = {
        id: this.generateStreamId(),
        channelId: this.metadata.channelId,
        messageId: this.messageIdCounter.toString(),
        text: message.text,
        timestamp: message.timestamp || Date.now(),
        isFinal: message.isFinal,
        confidence: message.confidence,
        sequenceNumber: this.sequenceCounter++,
      };

      console.log(`[ChannelService] Generated TextStream:`, {
        channelId: textStream.channelId,
        messageId: textStream.messageId,
        isFinal: textStream.isFinal,
        text: textStream.text.substring(0, 50) + '...',
      });

      // Send to orchestrator
      if (this.onTextStreamCallback) {
        this.onTextStreamCallback(textStream);
      }
    } catch (error) {
      console.error(
        `[ChannelService] Error processing WebSocket message:`,
        error
      );
    }
  }

  private generateStreamId(): string {
    return `${this.metadata.channelId}-${Date.now()}-${Math.random()
      .toString(36)
      .substr(2, 9)}`;
  }

  public mute(): void {
    this.metadata.isMuted = true;
    console.log(`[ChannelService] Muted channel ${this.metadata.channelId}`);
  }

  public unmute(): void {
    this.metadata.isMuted = false;
    console.log(`[ChannelService] Unmuted channel ${this.metadata.channelId}`);
  }

  public setPriority(priority: number): void {
    this.metadata.priority = priority;
    console.log(
      `[ChannelService] Set priority ${priority} for channel ${this.metadata.channelId}`
    );
  }

  public getMetadata(): ChannelMetadata {
    return { ...this.metadata };
  }

  public updateMetadata(updates: Partial<ChannelMetadata>): void {
    this.metadata = { ...this.metadata, ...updates };
    console.log(
      `[ChannelService] Updated metadata for channel ${this.metadata.channelId}:`,
      updates
    );
  }

  public close(): void {
    if (this.websocket) {
      this.websocket.close();
      this.websocket = null;
      console.log(`[ChannelService] Closed channel ${this.metadata.channelId}`);
    }
  }

  public getConnectionState(): number | null {
    return this.websocket?.readyState ?? null;
  }

  // Method to simulate receiving WebSocket messages for demo purposes
  public simulateMessage(
    text: string,
    isFinal: boolean,
    confidence?: number
  ): void {
    const fakeEvent: MessageEvent = {
      data: JSON.stringify({
        text,
        isFinal,
        confidence,
        timestamp: Date.now(),
      }),
      type: 'message',
      target: this.websocket,
      currentTarget: this.websocket,
      bubbles: false,
      cancelable: false,
      composed: false,
      defaultPrevented: false,
      eventPhase: 0,
      isTrusted: true,
      returnValue: true,
      srcElement: this.websocket,
      timeStamp: Date.now(),
      cancelBubble: false,
      initEvent: () => {},
      preventDefault: () => {},
      stopImmediatePropagation: () => {},
      stopPropagation: () => {},
    } as MessageEvent;

    this.onWebSocketMessage(fakeEvent);
  }
}
