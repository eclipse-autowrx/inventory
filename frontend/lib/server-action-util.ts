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

export const withServerActionHandler = <T, Args extends unknown[] = []>(
  callback: (...args: Args) => Promise<T>
): ((...args: Args) => Promise<ServerActionResult<T>>) => {
  return async (...args: Args) => {
    try {
      const result = await callback(...args);
      return {
        success: true,
        result,
      };
    } catch (error) {
      if (error instanceof ServerActionError) {
        return {
          success: false,
          errorMessage:
            error.message || 'An error occurred during the server action.',
        };
      }
      throw error;
    }
  };
};
