import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany } from "typeorm";
import { DiningTablesStatus } from "./DiningTableStatus";
import { DiningTablesTrack } from "./DiningTableTrack";

@Entity()
export class DiningTables {
    @PrimaryGeneratedColumn()
    DiningTableId: number;

    @Column()
    ChairsCount: number;

    @ManyToOne(() => DiningTablesStatus)
    @JoinColumn({ name: "StatusId" })
    diningTablesStatus: DiningTablesStatus;

    @OneToMany(() => DiningTablesTrack, diningTablesTrack => diningTablesTrack.diningTable)
    diningTableTracks: DiningTablesTrack[];

    @Column()
    SectionId: number;
}
