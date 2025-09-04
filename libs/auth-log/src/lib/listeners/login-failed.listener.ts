import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { LoginFailedEvent } from '../events';
import { AuthLogsService } from '../auth-logs.service';

@Injectable()
export class LoginFailedListener {
  constructor(private readonly authLogsService: AuthLogsService) {}

  @OnEvent(LoginFailedEvent.event)
  handleLoginFailedEvent(data: LoginFailedEvent) {
    this.authLogsService.create({
      loginAt: new Date(Date.now()),
      loginSuccessful: false,
      userId: data.userId,
      userType: data.userType,
    });
  }
}
