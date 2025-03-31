import {
  IsNotEmpty,
  IsNumber,
  IsString,
  Min,
  MinLength,
} from 'class-validator';

export class CreateProductDto {
  @IsString({ message: 'You Must Send String Value For Title' })
  @IsNotEmpty()
  @MinLength(2)
  title: string;

  @IsString()
  description: string;

  @IsNumber()
  @IsNotEmpty()
  @Min(2)
  price: number;
}
