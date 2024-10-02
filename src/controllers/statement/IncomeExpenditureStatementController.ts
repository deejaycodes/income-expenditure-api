import { Controller, Post, Get, BodyParams, PathParams, Req, UseAuth } from "@tsed/common";
import { Inject } from "@tsed/di";
import { IEStatementService } from "../../services/IncomeExpenditureStatementService";
import { Format, Returns } from "@tsed/schema";
import {
  GetAllStatementsResponse,
  GetStatementResponse,
  CreateStatementRequest,
  CreateStatementResponse
} from "../../models/statement/index";
import { ApiResponse } from "../../models/types/ApiResponseTypes";
import { AuthMiddleware } from "../../middleware/AuthMiddleware";
import { Unauthorized } from "@tsed/exceptions";
import { hasValidUserId } from "../../helpers/typeGuards";

@UseAuth(AuthMiddleware)
@Controller("/statements")
export class StatementController {
  @Inject(IEStatementService)
  protected statementService: IEStatementService;

  @Post("/")
  @(Returns(201, ApiResponse).Of(CreateStatementResponse))
  async createStatement(
    @Req() request: Req,
    @BodyParams() statementRequestData: CreateStatementRequest
  ): Promise<ApiResponse<CreateStatementResponse>> {
    if (!hasValidUserId(request)) {
      throw new Unauthorized("User not authenticated");
    }
    return this.statementService.create(request.claims.userId, statementRequestData);
  }

  @Get("/:statementId")
  @(Returns(200, ApiResponse).Of(GetStatementResponse))
  async getStatement(
    @Req() request: Req,
    @PathParams("statementId") @Format("uuid") statementId: string
  ): Promise<ApiResponse<GetStatementResponse>> {
    if (!hasValidUserId(request)) {
      throw new Unauthorized("User not authenticated");
    }
    return this.statementService.findById(request.claims.userId, statementId);
  }

  @Get("/")
  @(Returns(200, ApiResponse).Of(GetAllStatementsResponse))
  async getAllStatements(@Req() req: Req): Promise<ApiResponse<GetAllStatementsResponse>> {
    if (!hasValidUserId(req)) {
      throw new Unauthorized("User not authenticated");
    }
    return this.statementService.findByUser(req.claims.userId);
  }
}
