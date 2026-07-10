import {
  adminTableClass,
  adminTableScrollClass,
} from "@/components/admin/admin-styles";

const thClass =
  "whitespace-nowrap px-4 py-3 text-left font-(family-name:--font-dm-sans) text-[10px] font-bold tracking-widest text-[rgba(47,78,64,0.45)] uppercase";

export function UsersTableSkeleton() {
  return (
    <div
      className={`${adminTableScrollClass} w-full animate-pulse border border-[rgba(47,78,64,0.18)] bg-white`}
    >
      <table className={`${adminTableClass} min-w-130`}>
        <thead>
          <tr className="border-b border-[rgba(47,78,64,0.12)] bg-[rgba(47,78,64,0.04)]">
            <th className={`${thClass} w-10`}>
              <div className="h-3 w-4 bg-[rgba(47,78,64,0.08)]" />
            </th>
            <th className={thClass}>
              <div className="h-3 w-10 bg-[rgba(47,78,64,0.08)]" />
            </th>
            <th className={`${thClass} hidden sm:table-cell`}>
              <div className="h-3 w-12 bg-[rgba(47,78,64,0.08)]" />
            </th>
            <th className={`${thClass} hidden md:table-cell`}>
              <div className="h-3 w-14 bg-[rgba(47,78,64,0.08)]" />
            </th>
            <th className={thClass}>
              <div className="h-3 w-10 bg-[rgba(47,78,64,0.08)]" />
            </th>
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: 8 }).map((_, i) => (
            <tr key={i} className="border-t border-[rgba(47,78,64,0.08)]">
              <td className="px-4 py-3">
                <div className="h-3 w-4 bg-[rgba(47,78,64,0.06)]" />
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 shrink-0 bg-[rgba(47,78,64,0.06)]" />
                  <div className="h-3 w-28 bg-[rgba(47,78,64,0.06)]" />
                </div>
              </td>
              <td className="hidden px-4 py-3 sm:table-cell">
                <div className="h-3 w-40 bg-[rgba(47,78,64,0.06)]" />
              </td>
              <td className="hidden px-4 py-3 md:table-cell">
                <div className="h-3 w-24 bg-[rgba(47,78,64,0.06)]" />
              </td>
              <td className="px-4 py-3">
                <div className="h-5 w-16 bg-[rgba(47,78,64,0.06)]" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
