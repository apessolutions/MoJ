import { Message } from 'src/types/message';
import { TextStream } from 'src/types/transcript';

import { BaseState } from './base-state';

export class NormalChatState extends BaseState {
  private async getMessageOrCreate(stream: TextStream): Promise<Message> {
    const speaker = this.transcriptOrchestrator
      .getSpeakers()
      .get(stream.channelId);
    if (!speaker) {
      throw new Error(`Speaker not found for message: ${stream.messageId}`);
    }

    const messages = this.transcriptOrchestrator.getMessages();

    if (messages.length > 0) {
      const message = messages[messages.length - 1];

      if (message.id === stream.messageId && !message.isFinal) {
        return message;
      }
    }
    // if i will create a new message i need to format the last message first
    if (messages.length > 0) {
      const lastMessage = messages[messages.length - 1];
      await this.onMessageFinalized(lastMessage);
    }

    const newMessage = new Message(
      stream.messageId,
      speaker,
      [],
      false,
      stream.isFinal
    );
    messages.push(newMessage);
    return newMessage;
  }

  async onTextStream(textStream: TextStream): Promise<void> {
    const speakers = this.transcriptOrchestrator.getSpeakers();
    const speaker = speakers.get(textStream.channelId);

    if (!speaker || speaker.isMuted) {
      return;
    }

    const message = await this.getMessageOrCreate(textStream);
    message.textStreams.push(textStream);
    const wasNotFinal = !message.isFinal;
    message.isFinal = textStream.isFinal;
    speaker.isActive = true;
    if (wasNotFinal) {
      await this.onMessageFinalized(message);
    }

    if (this.transcriptOrchestrator.onTranscriptUpdateCallback) {
      console.log(
        'Number of messages: ',
        this.transcriptOrchestrator.getMessages().length
      );
      this.transcriptOrchestrator.onTranscriptUpdateCallback([
        ...this.transcriptOrchestrator.getMessages(),
      ]);
    }
  }
}
