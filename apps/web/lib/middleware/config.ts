export const ROLE_RULES: Record<string, string[]> = {
  "/admin": ["admin", "superadmin"],
  "/dashboard": ["student"],
  "/admission": ["student"],
};

export const UNAUTHENTICATED_ONLY_ROUTES = ["/auth"];
