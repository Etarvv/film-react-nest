import { FilmDto, SessionDto } from '../films/films.dto';

export abstract class FilmsRepository {
  abstract findAll(): Promise<FilmDto[]>;
  /** null, если фильма нет */
  abstract findSchedule(filmId: string): Promise<SessionDto[] | null>;
  /** Атомарно занимает места. false — если сеанс не найден или любое место занято. */
  abstract reserveSeats(filmId: string, sessionId: string, seats: string[]): Promise<boolean>;
}
