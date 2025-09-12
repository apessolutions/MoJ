import { httpClient } from 'src/api';
import { Message } from 'src/types/message';

export class SPSService {
  private baseUrl: string;

  constructor(baseUrl = 'http://localhost:8000') {
    this.baseUrl = baseUrl;
  }

  public async startASR(): Promise<void> {
    try {
      await httpClient.post(`${this.baseUrl}/asr_start`, {});
      console.log('[SPSService] ASR started successfully');
    } catch (error) {
      console.error('[SPSService] Failed to start ASR:', error);
      throw error;
    }
  }

  public async stopASR(): Promise<void> {
    try {
      await httpClient.post(`${this.baseUrl}/asr_stop`, {});
      console.log('[SPSService] ASR stopped successfully');
    } catch (error) {
      console.error('[SPSService] Failed to stop ASR:', error);
      throw error;
    }
  }

  public async formatMessage(
    message: string,
    speakerName: string
  ): Promise<string> {
    try {
      const response = await httpClient.post(
        `${this.baseUrl}/format`,
        {
          text: message,
          return_original: false,
          speaker: speakerName,
        },
        {
          responseType: 'text',
        }
      );

      console.log('[SPSService] Message formatted successfully');
      return response.data;
    } catch (error) {
      console.error('[SPSService] Failed to format message:', error);
      throw error;
    }
  }

  public async initializeASR(): Promise<void> {
    await this.stopASR();
    await this.startASR();
  }
}
