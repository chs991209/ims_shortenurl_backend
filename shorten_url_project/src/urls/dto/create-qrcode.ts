import { IsNotEmpty, IsString } from 'class-validator';

export class CreateQrCodeDto {
  @IsNotEmpty()
  @IsString()
  readonly shortened_url: string;
}
