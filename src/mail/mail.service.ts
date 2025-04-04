import { MailerService } from '@nestjs-modules/mailer';
import { Injectable, RequestTimeoutException } from '@nestjs/common';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  public async sendEloginMail(email: string, username: string) {
    try {
      const today = new Date();
      await this.mailerService.sendMail({
        to: email,
        from: `<no-reply@miso.com>`,
        subject: 'verifiy your email',
        template: 'login',
        context: { email, username, today },
      });
    } catch (e) {
      console.log(e);
      throw new RequestTimeoutException('error sending verification mail');
    }
  }
}
