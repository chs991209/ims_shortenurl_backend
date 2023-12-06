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
  @IsString()
  readonly shortened_url: string;
  @IsNotEmpty()
  @IsString()
  readonly created_at: string;
  @IsOptional()
  @IsString()
  readonly updated_at: string;

  @IsNumber()
  readonly id: number;
}
