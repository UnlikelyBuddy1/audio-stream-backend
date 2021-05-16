import { InternalServerErrorException } from "@nestjs/common";
import { getArrayIfNeeded } from "src/create-entities.utils";
import { Playlist } from "src/entities/playlist.entity";
import { User } from "src/entities/user.entity";
import { EntityRepository, Repository } from "typeorm";
import { createPlaylistDto } from "./dto/create-playlist-dto";
import { GetPlaylistsFilterDto } from "./dto/get-playlist-filter.dto";
import { modifyPlaylistDto } from "./dto/modify-playlist-dto";

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
        let { name, trackIds } = createPlaylistDto;
        const playlist = new Playlist();
        playlist.name = name;
        playlist.userId = user.id;
        if(trackIds){
            trackIds=getArrayIfNeeded(trackIds);
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

    async modifyPlaylist(playlist: Playlist, modifyPlaylistDto: modifyPlaylistDto, user: User): Promise<Playlist> {
        let { name, trackIds } = modifyPlaylistDto;
        playlist.userId = user.id;
        if(name){
            playlist.name = name;
        }
        if(trackIds){
            trackIds=getArrayIfNeeded(trackIds);
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
}
