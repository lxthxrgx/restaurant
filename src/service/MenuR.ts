import apiClient from "./ApiClient";
import { IMenu } from "../model/menu";

interface ApiResponse {
  $values: IMenu[];
}

export const getMenu = async (): Promise<ApiResponse> => {
  const response = await apiClient.get<ApiResponse>("/api/Menu");
  return response.data;
};

export const createMenu = async (formData: FormData): Promise<IMenu> => {
  const response = await apiClient.post<IMenu>("/api/Menu/Add", formData);
  return response.data;
};

export const updateMenu = async (id: number, menu: Partial<IMenu>): Promise<IMenu> => {
  const response = await apiClient.put<IMenu>(`/api/Menu/${id}`, menu);
  return response.data;
};

export const deleteMenu = async (id: number): Promise<void> => {
  await apiClient.delete(`/api/Menu/${id}`);
};