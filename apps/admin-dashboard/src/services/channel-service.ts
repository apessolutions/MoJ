import { generateMessageId, generateStreamId } from 'src/utils/socket-message';

import { TextStream, WebSocketMessage } from '../types/transcript';

export class ChannelService {
  private websocket: WebSocket | null = null;
  private messageIdCounter = 0;
  private sequenceCounter = 0;
  private channelId: string;
  private lastTextStream: TextStream | null = null;
  private lastTokenIndex = -1; // resets on isFinal
  private onTextStreamCallback?: (stream: TextStream) => void;

  constructor(
    channelId: string,
    websocketUrl: string,
    onTextStreamCallback?: (stream: TextStream) => void
  ) {
    this.channelId = channelId;
    this.onTextStreamCallback = onTextStreamCallback;
    this.initWebSocket(websocketUrl);
  }

  private initWebSocket(url: string): void {
    try {
      this.websocket = new WebSocket(url);

      this.websocket.onopen = () => {
        console.log(
          `[ChannelService] WebSocket connected for channel ${this.channelId}`
        );
      };

      this.websocket.onmessage = (event) => {
        console.log('event', event);
        this.onWebSocketMessage(event);
      };

      this.websocket.onclose = () => {
        console.log(
          `[ChannelService] WebSocket closed for channel ${this.channelId}`
        );
      };

      this.websocket.onerror = (error) => {
        console.error(
          `[ChannelService] WebSocket error for channel ${this.channelId}:`,
          error
        );
      };
    } catch (error) {
      console.error(`[ChannelService] Failed to initialize WebSocket:`, error);
    }
  }

  private onWebSocketMessage(event: MessageEvent): void {
    try {
      const message: WebSocketMessage = JSON.parse(event.data);

      const messageCounter = this.messageIdCounter;
      const sequenceCounter = this.sequenceCounter;
      const slicingIndex = this.lastTokenIndex + 1;
      const textStream: TextStream = {
        id: generateStreamId(this.channelId, messageCounter, sequenceCounter),
        messageId: generateMessageId(this.channelId, messageCounter),
        tokens: message.tokens.slice(slicingIndex),
        timestamps: message.timestamps.slice(slicingIndex),
        isFinal: message.isFinal,
        sequenceNumber: sequenceCounter,
      };

      console.log(`[ChannelService] Generated TextStream:`, {
        messageId: textStream.messageId,
        isFinal: textStream.isFinal,
        text: textStream.tokens.join(' ').substring(0, 50) + '...',
      });

      this.updateLastTextStream(textStream);

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

  public updateLastTextStream(lastTextStream: TextStream): void {
    this.lastTextStream = lastTextStream;
    this.lastTokenIndex = lastTextStream.tokens.length - 1;
    this.sequenceCounter++;
    if (lastTextStream.isFinal) {
      this.messageIdCounter++;
    }
  }

  public close(): void {
    if (this.websocket) {
      this.websocket.close();
      this.websocket = null;
      console.log(`[ChannelService] Closed channel ${this.channelId}`);
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
