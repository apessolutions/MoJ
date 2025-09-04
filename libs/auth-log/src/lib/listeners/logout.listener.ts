import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { AuthLogsService } from '../auth-logs.service';
import { LogoutSuccessfulEvent } from '../events';

@Injectable()
export class LogoutListener {
  constructor(private readonly authLogsService: AuthLogsService) {}

  @OnEvent(LogoutSuccessfulEvent.event)
  async handleLogoutSuccessfulEvent(data: LogoutSuccessfulEvent) {
    await this.authLogsService.logout(data.userId, data.userType);
  }
}
