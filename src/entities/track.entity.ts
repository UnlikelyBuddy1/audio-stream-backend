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

    @ManyToMany( () => Artist)
    @JoinTable()
    artists : Artist[];

    @ManyToMany( () => Album)
    @JoinTable()
    albums : Album[];

    @ManyToMany( () => Genre)
    @JoinTable()
    genres : Genre[];
}