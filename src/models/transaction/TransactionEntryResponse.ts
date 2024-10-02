import { Enum, Property, Required } from "@tsed/schema";
import { TransactionType } from "../../enums/TransactionEnums";

export class TransactionEntryResponse {
  @Required()
  @Property()
  id: string;

  @Required()
  @Property()
  description: string;

  @Required()
  @Property()
  amount: number;

  @Required()
  @Enum(TransactionType)
  type: TransactionType;

  @Required()
  @Property()
  date: Date;
}
