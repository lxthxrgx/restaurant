import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from "typeorm";

@Entity()
export class DiningTablesTrack {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    ChairsCount: number;

    @Column()
    lastName: string;

    @Column()
    age: number;
}
