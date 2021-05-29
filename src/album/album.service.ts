import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Album } from 'src/entities/album.entity';
import { User } from 'src/entities/user.entity';
import { AlbumRepository } from './album.repository';
import { createAlbumDto } from './dto/create-album-dto';
import { GetAlbumsFilterDto } from './dto/get-albums-filter.dto';
import { modifyAlbumDto } from './dto/modify-album-dto';

@Injectable()
export class AlbumService {
    constructor(
        @InjectRepository(AlbumRepository)
        private albumRepository : AlbumRepository,
    ) { }

    async getAlbumById(id: number, user : User): Promise<Album>{
        const found = await this.albumRepository.findOne({relations: ["tracks"],where : {id}});
        if(!found) {
            throw new NotFoundException(`Album with ID "${id}" not found`);
        }
        return found;
    }

    async createAlbum(createAlbumDto: createAlbumDto, user: User, filename: string): Promise<Album> {
        return this.albumRepository.createAlbum(createAlbumDto, user, filename);
    }
    async getAlbums(filterDto: GetAlbumsFilterDto, user: User): Promise<Album[]> {
        return this.albumRepository.getAlbums(filterDto, user);
    }

    async deleteAlbum(id: number, user: User): Promise<void> {
        const result = await this.albumRepository.delete(id);
        if(result.affected===0) {
            throw new NotFoundException(`Album with ID "${id}" not found`);
        }
    }

    async modifyAlbum(id: number, user: User, modifyAlbumDto: modifyAlbumDto, filename: string): Promise<Album>{
        let album=await this.getAlbumById(id, user);
        return this.albumRepository.modifyAlbum(album, modifyAlbumDto, user, filename);
    }
}