export type ServerActionResult<T> =
  | {
      success: true;
      result: T;
    }
  | {
      success: false;
      errorMessage: string;
    };

export class ServerActionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ServerActionError';
  }
}
