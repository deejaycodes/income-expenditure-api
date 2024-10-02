import { registerProvider } from "@tsed/di";
import { DataSource } from "typeorm";
import { Logger } from "@tsed/logger";
import { User } from "../entities/User";
import { Statements } from "../entities/IncomeExpenditureStatement";
import { TransactionEntry } from "../entities/TransactionEntry";
import dotenv from "dotenv";

dotenv.config();

export const POSTGRES_DATA_SOURCE = Symbol.for("PostgresDatasource");
export type PostgresDatasource = DataSource;
export const PostgresDatasource = new DataSource({
  type: "postgres",
  entities: [User, Statements, TransactionEntry],
  host: process.env.POSTGRES_HOST,
  port: parseInt(process.env.POSTGRES_PORT ?? "5432"),
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB
});

registerProvider<DataSource>({
  provide: POSTGRES_DATA_SOURCE,
  type: "typeorm:datasource",
  deps: [Logger],
  async useAsyncFactory(logger: Logger) {
    try {
      await PostgresDatasource.initialize();
      logger.info("Connected with typeorm to database: Postgres");
      return PostgresDatasource;
    } catch (error) {
      logger.error("Error connecting to database: " + error);
      throw error;
    }
  },
  hooks: {
    $onDestroy(dataSource) {
      return dataSource.isInitialized && dataSource.destroy();
    }
  }
});
