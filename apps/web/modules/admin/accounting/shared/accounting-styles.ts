export { inventoryTableClass as accountingTableClass } from "../../inventory/shared/inventory-styles";

export {
  inventoryTableScrollClass as accountingTableScrollClass,
  inventoryThClass as accountingThClass,
  inventoryTdClass as accountingTdClass,
  inventoryLabelClass as accountingLabelClass,
  inventoryFilterPanelClass as accountingFilterPanelClass,
  inventoryTableWrapClass as accountingTableWrapClass,
} from "../../inventory/shared/inventory-styles";

/** Opaque sticky header for scrollable ledger tables (semi-transparent th bg bleeds rows through). */
export const accountingStickyThClass =
  "sticky top-0 z-20 bg-white px-5 py-3.5 text-left align-middle font-(family-name:--font-dm-sans) text-[10px] font-semibold uppercase tracking-widest text-[rgba(47,78,64,0.45)] border-b border-[rgba(47,78,64,0.12)] whitespace-nowrap";

export const accountingLedgerTableClass =
  "w-max min-w-full border-separate border-spacing-0";

export const accountingStickyTfootClass = "sticky bottom-0 z-20 bg-white";

export const accountingStickyTfootRowClass =
  "border-t border-[rgba(47,78,64,0.12)] bg-white text-xs font-semibold";

export {
  InventoryFormField as AccountingFormField,
  InventoryFormSection as AccountingFormSection,
  inventoryFieldInputClass as accountingFieldInputClass,
  inventorySelectTriggerClass as accountingSelectTriggerClass,
} from "../../inventory/shared/InventoryFormField";

export { InventoryFilterShell as AccountingFilterShell } from "../../inventory/shared/InventoryFilterShell";
