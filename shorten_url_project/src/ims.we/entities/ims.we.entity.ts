import { IsNotEmpty, IsUrl } from 'class-validator';

export class ImsWe {
  @IsNotEmpty()
  @IsUrl()
  readonly original_url: string;
}
