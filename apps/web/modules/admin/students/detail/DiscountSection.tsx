"use client";

import { useState } from "react";
import { SectionCard } from "./SectionCard";
import { DeleteDiscountDialog } from "./DeleteDiscountDialog";
import { AddBtn } from "./AddButton";
import { DiscountRow } from "./DiscountRow";
import { Percent } from "lucide-react";
import { DiscountFormModal } from "./DiscountFormModal";
import {
  CreateStudentDiscountRequest,
  CreateStudentDiscountResponse,
  DeleteStudentDiscountResponse,
  StudentDiscountMutationInput,
  StudentDiscountResponse,
  UpdateStudentDiscountRequest,
  UpdateStudentDiscountResponse,
} from "@repo/types";
import { useMutation } from "@tanstack/react-query";
import api from "@/lib/axios";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { APIError } from "@repo/types";
import axios, { AxiosError } from "axios";

type Discount = Extract<
  StudentDiscountResponse,
  { success: true }
>["data"][number];

type Props = {
  discounts: Extract<StudentDiscountResponse, { success: true }>["data"];
  studentID: string;
};

type CreateStudentDiscountPayload = StudentDiscountMutationInput & {
  studentID: string;
};
type UpdateStudentDiscountPayload = StudentDiscountMutationInput & {
  studentID: string;
};
export function DiscountSection({ discounts, studentID }: Props) {
  const [deleteTarget, setDeleteTarget] = useState<Discount | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editTarget, setEditTarget] = useState<Discount | null>(null);
  const router = useRouter();

  const addDiscount = useMutation<
    CreateStudentDiscountResponse,
    AxiosError<APIError>,
    CreateStudentDiscountPayload
  >({
    mutationFn: async (data: CreateStudentDiscountPayload) => {
      try {
        const res = await api.post<CreateStudentDiscountResponse>(
          `/admin/students/${data.studentID}/discounts`,
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
  const updateDiscount = useMutation<
    UpdateStudentDiscountResponse,
    AxiosError<APIError>,
    CreateStudentDiscountPayload
  >({
    mutationFn: async (data: UpdateStudentDiscountPayload) => {
      try {
        const res = await api.put<UpdateStudentDiscountResponse>(
          `/admin/students/${data.studentID}/discounts/${editTarget?.id}`,
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
      setEditTarget(null);
      router.refresh();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
  const deleteDiscount = useMutation({
    mutationFn: async (data: { studentID: string; discountID: string }) => {
      const res = await api.delete<DeleteStudentDiscountResponse>(
        `/admin/students/${data.studentID}/discounts/${data.discountID}`,
      );

      if (!res.data || !res.data.success) throw res.data;
      return res.data;
    },
    onSuccess: (result) => {
      toast.success(result.message);
      setDeleteTarget(null);
      router.refresh();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleDelete = async () => {
    if (!deleteTarget) return;
    deleteDiscount.mutate({
      studentID: studentID,
      discountID: deleteTarget.id,
    });
  };

  const handleAdd = async (data: CreateStudentDiscountRequest) => {
    await addDiscount.mutateAsync({ ...data, studentID: studentID });
  };

  const handleEdit = async (data: UpdateStudentDiscountRequest) => {
    if (!editTarget) return;
    await updateDiscount.mutateAsync({ ...data, studentID: studentID });
  };

  return (
    <SectionCard title="Discounts" icon={Percent}>
      {deleteTarget && (
        <DeleteDiscountDialog
          discount={deleteTarget}
          isDeleting={deleteDiscount.isPending}
          onConfirm={() => handleDelete()}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
      {showAddModal && (
        <DiscountFormModal
          onSubmit={handleAdd}
          isPending={addDiscount.isPending}
          onCancel={() => setShowAddModal(false)}
        />
      )}
      {editTarget && (
        <DiscountFormModal
          initial={{
            type: editTarget.type,
            percent: Number(editTarget.percent),
            note: editTarget.note ?? "",
          }}
          isPending={updateDiscount.isPending}
          onSubmit={handleEdit}
          onCancel={() => setEditTarget(null)}
        />
      )}

      <div className="mb-3 flex items-center justify-between">
        <p
          className="text-[0.82rem] text-[#2d4a3e]/50"
          style={{ fontFamily: "var(--font-dm-sans)" }}
        >
          {discounts.length} discount{discounts.length !== 1 ? "s" : ""}
        </p>
        <AddBtn label="Add" onClick={() => setShowAddModal(true)} />
      </div>

      {discounts.length === 0 ? (
        <p
          className="py-6 text-center text-[0.85rem] text-[#2d4a3e]/35"
          style={{ fontFamily: "var(--font-dm-sans)" }}
        >
          No discounts applied.
        </p>
      ) : (
        <div className="flex max-h-80 flex-col gap-2 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-[#2d4a3e]/20 scrollbar-track-transparent">
          {discounts.map((d) => (
            <DiscountRow
              key={d.id}
              discount={d}
              onEdit={() => setEditTarget(d)}
              onDelete={() => setDeleteTarget(d)}
            />
          ))}
        </div>
      )}

      {discounts.length > 0 && (
        <div className="mt-3 flex items-center justify-between border-t border-[#2d4a3e]/08 pt-3">
          <span
            className="text-[0.72rem] font-semibold uppercase tracking-[0.06em] text-[#2d4a3e]/40"
            style={{ fontFamily: "var(--font-dm-sans)" }}
          >
            Total Saved
          </span>
          <span
            className="text-[0.9rem] font-bold text-[#e8552a]"
            style={{ fontFamily: "var(--font-dm-sans)" }}
          >
            − NPR{" "}
            {discounts
              .reduce((sum, d) => sum + d.amount / 100, 0)
              .toLocaleString()}
          </span>
        </div>
      )}
    </SectionCard>
  );
}
