import { Request } from "express";
import { UserTokenClaims } from "../models/user/TokenClaims";

/**
 * Type guard to check if the request has valid user claims.
 */
export function hasValidUserId(req: Request): req is Request & { claims: UserTokenClaims } {
  return req.claims !== undefined && typeof req.claims.userId === "string";
}
