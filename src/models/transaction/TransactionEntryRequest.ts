import { MaxLength, Property, Required, Enum, Optional } from "@tsed/schema";
import { TransactionType } from "../../enums/TransactionEnums";
export class TransactionEntryRequest {
  @Required()
  @MaxLength(255)
  @Property()
  description: string;

  @Required()
  @Property()
  amount: number;

  @Required()
  @Enum(TransactionType)
  @Property()
  type: TransactionType;

  @Optional()
  @Property()
  date?: Date;
}
