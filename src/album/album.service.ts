import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Album } from 'src/entities/album.entity';
import { User } from 'src/entities/user.entity';
import { AlbumRepository } from './album.repository';
import { createAlbumDto } from './dto/create-album-dto';
import { GetAlbumsFilterDto } from './dto/get-albums-filter.dto';

@Injectable()
export class AlbumService {
    constructor(
        @InjectRepository(AlbumRepository)
        private albumRepository : AlbumRepository,
    ) { }

    async getAlbumById(id: number, user : User): Promise<Album>{
        const found = await this.albumRepository.findOne({where : {id}});
        if(!found) {
            throw new NotFoundException(`Album with ID "${id}" not found`);
        }
        return found;
    }

    async createAlbum(createAlbumDto: createAlbumDto, user: User): Promise<Album> {
        return this.albumRepository.createAlbum(createAlbumDto, user);
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
}