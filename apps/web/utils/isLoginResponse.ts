import { LoginResponse } from "@repo/types";

export function isLoginResponse(error: any): error is LoginResponse {
  return (
    error &&
    typeof error === "object" &&
    "errors" in error &&
    "message" in error
  );
}
