import { BaseEntity, Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { Track } from "./track.entity";

@Entity()
export class Artist extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: string;

    @Column()
    name: string;

    @ManyToMany( () => Track)
    @JoinTable()
    tracks : Track[];    
}