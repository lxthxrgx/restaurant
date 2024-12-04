import apiClient from "./ApiClient";
import { IEmployee } from "../model/employee";

interface ApiResponse {
  $values: IEmployee[];
}

export const getEmployee = async (): Promise<ApiResponse> => {
  const response = await apiClient.get<ApiResponse>("/api/Employee");
  return response.data;
};

export const createEmployee = async (employee: IEmployee): Promise<IEmployee> => {
    const response = await apiClient.post<IEmployee>("/api/Employee/Add", employee);
    return response.data;
  };  

export const updateEmployee = async (id: number, employee: Partial<IEmployee>): Promise<IEmployee> => {
  const response = await apiClient.put<IEmployee>(`/api/Employee/${id}`, employee);
  return response.data;
};

export const deleteEmployee = async (id: number): Promise<void> => {
  await apiClient.delete(`/api/Employee/${id}`);
};