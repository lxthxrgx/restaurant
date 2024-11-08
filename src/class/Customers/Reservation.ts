import { Entity, Column, ManyToOne, PrimaryGeneratedColumn, JoinColumn, OneToOne } from "typeorm";
import { DiningTables } from "../DiningTable/DiningTables";
import { Customers } from "./Customers";

@Entity()
export class Reservation {
    @PrimaryGeneratedColumn()
    ReservationID: number;

    @Column()
    ReservationDate: Date;

    @ManyToOne(() => Customers)
    @JoinColumn({ name: "CustomerId" })
    customer: Customers;

    @OneToOne(() => DiningTables)
    @JoinColumn({ name: "DiningTableId" })
    diningTable: DiningTables;
}
