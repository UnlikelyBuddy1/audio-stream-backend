import { BaseEntity, Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn, Unique } from "typeorm";
import { Album } from "./album.entity";
import { Track } from "./track.entity";

@Entity()
@Unique(['name'])
export class Genre extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: string;

    @Column()
    name: string;
    
    @ManyToMany( () => Track, track => track.genres)
    @JoinTable()
    tracks : Track[];

    @ManyToMany( () => Album, album => album.genres)
    @JoinTable()
    albums : Album[];

}