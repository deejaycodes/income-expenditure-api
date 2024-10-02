import { PostgresDatasource } from "../database/datasources/PostgresDatasource";
import { Injectable, Service } from "@tsed/di";
import { Statements } from "../database/entities/IncomeExpenditureStatement";
import { BadRequest } from "@tsed/exceptions";
import { TransactionType } from "../enums/TransactionEnums";
import { CreateStatementRequest, CreateStatementResponse, GetAllStatementsResponse, GetStatementResponse } from "../models/statement";
import { ApiResponse, ResponseStatus } from "../models/types/ApiResponseTypes";

@Service()
@Injectable()
export class IEStatementService {
  protected statementRepository = PostgresDatasource.getRepository(Statements);
  async create(userId: string, ieStatementRequest: CreateStatementRequest): Promise<ApiResponse<CreateStatementResponse>> {
    if (!ieStatementRequest.transactionEntries || ieStatementRequest.transactionEntries.length === 0) {
      throw new BadRequest("At least one transaction entry is required.");
    }

    const totalIncome = ieStatementRequest.transactionEntries
      .filter((entry) => entry.type === TransactionType.INCOME)
      .reduce((sum, entry) => sum + entry.amount, 0);

    const totalExpenditure = ieStatementRequest.transactionEntries
      .filter((entry) => entry.type === TransactionType.EXPENDITURE)
      .reduce((sum, entry) => sum + entry.amount, 0);

    const disposableIncome = totalIncome - totalExpenditure;

    const ratio = totalIncome > 0 ? totalExpenditure / totalIncome : 0;

    const rating = this.getRating(ratio);

    const statement = this.statementRepository.create({
      transactionEntries: ieStatementRequest.transactionEntries,
      totalIncome,
      totalExpenditure,
      disposableIncome,
      rating,
      userId
    });

    const savedStatement = await this.statementRepository.save(statement);

    const response = new CreateStatementResponse();
    response.statementId = savedStatement.statementId;
    response.disposableIncome = savedStatement.disposableIncome;
    response.totalIncome = savedStatement.totalIncome;
    response.totalExpenditure = savedStatement.totalExpenditure;
    response.rating = savedStatement.rating;
    return {
      status: ResponseStatus.Success,
      statusCode: 201,
      message: "Statement created successfully",
      data: response
    };
  }

  async findByUser(userId: string): Promise<ApiResponse<GetAllStatementsResponse>> {
    const statements = await this.statementRepository.find({
      where: { user: { userId } },
      relations: ["transactionEntries"],
      order: { createdAt: "DESC" }
    });

    const statementsResponse: GetStatementResponse[] = statements.map((statement) => ({
      statementId: statement.statementId,
      totalIncome: statement.totalIncome,
      totalExpenditure: statement.totalExpenditure,
      disposableIncome: statement.disposableIncome,
      rating: statement.rating,
      createdAt: statement.createdAt,
      updatedAt: statement.updatedAt,
      transactionEntries: statement.transactionEntries
        ? statement.transactionEntries.map((entry) => ({
            id: entry.transactionId,
            description: entry.description,
            amount: entry.amount,
            type: entry.type,
            date: entry.date
          }))
        : []
    }));

    const allStatementsResponse = new GetAllStatementsResponse();
    allStatementsResponse.statements = statementsResponse;

    return {
      status: ResponseStatus.Success,
      data: allStatementsResponse,
      message: "Statements were successfully retrieved"
    };
  }

  async findById(userId: string, statementId: string): Promise<ApiResponse<GetStatementResponse>> {
    const statement = await this.statementRepository.findOne({
      where: { statementId, userId },
      relations: ["transactionEntries"]
    });

    if (!statement) {
      throw new BadRequest("Statement not found.");
    }

    const response: GetStatementResponse = {
      statementId: statement.statementId,
      totalIncome: statement.totalIncome,
      totalExpenditure: statement.totalExpenditure,
      disposableIncome: statement.disposableIncome,
      rating: statement.rating,
      createdAt: statement.createdAt,
      updatedAt: statement.updatedAt,
      transactionEntries: statement.transactionEntries.map((entry) => ({
        id: entry.transactionId,
        description: entry.description,
        amount: entry.amount,
        type: entry.type,
        date: entry.date
      }))
    };

    return {
      status: ResponseStatus.Success,
      data: response,
      message: "Statement was successfully retrieved"
    };
  }
  /**
   * Helper method to determine the I&E rating based on the expenditure-to-income ratio.
   * @param ratio - The expenditure-to-income ratio.
   * @returns The rating as a string.
   */
  getRating(ratio: number): string {
    if (ratio < 0.1) return "A";
    if (ratio >= 0.1 && ratio <= 0.3) return "B";
    if (ratio > 0.3 && ratio <= 0.5) return "C";
    return "D";
  }
}
