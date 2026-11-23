import { Controller, Get, Param } from '@nestjs/common';
import { FilmIdParamDto } from './films.dto';
import { FilmsService } from './films.service';

@Controller('films')
export class FilmsController {
  constructor(private readonly filmsService: FilmsService) {}

  @Get()
  getFilms() {
    return this.filmsService.getFilms();
  }

  @Get(':id/schedule')
  getSchedule(@Param() { id }: FilmIdParamDto) {
    return this.filmsService.getSchedule(id);
  }
}
