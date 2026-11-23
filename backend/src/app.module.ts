import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule, getModelToken } from '@nestjs/mongoose';
import * as path from 'node:path';

import { configProvider } from './app.config.provider';
import { FilmsController } from './films/films.controller';
import { FilmsService } from './films/films.service';
import { OrderController } from './order/order.controller';
import { OrderService } from './order/order.service';
import { FilmsRepository } from './repository/films.repository';
import { InMemoryFilmsRepository } from './repository/films.memory.repository';
import { MongoFilmsRepository } from './repository/films.mongo.repository';
import { Film, FilmSchema } from './repository/film.schema';

// ConfigModule.forRoot() выше по списку уже заполнил process.env из .env
const useMongo = (): boolean => process.env.DATABASE_DRIVER === 'mongodb';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, cache: true }),
    ServeStaticModule.forRoot({
      rootPath: path.join(__dirname, '..', 'public', 'content', 'afisha'),
      serveRoot: '/content/afisha',
    }),
    ...(useMongo()
      ? [
          MongooseModule.forRoot(
            process.env.DATABASE_URL ?? 'mongodb://localhost:27017/afisha',
          ),
          MongooseModule.forFeature([{ name: Film.name, schema: FilmSchema }]),
        ]
      : []),
  ],
  controllers: [FilmsController, OrderController],
  providers: [
    configProvider,
    FilmsService,
    OrderService,
    {
      provide: FilmsRepository,
      // модель Film есть только в режиме mongodb, поэтому optional
      inject: [{ token: getModelToken(Film.name), optional: true }],
      useFactory: (filmModel?: any): FilmsRepository =>
        useMongo() && filmModel
          ? new MongoFilmsRepository(filmModel)
          : new InMemoryFilmsRepository(),
    },
  ],
})
export class AppModule {}
