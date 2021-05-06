import { BaseEntity, Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { Album } from "./album.entity";
import { Artist } from "./artist.entity";
import { Playlist } from "./playlist.entity";

@Entity()
export class Track extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: string;

    @Column()
    title: string;

    @Column()
    path: string;

    @ManyToMany( () => Playlist)
    @JoinTable()
    playlists : Playlist[];

    @ManyToMany( () => Artist)
    @JoinTable()
    artists : Artist[];

    @ManyToMany( () => Album)
    @JoinTable()
    albums : Album[];
}