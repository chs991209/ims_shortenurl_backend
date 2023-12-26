import { IsNotEmpty, IsUrl } from 'class-validator';

export class GetOriginalUrlDto {
  @IsNotEmpty()
  @IsUrl()
  readonly original_url: string;
}
