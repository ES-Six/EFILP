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

export class User {
  constructor(
    public id: number,
    public role: string,
    public nom: string,
    public prenom: string) {}
}
