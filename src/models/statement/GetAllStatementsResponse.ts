import { CollectionOf, Property, Required } from "@tsed/schema";
import { GetStatementResponse } from "./GetStatementResponse";

export class GetAllStatementsResponse {
  @Required()
  @CollectionOf(GetStatementResponse)
  @Property()
  statements: GetStatementResponse[];
}
