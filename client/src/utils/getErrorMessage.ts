export const getErrorMessage = (error: unknown): string => {
  if (typeof error === "string") {
    return error;
  }

  if (error && typeof error === "object" && "data" in error) {
    const err = error as { data?: { message?: string } };
    return err.data?.message || "An error occurred. Please try again.";
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "An unexpected error occurred. Please try again.";
};
