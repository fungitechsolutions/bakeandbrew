import { User } from "@repo/types";

interface StatsBarProps {
  users: User[];
  total: number;
  roleCount: {
    student: number;
    admin: number;
    instructor: number;
  };
}

interface StatItem {
  label: string;
  count: number;
}

export function StatsBar({ users, total, roleCount }: StatsBarProps) {
  const stats: StatItem[] = [
    { label: "Total", count: total },
    { label: "Students", count: roleCount.student },
    { label: "Admins", count: roleCount.admin },
    { label: "Instructors", count: roleCount.instructor },
    // { label: "Superadmins", count: countByRole("superadmin") },
  ];

  return (
    <div className="mb-8 grid grid-cols-2 gap-0 border border-[rgba(47,78,64,0.18)] bg-white sm:grid-cols-4">
      {stats.map((stat, i) => (
        <div
          key={stat.label}
          className={`px-5 py-4 ${i < stats.length - 1 ? "border-r border-[rgba(47,78,64,0.15)]" : ""}`}
        >
          <p className="mb-1 font-mono text-xs tracking-widest text-[rgba(47,78,64,0.55)] uppercase">
            {stat.label}
          </p>
          <p className="font-mono text-2xl font-bold text-(--brand-green)">
            {stat.count}
          </p>
        </div>
      ))}
    </div>
  );
}
