import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/auth/user.entity';
import { Album } from 'src/track/entities/album.entity';
import { AlbumRepository } from './album.repository';

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
}