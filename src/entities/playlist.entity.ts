
import { BaseEntity, Column, Entity, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Track } from "./track.entity";
import { User } from "./user.entity";

@Entity()
export class Playlist extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: string;

    @Column()
    name: string;

    @ManyToOne(type => User, user => user.playlists)
    user : User; 

    @ManyToMany( () => Track)
    @JoinTable()
    tracks : Track[];
}