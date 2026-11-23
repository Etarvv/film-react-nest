import { FilmDto, SessionDto } from '../films/films.dto';

export abstract class FilmsRepository {
  abstract findAll(): Promise<FilmDto[]>;
  abstract findSchedule(filmId: string): Promise<SessionDto[] | null>;
  abstract reserveSeats(filmId: string, sessionId: string, seats: string[]): Promise<boolean>;
}
