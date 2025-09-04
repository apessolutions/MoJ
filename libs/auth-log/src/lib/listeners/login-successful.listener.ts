import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { LoginSuccessfulEvent } from '../events';
import { AuthLogsService } from '../auth-logs.service';

@Injectable()
export class LoginSuccessfulListener {
  constructor(private readonly authLogsService: AuthLogsService) {}

  @OnEvent(LoginSuccessfulEvent.event)
  handleLoginSuccessfulEvent(data: LoginSuccessfulEvent) {
    this.authLogsService.create({
      loginAt: new Date(Date.now()),
      loginSuccessful: true,
      userId: data.userId,
      userType: data.userType,
    });
  }
}
