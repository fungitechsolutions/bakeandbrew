"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Eye, EyeOff, Loader2, Lock, Save, UserRound, X } from "lucide-react";
import { toast } from "sonner";
import z from "zod";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";

import { AdminPageLayout } from "@/components/admin/admin-page-layout";
import {
  adminInputClass,
  adminPrimaryButtonClass,
} from "@/components/admin/admin-styles";
import { adminFieldErrorClass } from "@/components/admin/admin-drawer";
import { useUpdatePassword } from "@/hooks/mutations/admin/profile/useUpdatePassword";
import { useUpdateProfile } from "@/hooks/mutations/admin/profile/useUpdateProfile";
import { uploadImage } from "@/lib/api/uploads";
import { UserAvatar } from "@/modules/admin/users/UserAvatar";
import { useAuthStore } from "@/store/auth";
import { cn } from "@/lib/utils";
import {
  APIError,
  updatePasswordFormSchema,
  updateProfileInputSchema,
} from "@repo/types";

type ProfileErrors = { name?: string };
type PasswordErrors = {
  currentPassword?: string;
  newPassword?: string;
  confirmPassword?: string;
};

const SAME_PASSWORD_MESSAGE =
  "New password must be different from your current password";

function syncSamePasswordError(
  current: string,
  newPassword: string,
  prev: PasswordErrors,
): PasswordErrors {
  const next = { ...prev };
  if (current && newPassword && current === newPassword) {
    next.newPassword = SAME_PASSWORD_MESSAGE;
  } else if (next.newPassword === SAME_PASSWORD_MESSAGE) {
    next.newPassword = undefined;
  }
  return next;
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

const profileLabelClass =
  "font-(family-name:--font-dm-sans) text-[10px] font-semibold uppercase tracking-[0.12em] text-[rgba(47,78,64,0.5)]";

const ALLOWED_IMAGE_EXTENSIONS = [".jpg", ".jpeg", ".png", ".webp"];
const MAX_IMAGE_SIZE_BYTES = 2 * 1024 * 1024;

const PASSWORD_TIPS = [
  {
    id: "length",
    label: "At least 8 characters",
    test: (password: string) => password.length >= 8,
  },
  {
    id: "letter",
    label: "Includes a letter",
    test: (password: string) => /[a-zA-Z]/.test(password),
  },
  {
    id: "number",
    label: "Includes a number",
    test: (password: string) => /\d/.test(password),
  },
  {
    id: "case",
    label: "Mix of upper & lower case",
    test: (password: string) => /[a-z]/.test(password) && /[A-Z]/.test(password),
  },
  {
    id: "symbol",
    label: "Includes a symbol (!@#$…)",
    test: (password: string) => /[^a-zA-Z0-9]/.test(password),
  },
] as const;

function PasswordGuidance({
  password,
  currentPassword,
}: {
  password: string;
  currentPassword: string;
}) {
  const metCount = PASSWORD_TIPS.filter((tip) => tip.test(password)).length;
  const sameAsCurrent = Boolean(
    currentPassword && password && currentPassword === password,
  );

  return (
    <aside className="border border-[rgba(47,78,64,0.12)] bg-[rgba(47,78,64,0.03)] p-5 lg:sticky lg:top-24">
      <p className="font-(family-name:--font-dm-sans) text-[10px] font-semibold uppercase tracking-[0.12em] text-[rgba(47,78,64,0.45)]">
        Strong password
      </p>
      <h3 className="mt-1 font-(family-name:--font-lora) text-base font-bold text-(--brand-green)">
        What makes a good password
      </h3>
      <p className="mt-2 font-(family-name:--font-dm-sans) text-sm leading-relaxed text-[rgba(47,78,64,0.55)]">
        Use a unique password you do not reuse elsewhere. Avoid names, birthdays,
        or common words like &quot;password&quot;.
      </p>

      <ul className="mt-5 space-y-3">
        {sameAsCurrent ? (
          <li className="flex items-start gap-2.5">
            <span
              className="mt-0.5 grid h-4 w-4 shrink-0 place-items-center border border-[#9a3412] bg-[#9a3412] text-white"
              aria-hidden
            >
              <X size={10} strokeWidth={3} />
            </span>
            <span className="font-(family-name:--font-dm-sans) text-sm leading-snug text-[#9a3412]">
              {SAME_PASSWORD_MESSAGE}
            </span>
          </li>
        ) : null}
        {PASSWORD_TIPS.map((tip) => {
          const met = tip.test(password);
          return (
            <li key={tip.id} className="flex items-start gap-2.5">
              <span
                className={cn(
                  "mt-0.5 grid h-4 w-4 shrink-0 place-items-center border",
                  met
                    ? "border-(--brand-green) bg-(--brand-green) text-white"
                    : "border-[rgba(47,78,64,0.2)] bg-white text-transparent",
                )}
                aria-hidden
              >
                <Check size={10} strokeWidth={3} />
              </span>
              <span
                className={cn(
                  "font-(family-name:--font-dm-sans) text-sm leading-snug",
                  met ? "text-(--brand-green)" : "text-[rgba(47,78,64,0.55)]",
                )}
              >
                {tip.label}
              </span>
            </li>
          );
        })}
      </ul>

      <p className="mt-5 border-t border-[rgba(47,78,64,0.1)] pt-4 font-(family-name:--font-dm-sans) text-xs leading-relaxed text-[rgba(47,78,64,0.45)]">
        {password.length === 0
          ? "Start typing your new password to see which tips you meet."
          : metCount >= 4
            ? "Looking strong — this password meets most recommendations."
            : metCount >= 2
              ? "Getting there — try adding more variety for a stronger password."
              : "Keep going — aim for at least 8 characters with letters and numbers."}
      </p>
    </aside>
  );
}

type PasswordInputProps = {
  id: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  autoComplete?: string;
  placeholder?: string;
};

function PasswordInput({
  id,
  value,
  onChange,
  error,
  autoComplete,
  placeholder,
}: PasswordInputProps) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="flex flex-col gap-2">
      <div className="relative">
        <input
          id={id}
          type={visible ? "text" : "password"}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          autoComplete={autoComplete}
          className={cn(
            adminInputClass,
            "normal-case tracking-normal pr-11",
            error && "border-[#9a3412]",
          )}
        />
        <button
          type="button"
          onClick={() => setVisible((current) => !current)}
          className="absolute top-1/2 right-0 grid h-full w-11 -translate-y-1/2 cursor-pointer place-items-center text-[rgba(47,78,64,0.4)] transition-colors hover:text-(--brand-green)"
          aria-label={visible ? "Hide password" : "Show password"}
        >
          {visible ? (
            <EyeOff size={16} strokeWidth={1.75} />
          ) : (
            <Eye size={16} strokeWidth={1.75} />
          )}
        </button>
      </div>
      {error ? <span className={adminFieldErrorClass}>{error}</span> : null}
    </div>
  );
}

export function AdminProfile() {
  const user = useAuthStore((state) => state.user);

  const [name, setName] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [profileErrors, setProfileErrors] = useState<ProfileErrors>({});
  const [passwordErrors, setPasswordErrors] = useState<PasswordErrors>({});

  const fileInputRef = useRef<HTMLInputElement>(null);
  const objectUrlRef = useRef<string | null>(null);
  const savedImageUrlRef = useRef("");

  const { mutate: saveProfile, isPending: isSavingProfile } = useUpdateProfile();
  const { mutate: savePassword, isPending: isSavingPassword } =
    useUpdatePassword();

  const { mutate: uploadProfileImage, isPending: isUploadingImage } =
    useMutation({
      mutationFn: uploadImage,
      onSuccess: (result) => {
        toast.success(result.message);
        setImageUrl(result.data.imageUrl);
        setImagePreview(result.data.imageUrl);
        savedImageUrlRef.current = result.data.imageUrl;
        if (objectUrlRef.current) {
          URL.revokeObjectURL(objectUrlRef.current);
          objectUrlRef.current = null;
        }
      },
      onError: (error: AxiosError<APIError>) => {
        toast.error(error.response?.data.message ?? "Failed to upload image");
        if (objectUrlRef.current) {
          URL.revokeObjectURL(objectUrlRef.current);
          objectUrlRef.current = null;
        }
        const fallback = savedImageUrlRef.current;
        setImagePreview(fallback || null);
        if (fileInputRef.current) fileInputRef.current.value = "";
      },
    });

  useEffect(() => {
    if (!user) return;
    setName(user.name);
    const url = user.imageUrl ?? "";
    setImageUrl(url);
    setImagePreview(url || null);
    savedImageUrlRef.current = url;
  }, [user]);

  useEffect(() => {
    return () => {
      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current);
      }
    };
  }, []);

  const handlePhotoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const extension = `.${file.name.split(".").pop()?.toLowerCase() ?? ""}`;
    if (!ALLOWED_IMAGE_EXTENSIONS.includes(extension)) {
      toast.error("Only jpg, jpeg, png, and webp images are allowed.");
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    if (file.size > MAX_IMAGE_SIZE_BYTES) {
      toast.error("Image must be under 2MB.");
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
    }

    const nextUrl = URL.createObjectURL(file);
    objectUrlRef.current = nextUrl;
    setImagePreview(nextUrl);

    const formData = new FormData();
    formData.append("image", file);
    uploadProfileImage(formData);
  };

  const handleRemovePhoto = () => {
    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
      objectUrlRef.current = null;
    }
    setImageUrl("");
    setImagePreview(null);
    savedImageUrlRef.current = "";
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleProfileSave = (event: React.FormEvent) => {
    event.preventDefault();
    if (!user || isUploadingImage) return;

    const payload = {
      name: name.trim(),
      imageUrl,
    };

    const validation = updateProfileInputSchema.safeParse(payload);
    if (!validation.success) {
      const tree = z.treeifyError(validation.error).properties;
      setProfileErrors({
        name: tree?.name?.errors[0],
      });
      return;
    }

    setProfileErrors({});
    saveProfile(validation.data);
  };

  const handlePasswordSave = (event: React.FormEvent) => {
    event.preventDefault();

    const validation = updatePasswordFormSchema.safeParse({
      current_password: currentPassword,
      new_password: newPassword,
      confirmPassword,
    });

    if (!validation.success) {
      const tree = z.treeifyError(validation.error).properties;
      setPasswordErrors({
        currentPassword: tree?.current_password?.errors[0],
        newPassword: tree?.new_password?.errors[0],
        confirmPassword: tree?.confirmPassword?.errors[0],
      });
      return;
    }

    setPasswordErrors({});
    savePassword(
      {
        current_password: validation.data.current_password,
        new_password: validation.data.new_password,
      },
      {
        onSuccess: () => {
          setCurrentPassword("");
          setNewPassword("");
          setConfirmPassword("");
        },
        onError: (error) => {
          if (error.response?.status === 401) {
            setPasswordErrors({
              currentPassword:
                error.response.data.message ?? "Invalid current password",
            });
          }
        },
      },
    );
  };

  if (!user) {
    return (
      <AdminPageLayout title="Profile" description="Manage your account details.">
        <div className="border border-[rgba(47,78,64,0.18)] bg-white px-6 py-16 text-center">
          <p className="font-(family-name:--font-dm-sans) text-sm text-[rgba(47,78,64,0.55)]">
            Sign in to manage your profile.
          </p>
        </div>
      </AdminPageLayout>
    );
  }

  const displayName = name.trim() || user.name;

  return (
    <AdminPageLayout
      title="Profile"
      description="Manage how you appear in the admin panel and keep your account secure."
      maxWidth="default"
    >
      <div className="space-y-8">
        <form onSubmit={handleProfileSave}>
          <div className="overflow-hidden border border-[rgba(47,78,64,0.18)] bg-white">
            <div className="flex items-start justify-between gap-4 border-b border-[rgba(47,78,64,0.1)] bg-[rgba(47,78,64,0.03)] px-5 py-4 sm:px-6">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 grid h-9 w-9 place-items-center border border-[rgba(47,78,64,0.15)] bg-white text-(--brand-green)">
                  <UserRound size={16} strokeWidth={1.75} />
                </div>
                <div>
                  <h2 className="font-(family-name:--font-lora) text-lg font-bold text-(--brand-green)">
                    Profile & photo
                  </h2>
                  <p className="mt-0.5 max-w-md font-(family-name:--font-dm-sans) text-sm text-[rgba(47,78,64,0.55)]">
                    Your name and photo show in the sidebar and across the admin
                    panel.
                  </p>
                </div>
              </div>
              <button
                type="submit"
                disabled={isSavingProfile || isUploadingImage}
                className={cn(adminPrimaryButtonClass, "shrink-0")}
              >
                <Save size={14} />
                {isSavingProfile
                  ? "Saving..."
                  : isUploadingImage
                    ? "Uploading..."
                    : "Save profile"}
              </button>
            </div>

            <div className="grid gap-8 px-5 py-8 sm:px-6 lg:grid-cols-[auto_1fr] lg:items-start">
              <div className="flex flex-col items-center gap-2 sm:items-start">
                <div
                  role="button"
                  tabIndex={isUploadingImage ? -1 : 0}
                  onClick={() => {
                    if (!isUploadingImage) fileInputRef.current?.click();
                  }}
                  onKeyDown={(event) => {
                    if (isUploadingImage) return;
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      fileInputRef.current?.click();
                    }
                  }}
                  aria-label="Upload photo"
                  aria-disabled={isUploadingImage}
                  className="group relative cursor-pointer aria-disabled:cursor-not-allowed"
                >
                  {imagePreview ? (
                    <div className="relative h-24 w-24">
                      <UserAvatar
                        name={displayName}
                        imageUrl={imagePreview}
                        size="xl"
                        round
                      />
                      {isUploadingImage ? (
                        <div
                          className="absolute inset-0 grid place-items-center rounded-full bg-[rgba(47,78,64,0.45)]"
                          aria-live="polite"
                          aria-label="Uploading photo"
                        >
                          <Loader2
                            size={24}
                            strokeWidth={1.75}
                            className="animate-spin text-white"
                          />
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={(event) => {
                            event.stopPropagation();
                            handleRemovePhoto();
                          }}
                          className="absolute top-0 right-0 grid h-6 w-6 translate-x-1/4 -translate-y-1/4 cursor-pointer place-items-center rounded-full border border-[rgba(47,78,64,0.2)] bg-white text-[rgba(47,78,64,0.55)] shadow-sm transition-colors hover:bg-[#9a3412] hover:text-white"
                          aria-label="Remove photo"
                        >
                          <X size={12} strokeWidth={2.5} />
                        </button>
                      )}
                    </div>
                  ) : (
                    <div
                      className="relative flex h-24 w-24 items-center justify-center rounded-full border-2 border-[rgba(47,78,64,0.2)] bg-[rgba(47,78,64,0.06)] font-mono text-3xl font-bold text-(--brand-green) transition-colors group-hover:bg-[rgba(47,78,64,0.1)]"
                      aria-hidden={!isUploadingImage}
                    >
                      {isUploadingImage ? (
                        <Loader2
                          size={24}
                          strokeWidth={1.75}
                          className="animate-spin text-[rgba(47,78,64,0.4)]"
                          aria-label="Uploading photo"
                        />
                      ) : (
                        getInitials(displayName)
                      )}
                    </div>
                  )}
                </div>
                <p className="text-center font-(family-name:--font-dm-sans) text-[0.72rem] leading-snug text-[rgba(47,78,64,0.45)] sm:text-left">
                  Click photo to update
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
                  className="hidden"
                  onChange={handlePhotoChange}
                  disabled={isUploadingImage}
                />
              </div>

              <div className="flex max-w-md flex-col gap-2">
                <label htmlFor="profile-name" className={profileLabelClass}>
                  Display name
                </label>
                <input
                  id="profile-name"
                  type="text"
                  value={name}
                  onChange={(event) => {
                    setName(event.target.value);
                    setProfileErrors((prev) => ({ ...prev, name: undefined }));
                  }}
                  className={cn(
                    adminInputClass,
                    "normal-case tracking-normal",
                    profileErrors.name && "border-[#9a3412]",
                  )}
                  placeholder="How you want to be shown"
                  autoComplete="name"
                />
                {profileErrors.name ? (
                  <span className={adminFieldErrorClass}>{profileErrors.name}</span>
                ) : null}
              </div>
            </div>
          </div>
        </form>

        <form onSubmit={handlePasswordSave}>
          <div className="overflow-hidden border border-[rgba(47,78,64,0.18)] bg-white">
            <div className="flex items-start justify-between gap-4 border-b border-[rgba(47,78,64,0.1)] bg-[rgba(47,78,64,0.03)] px-5 py-4 sm:px-6">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 grid h-9 w-9 place-items-center border border-[rgba(47,78,64,0.15)] bg-white text-(--brand-green)">
                  <Lock size={16} strokeWidth={1.75} />
                </div>
                <div>
                  <h2 className="font-(family-name:--font-lora) text-lg font-bold text-(--brand-green)">
                    Password
                  </h2>
                  <p className="mt-0.5 max-w-md font-(family-name:--font-dm-sans) text-sm text-[rgba(47,78,64,0.55)]">
                    Choose a strong password. You will need your current password
                    to confirm the change.
                  </p>
                </div>
              </div>
              <button
                type="submit"
                disabled={isSavingPassword}
                className={cn(adminPrimaryButtonClass, "shrink-0")}
              >
                <Lock size={14} />
                {isSavingPassword ? "Updating..." : "Update password"}
              </button>
            </div>

            <div className="grid gap-8 px-5 py-8 sm:px-6 lg:grid-cols-[minmax(0,22rem)_1fr] lg:items-start">
              <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                  <label htmlFor="current-password" className={profileLabelClass}>
                    Current password
                  </label>
                  <PasswordInput
                    id="current-password"
                    value={currentPassword}
                    onChange={(value) => {
                      setCurrentPassword(value);
                      setPasswordErrors((prev) =>
                        syncSamePasswordError(value, newPassword, {
                          ...prev,
                          currentPassword: undefined,
                        }),
                      );
                    }}
                    error={passwordErrors.currentPassword}
                    autoComplete="current-password"
                    placeholder="Enter current password"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label htmlFor="new-password" className={profileLabelClass}>
                    New password
                  </label>
                  <PasswordInput
                    id="new-password"
                    value={newPassword}
                    onChange={(value) => {
                      setNewPassword(value);
                      setPasswordErrors((prev) =>
                        syncSamePasswordError(currentPassword, value, {
                          ...prev,
                          newPassword: undefined,
                        }),
                      );
                    }}
                    error={passwordErrors.newPassword}
                    autoComplete="new-password"
                    placeholder="At least 8 characters"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label htmlFor="confirm-password" className={profileLabelClass}>
                    Confirm new password
                  </label>
                  <PasswordInput
                    id="confirm-password"
                    value={confirmPassword}
                    onChange={(value) => {
                      setConfirmPassword(value);
                      setPasswordErrors((prev) => ({
                        ...prev,
                        confirmPassword: undefined,
                      }));
                    }}
                    error={passwordErrors.confirmPassword}
                    autoComplete="new-password"
                    placeholder="Re-enter new password"
                  />
                </div>
              </div>

              <PasswordGuidance
                password={newPassword}
                currentPassword={currentPassword}
              />
            </div>
          </div>
        </form>
      </div>
    </AdminPageLayout>
  );
}
