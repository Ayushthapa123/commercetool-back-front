import { IError } from "@/lib/utils";
import { NextResponse } from "next/server";

/** Wrapper type for Responses in route handlers */
export type APIResponse<T> = Promise<NextResponse<T | IError>>;

/** Wrapper type for optional values */
export type Optional<T> = T | undefined;

/** Wrapper type for nullable values */
export type Nullable<T> = T | null;

/** An interface for validating application specific objects */
export interface Validator<T> {
  /**
   * Validates the provided target object
   * @param obj the target object
   */
  validate: (obj: T) => void;
}

/** An interface for parsing a provided input into a defined data structure */
export interface Parser<T, R> {
  parse(value: T): R;
}
