import { InjectRepository } from '@nestjs/typeorm';
import { Playlist } from 'src/entities/playlist.entity';
import { User } from 'src/entities/user.entity';
import { PlaylistRepository } from './playlist.repository';
import { createPlaylistDto } from './dto/create-playlist-dto';
import { Injectable, NotFoundException } from '@nestjs/common';
import { GetPlaylistsFilterDto } from './dto/get-playlist-filter.dto';
import { modifyPlaylistDto } from './dto/modify-playlist-dto';

@Injectable()
export class PlaylistService {
    constructor(
        @InjectRepository(PlaylistRepository)
        private playlistRepository : PlaylistRepository,
    ) { }

    async getPlaylistById(id: number, user : User): Promise<Playlist>{
        const found = await this.playlistRepository.findOne({where : {id, userId: user.id}});        
        if(!found) {
            throw new NotFoundException(`Playlist with ID "${id}" not found`);
        }
        return found;
    }

    async createPlaylist(createPlaylistDto: createPlaylistDto, user: User): Promise<Playlist> {
        return this.playlistRepository.createPlaylist(createPlaylistDto, user);
    }

    async getPlaylists(filterDto: GetPlaylistsFilterDto, user: User): Promise<Playlist[]> {
        return this.playlistRepository.getPlaylists(filterDto, user);
    }

    async deletePlaylist(id: number, user: User): Promise<void> {
        const result = await this.playlistRepository.delete(id);
        if(result.affected===0) {
            throw new NotFoundException(`Playlist with ID "${id}" not found`);
        }
    }
       
    async modifyPlaylist(id: number, user: User, modifyPlaylistDto: modifyPlaylistDto): Promise<Playlist>{
        let playlist=await this.getPlaylistById(id, user);
        return this.playlistRepository.modifyPlaylist(playlist, modifyPlaylistDto, user);
    }
}