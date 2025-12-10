/**
 * Cache key generators for consistent cache key naming
 * Format: {resource}:{action}:{params}
 */

export const cacheKeys = {
  note: (userId: string, id: string) => `note:${userId}:${id}`,
  noteBySlug: (userId: string, slug: string) => `note:slug:${userId}:${slug}`,
  notesList: (
    userId: string,
    page?: string,
    limit?: string,
    search?: string
  ) => {
    const params = [userId, page || "1", limit || "10", search || ""].join(":");
    return `notes:list:${params}`;
  },
  /**
   * Get all common notes list cache keys for a user
   * Covers pages 1-10 with common limit values
   */
  allNotesListKeys: (userId: string) => {
    const keys: string[] = [];
    const limits = ["10", "20", "50"];
    for (let page = 1; page <= 10; page++) {
      for (const limit of limits) {
        keys.push(`notes:list:${userId}:${page}:${limit}:`);
      }
    }
    return keys;
  },
};
