"use client";

import { GraduationCap, Pencil, Trash2 } from "lucide-react";
import { AddBtn } from "./AddButton";
import { SectionCard } from "./SectionCard";
import { DeleteScholarshipDialog } from "./DeleteScholarshipDialog";
import { useState } from "react";
import { IconBtn } from "./IconButton";
import { ScholarshipFormModal } from "./ScholarshipFormModal";
import {
  APIError,
  StudentScholarshipInput,
  StudentScholarshipMutationResponse,
  StudentScholarshipResponse,
} from "@repo/types";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import api from "@/lib/axios";
import { toast } from "sonner";

type Props = {
  studentID: string;
  scholarship: Extract<StudentScholarshipResponse, { success: true }>["data"];
};

export function ScholarshipSection({ scholarship, studentID }: Props) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const router = useRouter();

  const addScholarship = useMutation<
    StudentScholarshipMutationResponse,
    AxiosError<APIError>,
    StudentScholarshipInput
  >({
    mutationFn: async (data: StudentScholarshipInput) => {
      try {
        const res = await api.post<StudentScholarshipMutationResponse>(
          `/admin/students/${studentID}/scholarships`,
          data,
        );

        if (!res.data.success) throw res.data;
        return res.data;
      } catch (error) {
        console.error("error: ", error);
        if (axios.isAxiosError(error)) throw error.response?.data;
        throw error;
      }
    },
    onSuccess: (result) => {
      toast.success(result.message);
      setShowAddModal(false);
      router.refresh();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
  const updateScholarship = useMutation<
    StudentScholarshipMutationResponse,
    AxiosError<APIError>,
    StudentScholarshipInput
  >({
    mutationFn: async (data: StudentScholarshipInput) => {
      try {
        const res = await api.put<StudentScholarshipMutationResponse>(
          `/admin/students/${studentID}/scholarships/${scholarship.id}`,
          data,
        );

        if (!res.data || !res.data.success) throw res.data;
        return res.data;
      } catch (error) {
        if (axios.isAxiosError<APIError>(error)) {
          throw (
            error.response?.data ?? {
              success: false,
              message: "Something went wrong",
              code: "UNKNOWN_ERROR",
              errors: [],
            }
          );
        }

        throw {
          success: false,
          message: "Unexpected error occurred",
          code: "UNKNOWN_ERROR",
          errors: [],
        };
      }
    },
    onSuccess: (result) => {
      toast.success(result.message);
      router.refresh();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
  const deleteScholarship = useMutation({
    mutationFn: async () => {
      const res = await api.delete<StudentScholarshipMutationResponse>(
        `/admin/students/${studentID}/scholarships/${scholarship.id}`,
      );

      if (!res.data || !res.data.success) throw res.data;
      return res.data;
    },
    onSuccess: (result) => {
      toast.success(result.message);
      router.refresh();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleDelete = async () => {
    await deleteScholarship.mutateAsync();
    setShowDeleteDialog(false);
  };

  const handleAdd = async (data: StudentScholarshipInput) => {
    await addScholarship.mutateAsync(data);
    setShowAddModal(false);
  };

  const handleEdit = async (data: StudentScholarshipInput) => {
    if (!scholarship) return;
    await updateScholarship.mutateAsync(data);

    setShowEditModal(false);
  };

  return (
    <SectionCard title="Scholarship" icon={GraduationCap}>
      {showDeleteDialog && (
        <DeleteScholarshipDialog
          onConfirm={handleDelete}
          isPending={deleteScholarship.isPending}
          onCancel={() => setShowDeleteDialog(false)}
        />
      )}
      {showAddModal && (
        <ScholarshipFormModal
          onSubmit={handleAdd}
          onCancel={() => setShowAddModal(false)}
          isPending={addScholarship.isPending}
        />
      )}
      {showEditModal && scholarship && (
        <ScholarshipFormModal
          initial={{
            percent: Number(scholarship.percent),
            note: scholarship.note ?? "",
          }}
          onSubmit={handleEdit}
          onCancel={() => setShowEditModal(false)}
          isPending={updateScholarship.isPending}
        />
      )}

      {scholarship ? (
        <div className="flex flex-col gap-3">
          <div className="rounded-xl border border-[#2d4a3e]/08 bg-[#f4f1ec]/50 px-4 py-3">
            <div className="flex items-start justify-between gap-2">
              <div className="flex flex-col gap-1">
                <div className="flex items-baseline gap-2">
                  <span
                    className="text-[1.4rem] font-bold text-[#2d4a3e]"
                    style={{ fontFamily: "var(--font-lora)" }}
                  >
                    {scholarship.percent}%
                  </span>
                  <span
                    className="text-[0.78rem] text-[#2d4a3e]/50"
                    style={{ fontFamily: "var(--font-dm-sans)" }}
                  >
                    scholarship
                  </span>
                </div>
                <span
                  className="text-[0.82rem] font-semibold text-[#2d4a3e]/70"
                  style={{ fontFamily: "var(--font-dm-sans)" }}
                >
                  − NPR {(scholarship.amount / 100).toLocaleString()}
                </span>
              </div>
              <div className="flex items-center gap-0.5">
                <IconBtn
                  icon={Pencil}
                  label="Edit"
                  onClick={() => setShowEditModal(true)}
                />
                <IconBtn
                  icon={Trash2}
                  label="Delete"
                  onClick={() => setShowDeleteDialog(true)}
                  variant="danger"
                />
              </div>
            </div>

            {scholarship.note && (
              <p
                className="mt-2 rounded-lg bg-amber-50 px-3 py-2 text-[0.78rem] italic leading-[1.5] text-amber-700"
                style={{ fontFamily: "var(--font-dm-sans)" }}
              >
                {scholarship.note}
              </p>
            )}

            <p
              className="mt-2 text-[0.72rem] text-[#2d4a3e]/40"
              style={{ fontFamily: "var(--font-dm-sans)" }}
            >
              Awarded by{" "}
              <span className="font-semibold text-[#2d4a3e]/60">
                {scholarship.addedByName}
              </span>{" "}
              ·{" "}
              {new Date(scholarship.createdAt).toLocaleDateString("en-NP", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </p>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-3 py-5">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#2d4a3e]/06">
            <GraduationCap
              className="h-5 w-5 text-[#2d4a3e]/30"
              strokeWidth={1.5}
            />
          </div>
          <p
            className="text-center text-[0.85rem] text-[#2d4a3e]/35"
            style={{ fontFamily: "var(--font-dm-sans)" }}
          >
            No scholarship awarded yet.
          </p>
          <AddBtn
            label="Award Scholarship"
            onClick={() => setShowAddModal(true)}
          />
        </div>
      )}
    </SectionCard>
  );
}
