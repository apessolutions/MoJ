import axios from 'axios';
// import { httpClient } from 'src/api';
import { Message } from 'src/types/message';

export class SPSService {
  private baseUrl: string;

  constructor(baseUrl = 'http://localhost:8000') {
    this.baseUrl = baseUrl;
  }

  public async startASR(): Promise<void> {
    try {
      await axios.post(
        'http://localhost:8000/asr_start',
        {},
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJVc2VyTmFtZSI6ImFsZXhzZWMiLCJGdWxsTmFtZSI6IkFsZXggU2VjZXJ0YXJ5IiwiUm9sZSI6IjIiLCJDaXJjbGVJZCI6IjBlNGM4ODE3LWZlNzEtNGZhYi1iYzk0LTc5M2E1MzhiZjg5NSIsIkNpcmNsZU5hbWUiOiLYr9in2KbYsdipINmE2YTYqtis2LHYqNipINix2YLZhSAyLTEiLCJDb3VydElkIjoiZmUzYzcyY2QtMjNjNy00NTk1LTgwN2MtOWZkZGMwMjJlMmRhIiwiQ291cnROYW1lIjoi2YXYrdmD2YXYqSDZhNmE2KrYrNix2KjYqSDYsdmC2YUgMSIsIkN1cnJlbnRVc2VySWQiOiI3NjI4MDdmYS0yN2RmLTRiMWQtOGEzMS05YTNhNGRkOGVjNWUiLCJuYmYiOjE3NTY5OTc2NzksImV4cCI6MTc1NzA4NDA3OSwiaWF0IjoxNzU2OTk3Njc5LCJpc3MiOiJJc3N1ZXIiLCJhdWQiOiJBdWRpZW5jZSJ9.i18JIZ3JgYuJcmIyBjQSQNjnG00nHm3mcRFCy1DgxX2Ub-xAlfjy-ebrYi5IhjWabW1dK8iHZCk2al0a3QHI1g`,
          },
        }
      );
      // await httpClient.post(`${this.baseUrl}/asr_start`, {});
      console.log('[SPSService] ASR started successfully');
    } catch (error) {
      console.error('[SPSService] Failed to start ASR:', error);
      throw error;
    }
  }

  public async stopASR(): Promise<void> {
    try {
      await axios.post(
        'http://localhost:8000/asr_stop',
        {},
        {
          headers: {
            Authorization: `Bearer eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJVc2VyTmFtZSI6ImFsZXhzZWMiLCJGdWxsTmFtZSI6IkFsZXggU2VjZXJ0YXJ5IiwiUm9sZSI6IjIiLCJDaXJjbGVJZCI6IjBlNGM4ODE3LWZlNzEtNGZhYi1iYzk0LTc5M2E1MzhiZjg5NSIsIkNpcmNsZU5hbWUiOiLYr9in2KbYsdipINmE2YTYqtis2LHYqNipINix2YLZhSAyLTEiLCJDb3VydElkIjoiZmUzYzcyY2QtMjNjNy00NTk1LTgwN2MtOWZkZGMwMjJlMmRhIiwiQ291cnROYW1lIjoi2YXYrdmD2YXYqSDZhNmE2KrYrNix2KjYqSDYsdmC2YUgMSIsIkN1cnJlbnRVc2VySWQiOiI3NjI4MDdmYS0yN2RmLTRiMWQtOGEzMS05YTNhNGRkOGVjNWUiLCJuYmYiOjE3NTY5OTc2NzksImV4cCI6MTc1NzA4NDA3OSwiaWF0IjoxNzU2OTk3Njc5LCJpc3MiOiJJc3N1ZXIiLCJhdWQiOiJBdWRpZW5jZSJ9.i18JIZ3JgYuJcmIyBjQSQNjnG00nHm3mcRFCy1DgxX2Ub-xAlfjy-ebrYi5IhjWabW1dK8iHZCk2al0a3QHI1g`,
          },
        }
      );
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
      const response = await axios.post(
        'http://localhost:8000/format',
        {
          text: message,
          return_original: false,
          speaker: speakerName,
        },
        {
          responseType: 'text',
          headers: {
            Authorization: `Bearer eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJVc2VyTmFtZSI6ImFsZXhzZWMiLCJGdWxsTmFtZSI6IkFsZXggU2VjZXJ0YXJ5IiwiUm9sZSI6IjIiLCJDaXJjbGVJZCI6IjBlNGM4ODE3LWZlNzEtNGZhYi1iYzk0LTc5M2E1MzhiZjg5NSIsIkNpcmNsZU5hbWUiOiLYr9in2KbYsdipINmE2YTYqtis2LHYqNipINix2YLZhSAyLTEiLCJDb3VydElkIjoiZmUzYzcyY2QtMjNjNy00NTk1LTgwN2MtOWZkZGMwMjJlMmRhIiwiQ291cnROYW1lIjoi2YXYrdmD2YXYqSDZhNmE2KrYrNix2KjYqSDYsdmC2YUgMSIsIkN1cnJlbnRVc2VySWQiOiI3NjI4MDdmYS0yN2RmLTRiMWQtOGEzMS05YTNhNGRkOGVjNWUiLCJuYmYiOjE3NTY5OTc2NzksImV4cCI6MTc1NzA4NDA3OSwiaWF0IjoxNzU2OTk3Njc5LCJpc3MiOiJJc3N1ZXIiLCJhdWQiOiJBdWRpZW5jZSJ9.i18JIZ3JgYuJcmIyBjQSQNjnG00nHm3mcRFCy1DgxX2Ub-xAlfjy-ebrYi5IhjWabW1dK8iHZCk2al0a3QHI1g`,
          },
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
