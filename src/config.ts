import { MigrationConfig } from "drizzle-orm/migrator"


type Config = {
    api: APIConfig,
    db: DBConfig,
    jwt: JWTConfig,
}

type APIConfig = {
    fileserverHits: number,
    port: number,
    
}
type DBConfig = {
    url: string,
    migrationConfig: MigrationConfig,   
}

type JWTConfig = {
    defaultDuration: number,
    secret: string,
    issuer: string,
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
    },
    jwt: {
        secret: envOrThrow("JWT_SECRET"),
        defaultDuration: 3600,
        issuer: "chirpy",
}
    }
    






function envOrThrow(key: string): string {
    const value = process.env[key];
    if (typeof value === 'undefined') {
        throw new Error(`Environment variable ${key} is not set`);
    }
    return value;
}