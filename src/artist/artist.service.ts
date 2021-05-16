import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Artist } from 'src/entities/artist.entity';
import { User } from 'src/entities/user.entity';
import { ArtistRepository } from './artist.repository';
import { createArtistDto } from './dto/create-artist-dto';
import { GetArtistsFilterDto } from './dto/get-artists-filter.dto';
import { modifyArtistDto } from './dto/modify-artist-dto';

@Injectable()
export class ArtistService {
    constructor(
        @InjectRepository(ArtistRepository)
        private artistRepository : ArtistRepository
        ,
    ) { }

    async createArtist(createArtistDto: createArtistDto, user: User): Promise<Artist> {
        return this.artistRepository.createArtist(createArtistDto, user);
    }

    async getArtistById(id: number, user : User): Promise<Artist>{
        const found = await this.artistRepository.findOne({where : {id}});
        if(!found) {
            throw new NotFoundException(`Artist with ID "${id}" not found`);
        }
        return found;
    }

    async getArtists(filterDto: GetArtistsFilterDto, user: User): Promise<Artist[]> {
        return this.artistRepository.getArtists(filterDto, user);
    }

    async deleteArtist(id: number, user: User): Promise<void> {
        const result = await this.artistRepository.delete(id);
        if(result.affected===0) {
            throw new NotFoundException(`Track with ID "${id}" not found`);
        }
    }

    async modifyArtist(id: number, user: User, modifyArtistDto: modifyArtistDto): Promise<Artist>{
        let artist=await this.getArtistById(id, user);
        return this.artistRepository.modifyArtist(artist, modifyArtistDto, user);
    }
}
