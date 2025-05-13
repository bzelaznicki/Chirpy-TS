import { MigrationConfig } from "drizzle-orm/migrator"


type Config = {
    api: APIConfig,
    db: DBConfig,
}

type APIConfig = {
    fileserverHits: number,
    port: number,
}
type DBConfig = {
    url: string,
    migrationConfig: MigrationConfig,   
}

const migrationConfig: MigrationConfig = {
    migrationsFolder: "./src/lib/db/migrations/"
}
process.loadEnvFile();


export const config: Config = {
    api: {
        fileserverHits: 0,
        port: Number(envOrThrow("PORT")),
    },
    db: {
        url: envOrThrow("DB_URL"), 
        migrationConfig: migrationConfig,
    }
}






function envOrThrow(key: string): string {
    const value = process.env[key];
    if (typeof value === 'undefined') {
        throw new Error(`Environment variable ${key} is not set`);
    }
    return value;
}