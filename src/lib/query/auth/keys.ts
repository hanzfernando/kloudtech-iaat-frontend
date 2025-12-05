export const authKeys = {
  root: ["auth"] as const,
  check: () => [...authKeys.root, "check"] as const,
};
