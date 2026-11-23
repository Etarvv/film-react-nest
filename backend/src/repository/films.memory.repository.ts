import { FilmDto, SessionDto } from '../films/films.dto';
import { FilmsRepository } from './films.repository';

type FilmRecord = FilmDto & { schedule: SessionDto[] };

export class InMemoryFilmsRepository extends FilmsRepository {
  private films: FilmRecord[] = [
    {
      id: '0e33c7f6-27a7-4aa0-8e61-65d7e5b9d1f5',
      rating: 2.9,
      director: 'Итан Райт',
      tags: ['Рекомендуем'],
      image: '/bg1s.jpg',
      cover: '/bg1c.jpg',
      title: 'Архитекторы общества',
      about: 'Документальный фильм о влиянии искусственного интеллекта на общество.',
      description: 'Описание фильма.',
      schedule: [
        { id: '5ae99171-8e88-46c1-b2f2-8b3b8d8a2b11', daytime: '2023-05-29T10:30:00.001Z', hall: 0, rows: 5, seats: 10, price: 350, taken: [] },
      ],
    },
  ];

  async findAll() {
    return this.films.map(({ schedule, ...film }) => film);
  }

  async findSchedule(filmId: string) {
    return this.films.find((f) => f.id === filmId)?.schedule ?? null;
  }

  async reserveSeats(filmId: string, sessionId: string, seats: string[]) {
    const session = this.films.find((f) => f.id === filmId)?.schedule.find((s) => s.id === sessionId);
    if (!session || seats.some((s) => session.taken.includes(s))) return false;
    session.taken.push(...seats);
    return true;
  }
}
