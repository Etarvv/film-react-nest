import { randomUUID } from 'node:crypto';
import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { FilmsRepository } from '../repository/films.repository';
import { CreateOrderDto, OrderResponseDto, TicketDto } from './order.dto';

@Injectable()
export class OrderService {
  constructor(private readonly repo: FilmsRepository) {}

  async createOrder(dto: CreateOrderDto): Promise<OrderResponseDto> {
    // 1. группируем места по (фильм, сеанс) и ловим дубли внутри самого заказа
    const groups = new Map<string, { film: string; session: string; seats: string[] }>();
    for (const t of dto.tickets) {
      const key = `${t.film}|${t.session}`;
      const g = groups.get(key) ?? { film: t.film, session: t.session, seats: [] };
      const seatKey = `${t.row}:${t.seat}`;
      if (g.seats.includes(seatKey)) {
        throw new BadRequestException(`Место ${seatKey} указано в заказе дважды`);
      }
      g.seats.push(seatKey);
      groups.set(key, g);
    }

    // 2. валидируем границы зала и уже занятые места
    for (const t of dto.tickets) this.validateSeat(t, await this.getSession(t));

    // 3. бронируем (в репозитории проверка + запись атомарны)
    for (const g of groups.values()) {
      const ok = await this.repo.reserveSeats(g.film, g.session, g.seats);
      if (!ok) throw new ConflictException('Одно из выбранных мест уже занято');
    }

    const items = dto.tickets.map((t) => ({ ...t, id: randomUUID() }));
    return { total: items.length, items };
  }

  private async getSession(t: TicketDto) {
    const schedule = await this.repo.findSchedule(t.film);
    if (!schedule) throw new NotFoundException(`Фильм ${t.film} не найден`);
    const session = schedule.find((s) => s.id === t.session);
    if (!session) throw new NotFoundException(`Сеанс ${t.session} не найден`);
    return session;
  }

  private validateSeat(t: TicketDto, s: { rows: number; seats: number; taken: string[] }) {
    if (t.row > s.rows || t.seat > s.seats) {
      throw new BadRequestException(`Места ${t.row}:${t.seat} нет в зале`);
    }
    if (s.taken.includes(`${t.row}:${t.seat}`)) {
      throw new ConflictException(`Место ${t.row}:${t.seat} уже занято`);
    }
  }
}
