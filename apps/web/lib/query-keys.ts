export const queryKeys = {
  bankAccounts: {
    all: ["admin-bank-accounts"] as const,

    list: (page: number) => ["admin-bank-accounts", "list", page] as const,

    details: (id: string) => ["admin-bank-accounts", "detail", id] as const,
  },
  banks: {
    all: ["admin-banks"] as const,
    detail: (id: string) => ["admin-banks", id] as const,
  },
};
