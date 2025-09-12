import { TextStream } from 'src/types/transcript';

import { BaseState } from './base-state';
import { NormalChatState } from './normal-chat-state';

export class IdleState extends BaseState {
  onTextStream(textStream: TextStream): Promise<void> {
    throw new Error('Method not implemented.');
  }

  override async onStart(): Promise<void> {
    await super.onStart();
    this.transcriptOrchestrator.setState(
      new NormalChatState(this.transcriptOrchestrator)
    );
  }
}
