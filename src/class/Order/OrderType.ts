import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class OrderType {
    @PrimaryGeneratedColumn()
    OrderTypeId: number;
    
    @Column()
    OrderTypeName: string;
}
