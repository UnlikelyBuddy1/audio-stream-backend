import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn, Unique } from "typeorm";
import * as bcrypt from 'bcrypt';
import { Playlist } from "./playlist.entity";
import { Track } from "./track.entity";

@Entity()
@Unique(['username'])
export class User extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    username: string;

    @Column()
    password: string;

    @Column()
    salt: string;

    /*@Column()
    likedTracks: string[]; // containes list of liked TrackIds
    */
    @OneToMany(type => Playlist, playlist => playlist.user)
    playlists: Playlist[];

    async validateUserPassword(password: string): Promise<boolean> {
        const hash = await bcrypt.hash(password, this.salt);
        return hash === this.password;
    }
}