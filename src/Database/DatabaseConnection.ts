import { DataSource } from "typeorm";

const PostgresqlDataSource = new DataSource(
    {
        type: "postgres",
        host: "localhost",
        port: 5432,
        username: "postgres",
        password: "102030",
        database: "postgres"
    }
)