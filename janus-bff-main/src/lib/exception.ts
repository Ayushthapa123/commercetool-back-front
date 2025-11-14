import { HttpStatusCode } from "axios";

/** Exception for any API specific error */
export class APIError extends Error {
  public readonly statusCode: number;
  constructor(message: string, statusCode: number) {
    super(message);
    // Set message to enumerable to include the field during serialization
    Object.defineProperty(this, "message", {
      value: message,
      enumerable: true,
      configurable: true,
      writable: true,
    });
    this.statusCode = statusCode;
  }
}

/** Exception denoting a resource was not found */
export class NotFoundError extends APIError {
  constructor(message: string) {
    super(message, HttpStatusCode.NotFound);
    this.name = "NotFoundError";
  }
}

/** Exception denoting an error handling a request */
export class BadRequestError extends APIError {
  constructor(message: string) {
    super(message, HttpStatusCode.BadRequest);
    this.name = "BadRequestError";
  }
}

export function isAPIError(error: unknown): error is APIError {
  return typeof error === "object" && error !== null && "statusCode" in error;
}

/** Exception denoting an error occurred in validation */
export class ValidationError extends BadRequestError {
  constructor(message: string) {
    super(message);
    this.name = "ValidationError";
  }
}

/** Exception denoting an invalid field is present in the request */
export class InvalidFieldError extends ValidationError {
  public readonly field: string;
  public readonly invalidValue: any;
  public readonly allowedValues: any[] = [];
  constructor(
    message: string,
    field: string,
    invalidValue: any,
    allowedValues: any[],
  ) {
    super(message);
    this.name = "InvalidFieldError";
    this.field = field;
    this.invalidValue = invalidValue;
    this.allowedValues = allowedValues;
  }
}

/** Exception denoting a required field is missing from the request */
export class RequiredFieldError extends ValidationError {
  public readonly field: string;
  constructor(message: string, field: string) {
    super(message);
    this.name = "RequiredFieldError";
    this.field = field;
  }
}
