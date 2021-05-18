import { BaseEntity, Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { Album } from "./album.entity";
import { Track } from "./track.entity";

@Entity()
export class Artist extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: string;

    @Column()
    name: string;

    @ManyToMany( () => Track, track => track.artists)
    @JoinTable()
    tracks : Track[];

    @ManyToMany( () => Album, album => album.artists)
    @JoinTable()
    albums : Album[];
}