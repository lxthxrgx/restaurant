import apiClient from "./ApiClient";
import { ITable } from "../model/table";

interface ApiResponse {
  $values: ITable[];
}

export const getTable = async (): Promise<ApiResponse> => {
  const response = await apiClient.get<ApiResponse>("/api/Table");
  return response.data;
};

export const createTable = async (table: ITable): Promise<ITable> => {
    const response = await apiClient.post<ITable>("/api/Table/Add", table);
    return response.data;
  };  

export const updateTable = async (id: number, table: Partial<ITable>): Promise<ITable> => {
  const response = await apiClient.put<ITable>(`/api/Table/${id}`, table);
  return response.data;
};

export const deleteTable = async (id: number): Promise<void> => {
  await apiClient.delete(`/api/Table/${id}`);
};