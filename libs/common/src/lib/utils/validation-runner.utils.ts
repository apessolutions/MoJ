import { isDefined } from 'class-validator';

import { ContextProvider } from '../providers/context.provider';

export abstract class ValidationHandler {
  constructor(private readonly passSuperAdmin: boolean) {}
  async handle() {
    if (this.passSuperAdmin) {
      const admin = ContextProvider.getAuthAdmin();
      if (isDefined(admin) && admin.isSuper) return;
    }
    await this.run();
  }
  abstract run(): Promise<void>;
}

export class ValidationRunner {
  constructor(private readonly handlers: ValidationHandler[]) {}

  async run(): Promise<void> {
    for (const handler of this.handlers) {
      await handler.handle();
    }
  }
}
