"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Loader2, X } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { AxiosError } from "axios";
import { toast } from "sonner";

import { uploadImage } from "@/lib/api/uploads";
import { useUpdateStudentImage } from "@/hooks/mutations/admin/students/useUpdateStudentImage";
import { APIError } from "@repo/types";
import { cn } from "@/lib/utils";
import { formatPersonName } from "@/lib/format-person-name";
import { Status, STATUS_META } from "./StudentDetail";

const ALLOWED_IMAGE_EXTENSIONS = [".jpg", ".jpeg", ".png", ".webp"];
const MAX_IMAGE_SIZE_BYTES = 2 * 1024 * 1024;

type StudentEditableAvatarProps = {
  studentId: string;
  photoUrl?: string | null;
  fullName: string;
  status: Status;
};

export function StudentEditableAvatar({
  studentId,
  photoUrl,
  fullName,
  status,
}: StudentEditableAvatarProps) {
  const router = useRouter();
  const meta = STATUS_META[status];
  const displayName = formatPersonName(fullName);
  const initials = displayName
    .split(" ")
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();

  const [previewUrl, setPreviewUrl] = useState<string | null>(photoUrl ?? null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const objectUrlRef = useRef<string | null>(null);
  const savedPhotoUrlRef = useRef(photoUrl ?? "");

  const { mutate: saveStudentImage, isPending: isSavingImage } =
    useUpdateStudentImage(studentId);

  const { mutate: uploadStudentPhoto, isPending: isUploadingImage } =
    useMutation({
      mutationFn: async (formData: FormData) => {
        const result = await uploadImage(formData);
        return result.data.imageUrl;
      },
      onSuccess: (imageUrl) => {
        saveStudentImage(
          { imageUrl },
          {
            onSuccess: () => {
              savedPhotoUrlRef.current = imageUrl;
              setPreviewUrl(imageUrl);
              if (objectUrlRef.current) {
                URL.revokeObjectURL(objectUrlRef.current);
                objectUrlRef.current = null;
              }
              router.refresh();
            },
            onError: () => {
              setPreviewUrl(savedPhotoUrlRef.current || null);
              if (fileInputRef.current) fileInputRef.current.value = "";
            },
          },
        );
      },
      onError: (error: AxiosError<APIError>) => {
        toast.error(error.response?.data.message ?? "Failed to upload image");
        if (objectUrlRef.current) {
          URL.revokeObjectURL(objectUrlRef.current);
          objectUrlRef.current = null;
        }
        setPreviewUrl(savedPhotoUrlRef.current || null);
        if (fileInputRef.current) fileInputRef.current.value = "";
      },
    });

  const isBusy = isUploadingImage || isSavingImage;

  useEffect(() => {
    const url = photoUrl ?? "";
    savedPhotoUrlRef.current = url;
    setPreviewUrl(url || null);
  }, [photoUrl]);

  useEffect(() => {
    return () => {
      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current);
      }
    };
  }, []);

  const handlePhotoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || isBusy) return;

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
    setPreviewUrl(nextUrl);

    const formData = new FormData();
    formData.append("image", file);
    uploadStudentPhoto(formData);
  };

  const handleRemovePhoto = (event: React.MouseEvent) => {
    event.stopPropagation();
    if (isBusy) return;

    saveStudentImage(
      { imageUrl: "" },
      {
        onSuccess: () => {
          if (objectUrlRef.current) {
            URL.revokeObjectURL(objectUrlRef.current);
            objectUrlRef.current = null;
          }
          savedPhotoUrlRef.current = "";
          setPreviewUrl(null);
          if (fileInputRef.current) fileInputRef.current.value = "";
          router.refresh();
        },
      },
    );
  };

  const avatarShellClass = cn(
    "relative h-20 w-20 overflow-hidden rounded-full border-2 border-white ring-2 ring-offset-2 ring-offset-white sm:h-24 sm:w-24",
    meta.ringClass,
  );

  const isBlobPreview = previewUrl?.startsWith("blob:") ?? false;

  return (
    <div className="flex flex-col items-start gap-2">
      <div
        role="button"
        tabIndex={isBusy ? -1 : 0}
        onClick={() => {
          if (!isBusy) fileInputRef.current?.click();
        }}
        onKeyDown={(event) => {
          if (isBusy) return;
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            fileInputRef.current?.click();
          }
        }}
        aria-label="Upload student photo"
        aria-disabled={isBusy}
        className="group relative w-fit shrink-0 cursor-pointer self-start aria-disabled:cursor-not-allowed"
      >
        <div className={avatarShellClass}>
          {previewUrl ? (
            isBlobPreview ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={previewUrl}
                alt={displayName}
                className="h-full w-full object-cover"
              />
            ) : (
              <Image
                src={previewUrl}
                alt={displayName}
                fill
                sizes="96px"
                className="object-cover"
                priority
              />
            )
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-[rgba(47,78,64,0.08)] transition-colors group-hover:bg-[rgba(47,78,64,0.12)]">
              <span className="font-(family-name:--font-lora) text-xl font-bold text-(--brand-green)">
                {initials}
              </span>
            </div>
          )}

          {isBusy ? (
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
          ) : null}
        </div>

        {previewUrl && !isBusy ? (
          <button
            type="button"
            onClick={handleRemovePhoto}
            className="absolute top-0 right-0 z-10 grid h-6 w-6 translate-x-1/4 -translate-y-1/4 cursor-pointer place-items-center rounded-full border border-[rgba(47,78,64,0.2)] bg-white text-[rgba(47,78,64,0.55)] shadow-sm transition-colors hover:bg-[#9a3412] hover:text-white"
            aria-label="Remove photo"
          >
            <X size={12} strokeWidth={2.5} />
          </button>
        ) : null}

        <span
          className={cn(
            "pointer-events-none absolute -bottom-0.5 -right-0.5 h-4 w-4 rounded-full border-2 border-white",
            meta.dotClass,
          )}
        />
      </div>

      <p className="text-left font-(family-name:--font-dm-sans) text-[0.72rem] leading-snug text-[rgba(47,78,64,0.45)]">
        {isBusy ? "Updating photo..." : "Click photo to update"}
      </p>

      <input
        ref={fileInputRef}
        type="file"
        accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={handlePhotoChange}
        disabled={isBusy}
      />
    </div>
  );
}
