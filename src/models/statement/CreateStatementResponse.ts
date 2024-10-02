import { Required, Property, CollectionOf, Format } from "@tsed/schema";
import { TransactionEntryResponse } from "../transaction/TransactionEntryResponse";

export class CreateStatementResponse {
  @Required()
  @Format("uuid")
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
  @CollectionOf(TransactionEntryResponse)
  @Property()
  transactionEntries: TransactionEntryResponse[];
}
