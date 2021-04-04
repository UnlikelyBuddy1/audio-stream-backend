import { BaseEntity, Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn, Unique } from "typeorm";
import { Track } from "./track.entity";

@Entity()
@Unique(['name'])
export class Genre extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: string;

    @Column()
    name: string;
    
    @ManyToMany( () => Track)
    @JoinTable()
    tracks : Track[];
}