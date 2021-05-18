import { InternalServerErrorException } from "@nestjs/common";
import { getArrayIfNeeded } from "src/utils/create-entities.utils";
import { Playlist } from "src/entities/playlist.entity";
import { User } from "src/entities/user.entity";
import { EntityRepository, Repository } from "typeorm";
import { createPlaylistDto } from "./dto/create-playlist-dto";
import { GetPlaylistsFilterDto } from "./dto/get-playlist-filter.dto";
import { modifyPlaylistDto } from "./dto/modify-playlist-dto";

@EntityRepository(Playlist)
export class PlaylistRepository extends Repository<Playlist> {

    async getPlaylists(filterDto: GetPlaylistsFilterDto, user: User): Promise<Playlist[]> {
        let {search, index, size} = filterDto;
        index=parseInt(index.toString());
        if(size){size=parseInt(size.toString())}else{size=10;}
        const toSkip = index*size;
        const toTake = size;
        const query = this.createQueryBuilder('playlist');
        try {
            query.where('playlist.userId = :userId', { userId: user.id });
            if(search){
                //search.replace(/\s/g, "").toLowerCase;
                query.where('playlist.name like :search', {search: `%${search}%`});
            }
            const playlists = await query.skip(toSkip).take(toTake).getMany();
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
