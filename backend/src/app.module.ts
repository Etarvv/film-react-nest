import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ConfigModule, ConfigService } from '@nestjs/config';
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

const useMongo = (): boolean => process.env.DATABASE_DRIVER === 'mongodb';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, cache: true, envFilePath: '.env' }),
    ServeStaticModule.forRoot({
      rootPath: path.join(__dirname, '..', 'public', 'content', 'afisha'),
      serveRoot: '/content/afisha',
    }),
    ...(useMongo()
      ? [
          MongooseModule.forRootAsync({
            inject: [ConfigService],
            useFactory: (config: ConfigService) => ({
              uri: config.get<string>('DATABASE_URL', 'mongodb://localhost:27017/afisha'),
            }),
          }),
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
      inject: [ConfigService, { token: getModelToken(Film.name), optional: true }],
      useFactory: (config: ConfigService, filmModel?: any): FilmsRepository =>
        config.get('DATABASE_DRIVER') === 'mongodb' && filmModel
          ? new MongoFilmsRepository(filmModel)
          : new InMemoryFilmsRepository(),
    },
  ],
})
export class AppModule {}
