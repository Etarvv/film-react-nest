import { Injectable, NotFoundException } from '@nestjs/common';
import { FilmsRepository } from '../repository/films.repository';
import { FilmsResponseDto, ScheduleResponseDto } from './films.dto';

@Injectable()
export class FilmsService {
  constructor(private readonly repo: FilmsRepository) {}

  async getFilms(): Promise<FilmsResponseDto> {
    const items = await this.repo.findAll();
    return { total: items.length, items };
  }

  async getSchedule(filmId: string): Promise<ScheduleResponseDto> {
    const items = await this.repo.findSchedule(filmId);
    if (!items) throw new NotFoundException(`Фильм ${filmId} не найден`);
    return { total: items.length, items };
  }
}
