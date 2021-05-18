import { BaseEntity, Column, Entity, JoinColumn, JoinTable, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { Artist } from "./artist.entity";
import { Genre } from "./genre.entity";
import { Track } from "./track.entity";

@Entity()
export class Album extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: string;

    @Column()
    name: string;

    @ManyToMany( () => Track, track => track.albums)
    @JoinTable()
    tracks : Track[];

    @ManyToMany( () => Artist, artist => artist.albums, {eager: true})
    artists : Artist[];

    @ManyToMany( () => Genre, genre => genre.albums, {eager: true})
    genres : Genre[];
}