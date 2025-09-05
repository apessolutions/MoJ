import { generateMessageId, generateStreamId } from 'src/utils/socket-message';

import { TextStream, WebSocketMessage } from '../types/transcript';

export class ChannelService {
  private websocket: WebSocket | null = null;
  private messageIdCounter = 0;
  private sequenceCounter = 0;
  public id: string;
  private lastTokenIndex = 0; // resets on isFinal
  private onTextStreamCallback: (stream: TextStream) => void;

  constructor(
    channelId: string,
    websocketUrl: string,
    onTextStreamCallback: (stream: TextStream) => void
  ) {
    this.id = channelId;
    this.onTextStreamCallback = onTextStreamCallback;
    this.initWebSocket(websocketUrl);
  }

  private initWebSocket(url: string): void {
    try {
      this.websocket = new WebSocket(url);

      this.websocket.onopen = () => {
        console.log(
          `[ChannelService] WebSocket connected for channel ${this.id}`
        );
      };

      this.websocket.onmessage = (event) => {
        console.log('event', event);
        this.onWebSocketMessage(event);
      };

      this.websocket.onclose = () => {
        console.log(`[ChannelService] WebSocket closed for channel ${this.id}`);
      };

      this.websocket.onerror = (error) => {
        console.error(
          `[ChannelService] WebSocket error for channel ${this.id}:`,
          error
        );
      };
    } catch (error) {
      console.error(`[ChannelService] Failed to initialize WebSocket:`, error);
    }
  }

  private isValidMessage(message: WebSocketMessage): boolean {
    if (message.tokens.length === 0) {
      return false;
    }
    if (message.tokens.length === this.lastTokenIndex && !message.isFinal) {
      return false;
    }
    return true;
  }

  private onWebSocketMessage(event: MessageEvent): void {
    try {
      // Check if the event has the same size of the lastText
      const message: WebSocketMessage = JSON.parse(event.data);

      // Is a valid message
      if (!this.isValidMessage(message)) {
        return;
      }

      const messageCounter = this.messageIdCounter;
      const sequenceCounter = this.sequenceCounter;
      const slicingIndex = this.lastTokenIndex;
      const textStream: TextStream = {
        id: generateStreamId(this.id, messageCounter, sequenceCounter),
        messageId: generateMessageId(this.id, messageCounter),
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
    this.lastTokenIndex = lastTextStream.tokens.length - 1;
    this.sequenceCounter++;
    if (lastTextStream.isFinal) {
      this.messageIdCounter++;
      this.lastTokenIndex = 0;
    }
  }

  public close(): void {
    if (this.websocket) {
      this.websocket.close();
      this.websocket = null;
      console.log(`[ChannelService] Closed channel ${this.id}`);
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
    const tokens = text.split(' ');
    const currentTime = Date.now();
    const timestamps = tokens.map((_, index) => currentTime + index * 100);

    const fakeEvent: MessageEvent = {
      data: JSON.stringify({
        tokens,
        timestamps,
        isFinal,
        confidence,
        timestamp: currentTime,
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
      timeStamp: currentTime,
      cancelBubble: false,
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      initEvent: () => {},
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      preventDefault: () => {},
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      stopImmediatePropagation: () => {},
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      stopPropagation: () => {},
    } as unknown as MessageEvent;

    this.onWebSocketMessage(fakeEvent);
  }
}
