import { InternalServerErrorException } from "@nestjs/common";
import { Playlist } from "src/entities/playlist.entity";
import { User } from "src/entities/user.entity";
import { EntityRepository, Repository } from "typeorm";
import { createPlaylistDto } from "./dto/create-playlist-dto";
import { GetPlaylistsFilterDto } from "./dto/get-playlist-filter.dto";

@EntityRepository(Playlist)
export class PlaylistRepository extends Repository<Playlist> {

    async getPlaylists(filterDto: GetPlaylistsFilterDto, user: User): Promise<Playlist[]> {
        const {search} = filterDto;
        const query = this.createQueryBuilder('playlist');
        try {
            query.where('playlist.userId = :userId', { userId: user.id });

            if(search){
                query.andWhere('playlist.name = :search', {search});
            }
            const playlists = await query.getMany();
            console.log(playlists);
            return playlists;
        } catch(err){
            throw new InternalServerErrorException(err);
        }
    }

    async createPlaylist(createPlaylistDto: createPlaylistDto, user: User): Promise<Playlist> {
        const { name, trackIds } = createPlaylistDto;
        const playlist = new Playlist();
        playlist.name = name;
        playlist.userId = user.id;
        if(trackIds){
            console.log(trackIds.map(trackIds => ({id: trackIds} as any)));
            playlist.tracks = trackIds.map(trackIds => ({id: trackIds} as any));
        }
        try {
            await playlist.save();
        } catch (error) {
            throw new InternalServerErrorException(error);
        }
        //delete playlist.user;
        return playlist;
    }

    async getAllPlaylists(user: User): Promise<Playlist[]> {
        const query = this.createQueryBuilder('playlist');
        try {
            query.where('playlist.userId = :userId', { userId: user.id });
            const playlists = await query.getMany();
            console.log(playlists);
            return playlists;
        } catch(err){
            throw new InternalServerErrorException(err);
        }
    }
}