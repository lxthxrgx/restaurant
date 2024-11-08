import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { Orders } from "./Order/Orders";

@Entity()
export class Bills {
    @PrimaryGeneratedColumn()
    BillId: number;

    @ManyToOne(() => Orders)
    @JoinColumn({ name: "orderId" })
    order: Orders;

    @Column()
    BillDate: Date;

    @Column("float")
    Amount: number;

    @Column("float")
    Discount: number;
}
