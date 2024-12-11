import { IMenu } from "./menu";
export interface IOrderdetails {
    id: number;
    orderId: number;
    menuId: number;
    amount: number;
    price: number;
    menu: IMenu;
}
