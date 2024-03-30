import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class ConfigSchema {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  PINATA_API_KEY?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  PINATA_SECRET_API_KEY?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  PINATA_JWT_KEY?: string;
}
