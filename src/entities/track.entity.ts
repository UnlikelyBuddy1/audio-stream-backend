import { BaseEntity, Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { Album } from "./album.entity";
import { Artist } from "./artist.entity";
import { Genre } from "./genre.entity";

@Entity()
export class Track extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: string;

    @Column()
    title: string;

    @Column()
    path: string;

    @ManyToMany( () => Artist, artist => artist.tracks, {eager: true})
    artists : Artist[];

    @ManyToMany( () => Album, album => album.tracks, {eager: true})
    albums : Album[];

    @ManyToMany( () => Genre, genre => genre.tracks, {eager: true})
    genres : Genre[];
}