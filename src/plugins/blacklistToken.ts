// can replace this later with a persistent database but this is a neat quick solution
const tokenBlacklist = new Set<string>();

export const addToBlacklist = (token: string) => {
  tokenBlacklist.add(token);
};

export const isBlacklisted = (token: string): boolean => {
  return tokenBlacklist.has(token);
};
