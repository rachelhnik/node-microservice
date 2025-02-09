import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from "class-validator";

export class CreateProductRequest {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  description: string;

  @IsNumber()
  @Min(1)
  price: number;

  @IsNumber()
  stock: number;
}

export class EditProductRequest {
  name?: string;

  description?: string;

  @Min(1)
  price?: number;

  stock?: number;
}

export class GetAllProductsRequest {
  @IsString()
  @IsOptional()
  limit?: string;

  @IsString()
  @IsOptional()
  offset?: string;
}

export class IdRequest {
  @IsString()
  id: string;
}
