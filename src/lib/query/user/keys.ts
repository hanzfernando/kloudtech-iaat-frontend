export const userKeys = {
  root: ["user"] as const,
  current: () => [...userKeys.root, "current"] as const,
};
