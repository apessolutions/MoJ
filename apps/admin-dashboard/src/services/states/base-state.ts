import { Message } from 'src/types/message';
import { TextStream } from 'src/types/transcript';

import { TranscriptOrchestrator } from '../transcript-orchestrator';

export abstract class BaseState {
  constructor(protected transcriptOrchestrator: TranscriptOrchestrator) {}
  async onStart() {
    const spsService = this.transcriptOrchestrator.getSPService();
    await spsService.stopASR();
    await spsService.startASR();
  }

  async onStop(): Promise<void> {
    const spsService = this.transcriptOrchestrator.getSPService();
    await spsService.stopASR();
  }

  async onMessageFinalized(message: Message): Promise<void> {
    const spsService = this.transcriptOrchestrator.getSPService();
    message.formattedText = await spsService.formatMessage(
      message.text,
      message.speaker.name
    );
    message.isFinal = true;
  }

  abstract onTextStream(textStream: TextStream): Promise<void>;
}
