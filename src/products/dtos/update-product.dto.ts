import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  MinLength,
} from 'class-validator';

export class UpdateProductDto {
  @IsString({ message: 'You Must Send String Value For Title' })
  @IsNotEmpty()
  @MinLength(2)
  @IsOptional()
  title?: string;

  @IsNumber()
  @IsNotEmpty()
  @Min(2)
  @IsOptional()
  price?: number;
}
