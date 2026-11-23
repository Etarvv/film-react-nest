export const configProvider = {
    provide: 'CONFIG',
    useFactory: (): AppConfig => ({
        database: {
            driver: process.env.DATABASE_DRIVER ?? 'memory',
            url: process.env.DATABASE_URL ?? 'mongodb://localhost:27017/afisha',
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
