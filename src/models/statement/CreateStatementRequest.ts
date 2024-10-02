import { CollectionOf, Property, Required } from "@tsed/schema";
import { TransactionEntryRequest } from "../transaction/TransactionEntryRequest";

export class CreateStatementRequest {
  @Required()
  @CollectionOf(TransactionEntryRequest)
  @Property()
  transactionEntries: TransactionEntryRequest[];
}
