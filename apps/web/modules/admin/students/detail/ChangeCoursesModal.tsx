"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { BookOpen, Check } from "lucide-react";
import { toast } from "sonner";
import {
  APIError,
  ChangeStudentCourses,
  ChangeStudentCoursesResponse,
  CourseChangeSummary,
  CoursesList,
  StudentEnrolledCourses,
} from "@repo/types";
import api from "@/lib/axios";
import { queryKeys } from "@/lib/query-keys";
import { cn } from "@/lib/utils";
import { Spinner } from "@/components/ui/spinner";
import { ModalShell } from "./shared/ModalShell";
import { detailLabelClass, detailValueClass } from "./detail-styles";
import { formatNpr } from "../shared/student-utils";
import {
  COURSE_CHANGE_CONFIRMATION,
  CourseChangeConfirmation,
} from "./CourseChangeConfirmation";

const CONFIRMATION_REQUIRED_CODE = "COURSE_CHANGE_CONFIRMATION_REQUIRED";
const PREVIEW_OUTDATED_CODE = "COURSE_CHANGE_PREVIEW_OUTDATED";

type EnrolledCourse = Extract<
  StudentEnrolledCourses,
  { success: true }
>["data"][number];

type CourseOption = {
  id: string;
  name: string;
  // paisa: the enrolled fee for a course they already have, otherwise the current fee
  fee: number;
  inactive: boolean;
};

export function ChangeCoursesModal({
  studentId,
  currentCourses,
  hasMoneyRecords,
  onClose,
}: {
  studentId: string;
  currentCourses: EnrolledCourse[];
  // payments, discounts or a scholarship: the change carries them over and
  // needs a preview and a typed confirmation
  hasMoneyRecords: boolean;
  onClose: () => void;
}) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [selectedIds, setSelectedIds] = useState(() =>
    currentCourses.map((course) => course.id),
  );
  // set once the server has worked out the change: the confirmation step
  const [preview, setPreview] = useState<CourseChangeSummary | null>(null);
  const [reason, setReason] = useState("");
  const [confirmText, setConfirmText] = useState("");

  const {
    data: activeCourses,
    isLoading,
    isError,
  } = useQuery({
    queryKey: queryKeys.courses.active,
    queryFn: async () => {
      const res = await api.get<CoursesList>("/courses");
      if (!res.data.success) throw new Error(res.data.message);
      return res.data.data;
    },
    // fees and active courses can change on the admin courses page
    staleTime: 0,
  });

  // a 409 means the student's records changed since this page loaded
  const handleConflict = (error: AxiosError<APIError>) => {
    if (error.response?.status !== 409) return false;
    router.refresh();
    onClose();
    return true;
  };

  const { mutate: loadPreview, isPending: isPreviewing } = useMutation<
    ChangeStudentCoursesResponse,
    AxiosError<APIError>,
    string[]
  >({
    mutationFn: async (courseIds) => {
      const res = await api.put<ChangeStudentCoursesResponse>(
        `/admin/students/${studentId}/courses`,
        { courseIds, dryRun: true } satisfies ChangeStudentCourses,
      );
      return res.data;
    },
    onSuccess: (result) => {
      if (!result.data) {
        toast.info(result.message);
        return;
      }
      setPreview(result.data);
    },
    onError: (error) => {
      toast.error(
        error.response?.data.message ?? "Failed to work out the course change",
      );
      if (handleConflict(error)) return;
      queryClient.invalidateQueries({ queryKey: queryKeys.courses.active });
    },
  });

  const { mutate: save, isPending: isSaving } = useMutation<
    ChangeStudentCoursesResponse,
    AxiosError<APIError>,
    ChangeStudentCourses
  >({
    mutationFn: async (data) => {
      const res = await api.put<ChangeStudentCoursesResponse>(
        `/admin/students/${studentId}/courses`,
        data,
      );
      return res.data;
    },
    onSuccess: (result) => {
      toast.success(result.message);
      queryClient.invalidateQueries({
        queryKey: queryKeys.courseChanges.student(studentId),
      });
      router.refresh();
      onClose();
    },
    onError: (error, variables) => {
      const code = error.response?.data.code;
      // payments or adjustments changed after the preview: show the new
      // numbers and ask again rather than saving ones the admin didn't see
      if (code === PREVIEW_OUTDATED_CODE) {
        const fresh = (
          error.response?.data as ChangeStudentCoursesResponse | undefined
        )?.data;
        toast.warning(error.response?.data.message);
        setConfirmText("");
        if (fresh) setPreview(fresh);
        else loadPreview(variables.courseIds);
        return;
      }
      // the page didn't know about a payment, discount or scholarship: show
      // the confirmation step instead of failing
      if (code === CONFIRMATION_REQUIRED_CODE) {
        setConfirmText("");
        loadPreview(variables.courseIds);
        return;
      }
      toast.error(error.response?.data.message ?? "Failed to change course");
      if (handleConflict(error)) return;
      // a course may have been deactivated or removed since the list loaded
      queryClient.invalidateQueries({ queryKey: queryKeys.courses.active });
    },
  });

  const isPending = isPreviewing || isSaving;

  const enrolledOptions: CourseOption[] = currentCourses.map((course) => ({
    id: course.id,
    name: course.name,
    fee: course.feeAtEnrollment,
    inactive: !course.isActive,
  }));
  const options: CourseOption[] = [
    ...enrolledOptions,
    ...(activeCourses ?? [])
      .filter((course) => !currentCourses.some((c) => c.id === course.id))
      .map((course) => ({ ...course, inactive: false })),
  ];

  const toggle = (id: string) =>
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id],
    );

  const hasChanges =
    selectedIds.length !== currentCourses.length ||
    selectedIds.some((id) => !currentCourses.some((c) => c.id === id));

  const currentTotal = currentCourses.reduce(
    (sum, course) => sum + course.feeAtEnrollment,
    0,
  );
  const newTotal = options
    .filter((option) => selectedIds.includes(option.id))
    .reduce((sum, option) => sum + option.fee, 0);

  const handleSubmit = () => {
    if (preview) {
      save({
        courseIds: selectedIds,
        confirmation: preview.requiresConfirmation ? confirmText : undefined,
        reason: reason.trim() || undefined,
        expected: {
          totalPaid: preview.totalPaid,
          newTotalFee: preview.newTotalFee,
          newAdjustments: preview.newAdjustments,
          excessAmount: preview.excessAmount,
          requiresConfirmation: preview.requiresConfirmation,
        },
      });
      return;
    }
    if (hasMoneyRecords) {
      loadPreview(selectedIds);
      return;
    }
    save({ courseIds: selectedIds });
  };

  const confirmed =
    !preview?.requiresConfirmation ||
    confirmText === COURSE_CHANGE_CONFIRMATION;

  return (
    <ModalShell
      title="Change Course"
      icon={BookOpen}
      onCancel={() => {
        if (!isPending) onClose();
      }}
      onSubmit={handleSubmit}
      submitLabel={
        preview ? "Change Course" : hasMoneyRecords ? "Continue" : "Save Changes"
      }
      submitting={isPending}
      submitDisabled={
        preview
          ? !confirmed
          : isLoading || isError || !selectedIds.length || !hasChanges
      }
    >
      {preview ? (
        <CourseChangeConfirmation
          summary={preview}
          reason={reason}
          onReasonChange={setReason}
          confirmText={confirmText}
          onConfirmTextChange={setConfirmText}
          onBack={() => {
            setPreview(null);
            setConfirmText("");
          }}
          disabled={isPending}
        />
      ) : isLoading ? (
        <div className="flex justify-center py-6">
          <Spinner />
        </div>
      ) : isError ? (
        <p
          role="alert"
          className="font-(family-name:--font-dm-sans) text-sm text-[#9a3412]"
        >
          Could not load the course list. Please close this and try again.
        </p>
      ) : (
        <>
          <div
            role="group"
            aria-label="Courses"
            className="flex max-h-72 flex-col gap-2 overflow-y-auto"
          >
            {options.map((option) => {
              const selected = selectedIds.includes(option.id);
              return (
                <button
                  key={option.id}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => toggle(option.id)}
                  className={cn(
                    "flex items-center justify-between gap-3 border px-4 py-3 text-left transition-colors",
                    selected
                      ? "border-(--brand-green) bg-[rgba(47,78,64,0.05)]"
                      : "border-[rgba(47,78,64,0.12)] hover:border-[rgba(47,78,64,0.3)]",
                  )}
                >
                  <span className="flex min-w-0 items-center gap-2.5">
                    <span
                      className={cn(
                        "grid h-4 w-4 shrink-0 place-items-center border",
                        selected
                          ? "border-(--brand-green) bg-(--brand-green) text-white"
                          : "border-[rgba(47,78,64,0.3)]",
                      )}
                    >
                      {selected ? <Check size={12} strokeWidth={3} /> : null}
                    </span>
                    <span className={detailValueClass}>
                      {option.name}
                      {option.inactive ? " (inactive)" : ""}
                    </span>
                  </span>
                  <span className="font-(family-name:--font-dm-sans) text-sm font-semibold tabular-nums text-(--brand-green)">
                    {formatNpr(option.fee / 100)}
                  </span>
                </button>
              );
            })}
          </div>

          {hasMoneyRecords ? (
            <p className="font-(family-name:--font-dm-sans) text-xs text-[rgba(47,78,64,0.55)]">
              This student has payments or adjustments. They&apos;ll be carried
              over to the new courses; you&apos;ll see the new balance before
              confirming.
            </p>
          ) : null}

          {!selectedIds.length ? (
            <p
              role="alert"
              className="font-(family-name:--font-dm-sans) text-xs text-[#9a3412]"
            >
              Please select at least one course.
            </p>
          ) : null}

          <div className="flex items-center justify-between gap-3 border-t border-[rgba(47,78,64,0.12)] pt-3">
            <span className={detailLabelClass}>Total fee</span>
            <span className="font-(family-name:--font-dm-sans) text-sm font-semibold tabular-nums text-(--brand-green)">
              {formatNpr(currentTotal / 100)} → {formatNpr(newTotal / 100)}
            </span>
          </div>
        </>
      )}
    </ModalShell>
  );
}
