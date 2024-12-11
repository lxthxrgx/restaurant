import apiClient from "./ApiClient";
import { IOrder } from "../model/order";

interface ApiResponse {
  $values: IOrder[];
}

export const getMenu = async (): Promise<ApiResponse> => {
  const response = await apiClient.get<ApiResponse>("/api/Order");
  return response.data;
};

export const createOrder = async (orderData: any): Promise<IOrder> => {
  const response = await apiClient.post<IOrder>("/api/Order/Add", orderData, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return response.data;
};



export const updateMenu = async (id: number, menu: Partial<IOrder>): Promise<IOrder> => {
  const response = await apiClient.put<IOrder>(`/api/Order/${id}`, menu);
  return response.data;
};

export const deleteMenu = async (id: number): Promise<void> => {
  await apiClient.delete(`/api/Order/${id}`);
};