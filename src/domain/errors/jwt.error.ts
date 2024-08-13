import { TOKEN_ERROR_CODES } from "../../config/index.ts";
import { CustomError } from "./custom.error.ts";

export function isJwtError(error: any): error is { code: string, message: string } {
  return error && typeof error === 'object' && TOKEN_ERROR_CODES.includes(error.code);
}

export class JwtError extends CustomError {
  constructor(public readonly statusCode: number, public readonly code: string, public readonly message: string) {
    super(statusCode, message)
  }

  static InvalidToken(code: string, message: string){
    return new JwtError(401, code, message)
  }
}