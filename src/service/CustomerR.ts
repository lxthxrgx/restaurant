import apiClient from "./ApiClient";
import { ICustomer } from "../model/customer";

export const getCustomer = async (): Promise<ICustomer[]> => {
  const response = await apiClient.get<ICustomer[]>("/api/Customer");
  return response.data;
};

export const createCustomer = async (employee: ICustomer): Promise<ICustomer> => {
    const response = await apiClient.post<ICustomer>("/api/Customer/Add", employee);
    return response.data;
  };  

export const updateCustomer = async (id: number, employee: Partial<ICustomer>): Promise<ICustomer> => {
  const response = await apiClient.put<ICustomer>(`/api/Customer/${id}`, employee);
  return response.data;
};

export const deleteCustomer = async (id: number): Promise<void> => {
  await apiClient.delete(`/api/Customer/${id}`);
};