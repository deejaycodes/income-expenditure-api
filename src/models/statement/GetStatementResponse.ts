import { Required, Property, CollectionOf } from "@tsed/schema";
import { TransactionEntryResponse } from "../transaction/TransactionEntryResponse";

export class GetStatementResponse {
  @Required()
  @Property()
  statementId: string;

  @Required()
  @Property()
  totalIncome: number;

  @Required()
  @Property()
  totalExpenditure: number;

  @Required()
  @Property()
  disposableIncome: number;

  @Required()
  @Property()
  rating: string;

  @Required()
  @Property()
  createdAt: Date;

  @Required()
  @Property()
  updatedAt: Date;

  @Required()
  @CollectionOf(TransactionEntryResponse)
  @Property()
  transactionEntries: TransactionEntryResponse[];
}
