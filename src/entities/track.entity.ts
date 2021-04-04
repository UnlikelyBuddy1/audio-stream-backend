import { BaseEntity, Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn, Unique } from "typeorm";
import { Album } from "./album.entity";
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

}