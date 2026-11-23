import { Type } from 'class-transformer';
import {
  IsArray, IsInt, IsNotEmpty, IsNumber, IsString, Max, Min, ValidateNested,
} from 'class-validator';

export class FilmIdParamDto {
  @IsString()
  @IsNotEmpty()
  id: string;
}

export class FilmDto {
  @IsString() @IsNotEmpty() id: string;
  @IsNumber() @Min(0) @Max(10) rating: number;
  @IsString() director: string;
  @IsArray() @IsString({ each: true }) tags: string[];
  @IsString() image: string;
  @IsString() cover: string;
  @IsString() @IsNotEmpty() title: string;
  @IsString() about: string;
  @IsString() description: string;
}

export class SessionDto {
  @IsString() @IsNotEmpty() id: string;
  @IsString() @IsNotEmpty() daytime: string;
  @IsInt() @Min(0) hall: number;
  @IsInt() @Min(1) rows: number;
  @IsInt() @Min(1) seats: number;
  @IsNumber() @Min(0) price: number;
  @IsArray() @IsString({ each: true }) taken: string[]; // `${row}:${seat}`
}

export class FilmsResponseDto {
  @IsInt() @Min(0) total: number;
  @IsArray() @ValidateNested({ each: true }) @Type(() => FilmDto) items: FilmDto[];
}

export class ScheduleResponseDto {
  @IsInt() @Min(0) total: number;
  @IsArray() @ValidateNested({ each: true }) @Type(() => SessionDto) items: SessionDto[];
}
