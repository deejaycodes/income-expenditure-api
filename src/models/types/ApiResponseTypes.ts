import { Generics, Property } from "@tsed/schema";

export enum ResponseStatus {
  Success = "success",
  Error = "error",
  Fail = "fail"
}

@Generics("T")
export class ApiResponse<T> {
  @Property()
  status: ResponseStatus;

  @Property("T")
  data?: T;

  @Property()
  message?: string;

  @Property()
  statusCode?: number;
}
