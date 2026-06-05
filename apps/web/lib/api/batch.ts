import { BatchResponse, GetDistinctBatchesResponse } from "@repo/types";
import api from "../axios";

export const getDistinctBatches = async (): Promise<{
  batches: BatchResponse[];
}> => {
  const response = await api.get<GetDistinctBatchesResponse>(
    "/admin/students/batches",
  );

  return {
    batches: response.data.data,
  };
};
