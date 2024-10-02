import { UserTokenClaims } from "../models/user/TokenClaims";

declare global {
  namespace Express {
    interface Request {
      claims?: UserTokenClaims;
    }
  }
}

export {};
