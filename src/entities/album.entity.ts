
import { BaseEntity, Column, Entity, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Artist } from "./artist.entity";
import { Track } from "./track.entity";

@Entity()
export class Album extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: string;

    @Column()
    name: string;

    @ManyToMany( () => Track)
    @JoinTable()
    tracks : Track[];

    @ManyToMany( () => Artist)
    @JoinTable()
    artists : Artist[];
}