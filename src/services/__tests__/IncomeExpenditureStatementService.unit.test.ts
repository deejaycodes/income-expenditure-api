import { PlatformTest, Req } from "@tsed/common";
import { IEStatementService } from "../IncomeExpenditureStatementService";
import { CreateStatementRequest, CreateStatementResponse, GetAllStatementsResponse, GetStatementResponse } from "../../models/statement";
import { ApiResponse, ResponseStatus } from "../../models/types/ApiResponseTypes";
import { TransactionType } from "../../enums/TransactionEnums";
import { PostgresDatasource } from "../../database/datasources/PostgresDatasource";
import { AuthMiddleware } from "../../middleware/AuthMiddleware";

jest.mock("../../database/datasources/PostgresDatasource", () => ({
  PostgresDatasource: {
    getRepository: jest.fn()
  }
}));
function isSuccessResponse<T>(response: ApiResponse<T>): response is ApiResponse<T> & { data: T } {
  return response.status === ResponseStatus.Success && response.data !== undefined;
}

interface MockStatementRepository {
  create: jest.Mock;
  save: jest.Mock;
  find: jest.Mock;
  findOne: jest.Mock;
}
describe("IEStatementService", () => {
  let statementService: IEStatementService;
  let mockStatementRepo: MockStatementRepository;
  const tokenClaimUserId = "2666bd5a-ba80-4d2a-b235-63898dc62c27";
  beforeAll(async () => {
    await PlatformTest.create();
    const authMiddleware = PlatformTest.get<AuthMiddleware>(AuthMiddleware);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    jest.spyOn(authMiddleware, "use").mockImplementation((req: Req): Promise<any> => {
      req.claims = {
        email: "test@example.com",
        userId: tokenClaimUserId
      };
      return Promise.resolve();
    });
  });

  afterAll(async () => {
    await PlatformTest.reset();
  });

  beforeEach(() => {
    jest.clearAllMocks();

    mockStatementRepo = {
      create: jest.fn(),
      save: jest.fn(),
      findOne: jest.fn(),
      find: jest.fn()
    };

    (PostgresDatasource.getRepository as jest.Mock).mockReturnValue(mockStatementRepo);

    statementService = new IEStatementService();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("create", () => {
    it("should create a new statement and return the statement ID", async () => {
      const payload: CreateStatementRequest = {
        transactionEntries: [
          {
            description: "Salary",
            amount: 5000,
            type: TransactionType.INCOME,
            date: new Date("2024-10-02T10:00:00Z")
          },
          {
            description: "Rent",
            amount: 2000,
            type: TransactionType.EXPENDITURE,
            date: new Date("2024-10-02T10:00:00Z")
          }
        ]
      };

      // Mock the repository behavior
      const mockStatement = {
        statementId: "statement123",
        totalIncome: 5000,
        totalExpenditure: 2000,
        disposableIncome: 3000,
        rating: "C",
        userId: tokenClaimUserId
      };

      mockStatementRepo.create.mockReturnValue(mockStatement);
      mockStatementRepo.save.mockResolvedValue(mockStatement);

      const result: ApiResponse<CreateStatementResponse> = await statementService.create(tokenClaimUserId, payload);

      expect(result.status).toBe(ResponseStatus.Success);
      expect(result.statusCode).toBe(201);
      expect(result.data?.statementId).toBe("statement123");

      expect(mockStatementRepo.create).toHaveBeenCalledWith({
        transactionEntries: payload.transactionEntries,
        totalIncome: mockStatement.totalIncome,
        totalExpenditure: mockStatement.totalExpenditure,
        disposableIncome: mockStatement.disposableIncome,
        rating: mockStatement.rating,
        userId: tokenClaimUserId
      });
      expect(mockStatementRepo.save).toHaveBeenCalledWith(mockStatement);
    });
  });

  describe("findByUser", () => {
    it("should return all statements for a given user", async () => {
      const userId = tokenClaimUserId;
      const mockStatements = [
        {
          statementId: "statement1",
          totalIncome: 5000,
          totalExpenditure: 2000,
          disposableIncome: 3000,
          rating: "B",
          createdAt: new Date(),
          updatedAt: new Date(),
          transactionEntries: [
            {
              transactionId: "trans1",
              description: "Salary",
              amount: 5000,
              type: "income",
              transactionCreatedAt: new Date()
            },
            {
              transactionId: "trans2",
              description: "Rent",
              amount: 2000,
              type: "expenditure",
              transactionCreatedAt: new Date()
            }
          ],
          user: { tokenClaimUserId }
        },
        {
          statementId: "statement2",
          totalIncome: 4000,
          totalExpenditure: 1500,
          disposableIncome: 2500,
          rating: "A",
          createdAt: new Date(),
          updatedAt: new Date(),
          transactionEntries: [
            {
              transactionId: "trans3",
              description: "Consulting",
              amount: 4000,
              type: "income",
              transactionCreatedAt: new Date()
            },
            {
              transactionId: "trans4",
              description: "Supplies",
              amount: 1500,
              type: "expenditure",
              transactionCreatedAt: new Date()
            }
          ],
          user: { userId }
        }
      ];

      mockStatementRepo.find.mockResolvedValue(mockStatements);

      const result: ApiResponse<GetAllStatementsResponse> = await statementService.findByUser(userId);

      if (isSuccessResponse(result)) {
        expect(result.data.statements.length).toBe(2);
        expect(result.data.statements[0].statementId).toBe("statement1");
        expect(result.data.statements[1].rating).toBe("A");
      } else {
        fail("Expected 'data' to be defined when status is Success.");
      }
      expect(mockStatementRepo.find).toHaveBeenCalledWith({
        where: { user: { userId } },
        relations: ["transactionEntries"],
        order: { createdAt: "DESC" }
      });
    });
  });

  describe("findById", () => {
    it("should return the statement when found", async () => {
      const statementId = "statement123";
      const mockStatement = {
        statementId,
        totalIncome: 5000,
        totalExpenditure: 2000,
        disposableIncome: 3000,
        rating: "B",
        transactionEntries: [],
        userId: tokenClaimUserId
      };

      mockStatementRepo.findOne.mockResolvedValue(mockStatement);

      const result: ApiResponse<GetStatementResponse> = await statementService.findById(tokenClaimUserId, statementId);

      expect(result.data?.statementId).toBe(statementId);
      expect(result.data?.totalIncome).toBe(mockStatement.totalIncome);
      expect(result.data?.totalExpenditure).toBe(mockStatement.totalExpenditure);
      expect(mockStatementRepo.findOne).toHaveBeenCalledWith({
        where: { statementId, userId: tokenClaimUserId },
        relations: ["transactionEntries"]
      });
    });

    it("should throw an error if statement is not found", async () => {
      const statementId = "statement123";

      mockStatementRepo.findOne.mockResolvedValue(undefined);

      await expect(statementService.findById(tokenClaimUserId, statementId)).rejects.toThrow("Statement not found.");
      expect(mockStatementRepo.findOne).toHaveBeenCalledWith({
        where: { statementId, userId: tokenClaimUserId },
        relations: ["transactionEntries"]
      });
    });
  });

  describe("getRating", () => {
    it("should calculate the correct rating based on ratio", () => {
      const service = statementService;
      expect(service.getRating(0.05)).toBe("A");
      expect(service.getRating(0.2)).toBe("B");
      expect(service.getRating(0.4)).toBe("C");
      expect(service.getRating(0.6)).toBe("D");
    });
  });
});
