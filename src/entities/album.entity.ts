import { BaseEntity, Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { Artist } from "./artist.entity";
import { Genre } from "./genre.entity";
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

    @ManyToMany( () => Genre)
    @JoinTable()
    genres : Genre[];
}