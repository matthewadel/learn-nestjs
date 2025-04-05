import { IsNotEmpty, IsNumber, IsString, MinLength } from 'class-validator';

export class ResetPasswordDto {
  @IsNumber()
  @IsNotEmpty()
  userId: number;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  newPassword: string;

  @IsString()
  @IsNotEmpty()
  resetPasswordToken: string;
}
