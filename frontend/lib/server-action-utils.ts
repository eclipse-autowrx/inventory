'use server';

import { ServerActionError, ServerActionResult } from './server-action-types';

export const withServerActionHandler = async <T>(
  promise: Promise<T>
): Promise<Promise<ServerActionResult<T>>> => {
  try {
    const result = await promise;
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
