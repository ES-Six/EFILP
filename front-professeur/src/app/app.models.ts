export class ApiSuccessResponse<T extends Object> {
  constructor(
    public results: T,
    public message: string,
    public code: number) {}
}

export class ApiErrorResponse {
  constructor(
    public message: string | string[],
    public code: number) {}
}

export class ApiAuthResponse {
  constructor(
    public token: string) {}
}
