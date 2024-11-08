import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Customers {
    @PrimaryGeneratedColumn()
    CustomerId: number;

    @Column()
    CustomerName: string;

    @Column()
    Address: string;

    @Column()
    Phone: string;
}
