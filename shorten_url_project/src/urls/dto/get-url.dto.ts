import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
} from 'class-validator';

export class GetUrlDto {
  @IsNotEmpty()
  @IsUrl()
  readonly original_url: string;
  @IsNotEmpty()
  @IsString()
  readonly shortened_url: string;
  @IsNotEmpty()
  readonly created_at: string;
  @IsOptional()
  readonly deleted_at: string;

  @IsNotEmpty()
  @IsNumber()
  readonly id: number;
}
