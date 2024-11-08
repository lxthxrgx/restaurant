import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { OrderType } from "./OrderType";

@Entity()
export class Orders {
    @PrimaryGeneratedColumn()
    OrderId: number;
    
    @Column()
    OrderDate: Date;

    @ManyToOne(() => OrderType)
    @JoinColumn({ name: "OrderTypeId" })
    orderType: OrderType;
}
