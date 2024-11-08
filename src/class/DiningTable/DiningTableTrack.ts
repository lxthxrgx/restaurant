import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { DiningTables } from "./DiningTables";
import { Orders } from "../Order/Orders";

@Entity()
export class DiningTablesTrack {
    @PrimaryGeneratedColumn()
    DiningTableTrackId: number;

    @ManyToOne(() => DiningTables)
    @JoinColumn({ name: "DiningTableId" })
    diningTable: DiningTables;

    @ManyToOne(() => Orders)
    @JoinColumn({ name: "OrderId" })
    order: Orders;
}
