import { StatusToggle } from "@/components/admin/status-toggle";

export interface ToggleProps {
  checked: boolean;
  onChange: (v: boolean) => void;
  disabled?: boolean;
}

export function Toggle({ checked, onChange, disabled }: ToggleProps) {
  return (
    <StatusToggle
      checked={checked}
      disabled={disabled}
      onChange={() => onChange(!checked)}
    />
  );
}
