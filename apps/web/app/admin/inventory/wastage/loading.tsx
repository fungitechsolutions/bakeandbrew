import { InventoryTransactionPageSkeleton } from "@/modules/admin/inventory/shared/InventoryTransactionPageSkeleton";

export default function Loading() {
  return (
    <InventoryTransactionPageSkeleton
      title="Wastage"
      description="Track damaged, expired, or lost inventory."
      actionWidth="w-32"
      variant="wastage"
    />
  );
}
