import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Album } from 'src/entities/album.entity';
import { User } from 'src/entities/user.entity';
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