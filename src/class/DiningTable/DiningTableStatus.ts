import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { DiningTables } from "./DiningTables";

@Entity()
export class DiningTablesStatus {
    @PrimaryGeneratedColumn()
    StatusId: number;

    @Column()
    Status: string;

    @OneToMany(() => DiningTables, diningTable => diningTable.diningTablesStatus)
    diningTables: DiningTables[];
}
