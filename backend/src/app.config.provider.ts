import { ConfigService } from '@nestjs/config';

export const configProvider = {
    provide: 'CONFIG',
    inject: [ConfigService],
    useFactory: (config: ConfigService): AppConfig => ({
        database: {
            driver: config.get<string>('DATABASE_DRIVER', 'memory'),
            url: config.get<string>('DATABASE_URL', 'mongodb://localhost:27017/afisha'),
        },
    }),
};

export interface AppConfig {
    database: AppConfigDatabase;
}

export interface AppConfigDatabase {
    driver: string; // 'memory' | 'mongodb'
    url: string;
}
