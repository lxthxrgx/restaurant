import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from "typeorm";


@Entity()
export class DiningTables {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    ChairsCount: number;

    
}
