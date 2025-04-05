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
        subject: 'You logged in ',
        template: 'login',
        context: { email, username, today },
      });
    } catch (e) {
      console.log(e);
      throw new RequestTimeoutException('error sending verification mail');
    }
  }

  public async sendVerificationMail(email: string, link: string) {
    try {
      await this.mailerService.sendMail({
        to: email,
        from: `<no-reply@miso.com>`,
        subject: 'verifiy your email',
        template: 'login',
        context: { link },
      });
    } catch (e) {
      console.log(e);
      throw new RequestTimeoutException('error sending verification mail');
    }
  }

  public async sendResetPasswordTemplate(
    email: string,
    resetPasswordLink: string,
  ) {
    try {
      await this.mailerService.sendMail({
        to: email,
        from: `<no-reply@miso.com>`,
        subject: 'Reset Password',
        template: 'login',
        context: { link: resetPasswordLink },
      });
    } catch (e) {
      console.log(e);
      throw new RequestTimeoutException('error sending verification mail');
    }
  }
}
