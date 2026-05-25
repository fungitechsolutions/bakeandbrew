"use client";

import { X } from "lucide-react";

interface DialogWrapperProps {
  open: boolean;
  onClose: () => void;
  ariaLabelledBy: string;
  role?: "dialog" | "alertdialog";
  children: React.ReactNode;
}

export function DialogWrapper({
  open,
  onClose,
  ariaLabelledBy,
  role = "dialog",
  children,
}: DialogWrapperProps) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="w-full max-w-[440px] bg-white rounded-2xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-3 duration-200"
        onClick={(e) => e.stopPropagation()}
        role={role}
        aria-modal="true"
        aria-labelledby={ariaLabelledBy}
      >
        {children}
      </div>
    </div>
  );
}

interface DialogHeaderProps {
  id: string;
  title: string;
  onClose: () => void;
}

export function DialogHeader({ id, title, onClose }: DialogHeaderProps) {
  return (
    <div className="flex items-center justify-between px-6 pt-5 pb-0">
      <h2
        id={id}
        className="font-[family-name:var(--font-lora)] text-[1.05rem] font-semibold text-[#1a1a1a]"
      >
        {title}
      </h2>
      <button
        onClick={onClose}
        aria-label="Close"
        className="w-8 h-8 rounded-lg flex items-center justify-center text-stone-400 hover:bg-stone-100 hover:text-stone-700 transition-colors cursor-pointer"
      >
        <X size={17} />
      </button>
    </div>
  );
}

export function DialogFooter({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-stone-100">
      {children}
    </div>
  );
}

interface GhostButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export function GhostButton({ children, ...props }: GhostButtonProps) {
  return (
    <button
      {...props}
      className="px-4 py-2 rounded-lg border border-stone-200 text-stone-500 text-sm font-[family-name:var(--font-dm-sans)] hover:border-stone-400 hover:text-stone-800 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {children}
    </button>
  );
}

interface PrimaryButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export function PrimaryButton({ children, ...props }: PrimaryButtonProps) {
  return (
    <button
      {...props}
      className="px-4 py-2 rounded-lg bg-[#2f4e40] text-[#fbfaf7] text-sm font-medium font-[family-name:var(--font-dm-sans)] hover:bg-[#3a5a49] transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {children}
    </button>
  );
}

interface FieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  onKeyDown?: (e: React.KeyboardEvent) => void;
  placeholder?: string;
  disabled?: boolean;
  error?: string | null;
  inputRef?: React.Ref<HTMLInputElement>;
}

export function DialogField({
  id,
  label,
  value,
  onChange,
  onKeyDown,
  placeholder,
  disabled,
  error,
  inputRef,
}: FieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={id}
        className="text-[0.8125rem] font-medium text-stone-600 font-[family-name:var(--font-dm-sans)]"
      >
        {label}
      </label>
      <input
        id={id}
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={onKeyDown}
        placeholder={placeholder}
        disabled={disabled}
        maxLength={120}
        className={[
          "w-full px-3.5 py-2.5 rounded-lg border text-sm text-[#1a1a1a] bg-stone-50 font-[family-name:var(--font-dm-sans)]",
          "outline-none transition-all",
          "focus:ring-2 focus:ring-[#2f4e40]/20 focus:border-[#2f4e40]",
          "disabled:opacity-60 disabled:cursor-not-allowed",
          error ? "border-red-400" : "border-stone-200",
        ].join(" ")}
      />
      {error && (
        <p className="text-xs text-red-500 font-[family-name:var(--font-dm-sans)]">
          {error}
        </p>
      )}
    </div>
  );
}
