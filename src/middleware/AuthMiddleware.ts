import { Req } from "@tsed/common";
import { Middleware, MiddlewareMethods } from "@tsed/platform-middlewares";
import { UserTokenClaims } from "../models/user/TokenClaims";
import { Unauthorized } from "@tsed/exceptions";

@Middleware()
export class AuthMiddleware implements MiddlewareMethods {
  /**
   * A mapping of token strings to user claims.
   * This simulates different users based on the provided token.
   * This is for testing purposes only. Real implementations will not be like this.
   */
  private readonly tokenToClaimsMap: { [token: string]: UserTokenClaims } = {
    "valid-token-1": {
      userId: "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
      email: "user1@example.com"
    },
    "valid-token-2": {
      userId: "b2c3d4e5-f6a7-8901-bcde-f1234567890a",
      email: "user2@example.com"
    }
  };

  public async use(@Req() request: Req): Promise<void> {
    const authHeader = request.headers.authorization;

    // 1. Check if the Authorization header is present
    if (!authHeader) {
      console.log("Invalid header format:", authHeader);
      throw new Unauthorized("No authorization header provided.");
    }

    const parts = authHeader.split(" ");
    if (parts.length !== 2 || parts[0] !== "Bearer") {
      throw new Unauthorized("Invalid authorization header format. Expected 'Bearer <token>'.");
    }

    const token = parts[1];

    // 3. Simulate token decoding by mapping the token to user claims
    const claims = this.tokenToClaimsMap[token];
    if (!claims) {
      throw new Unauthorized("Invalid or expired token.");
    }

    request.claims = claims;
  }
}
