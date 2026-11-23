import { Type } from 'class-transformer';
import {
  ArrayNotEmpty, IsArray, IsEmail, IsInt, IsNumber, IsOptional, IsString, Min, ValidateNested,
} from 'class-validator';

export class TicketDto {
  @IsString() film: string;     // id фильма
  @IsString() session: string;  // id сеанса
  @IsOptional() @IsString() daytime?: string;
  @IsOptional() @IsString() day?: string;   // поля, которые шлёт фронтенд для корзины
  @IsOptional() @IsString() time?: string;
  @IsInt() @Min(1) row: number;
  @IsInt() @Min(1) seat: number;
  @IsNumber() price: number;
}

export class CreateOrderDto {
  @IsEmail() email: string;
  @IsString() phone: string;

  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => TicketDto)
  tickets: TicketDto[];
}

export class OrderResultDto extends TicketDto {
  id: string; // фронтенд ждёт OrderResult = Ticket + id
}

export class OrderResponseDto {
  total: number;
  items: OrderResultDto[];
}
