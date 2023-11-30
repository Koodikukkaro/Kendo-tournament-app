export interface ApiErrorMessage {
  message: string;
  context?: Record<string, { message: string; value: string }>;
}

export interface ApiErrorResponse {
  errors: ApiErrorMessage[];
}
