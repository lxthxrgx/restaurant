import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from "typeorm";
import { DiningTablesTrack } from "./DiningTableTrack";

@Entity()
export class DiningTablesStatus {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    ChairsCount: number;

    
}
