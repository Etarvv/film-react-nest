import { Model } from 'mongoose';
import { FilmDto, SessionDto } from '../films/films.dto';
import { FilmsRepository } from './films.repository';
import { Film, Session } from './film.schema';

export class MongoFilmsRepository extends FilmsRepository {
  constructor(private readonly filmModel: Model<Film>) {
    super();
  }

  private toFilmDto(f: Film): FilmDto {
    const { id, rating, director, tags, image, cover, title, about, description } = f;
    return { id, rating, director, tags, image, cover, title, about, description };
  }

  private toSessionDto(s: Session): SessionDto {
    const { id, daytime, hall, rows, seats, price, taken } = s;
    return { id, daytime, hall, rows, seats, price, taken: [...taken] };
  }

  async findAll() {
    const films = await this.filmModel.find().lean();
    return films.map((f) => this.toFilmDto(f as Film));
  }

  async findSchedule(filmId: string) {
    const film = await this.filmModel.findOne({ id: filmId }).lean();
    return film ? (film.schedule as Session[]).map((s) => this.toSessionDto(s)) : null;
  }

  async reserveSeats(filmId: string, sessionId: string, seats: string[]) {
    const res = await this.filmModel.updateOne(
      { id: filmId, schedule: { $elemMatch: { id: sessionId, taken: { $nin: seats } } } },
      { $push: { 'schedule.$.taken': { $each: seats } } },
    );
    return res.modifiedCount === 1;
  }
}
