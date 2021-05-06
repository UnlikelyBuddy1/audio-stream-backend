import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Track } from 'src/entities/track.entity';
import { User } from 'src/entities/user.entity';
import { createTrackDto } from './dto/create-track.dto';
import { GetTracksFilterDto } from './dto/get-tracks-filter.dto'
import { likeTrackDto } from './dto/like-track.dto';
import { TrackRepository } from './track.repository';

@Injectable()
export class TrackService {
    constructor(
        @InjectRepository(TrackRepository)
        private trackRepository : TrackRepository,
    ) { }

    async getTrackById(id: number, user : User): Promise<Track>{
        const found = await this.trackRepository.findOne({relations: ["playlists", "artists", "albums"], where : {id}});
        if(!found) {
            throw new NotFoundException(`Track with ID "${id}" not found`);
        }
        return found;
    }

    async createTrack(createTrackDto: createTrackDto, user: User): Promise<Track> {
        return this.trackRepository.createTrack(createTrackDto, user);
    }

    async deleteTrack(id: number, user: User): Promise<void> {
        const result = await this.trackRepository.delete(id);
        if(result.affected===0) {
            throw new NotFoundException(`Track with ID "${id}" not found`);
        }
    }

    async likeTrack(likeTrackDto: likeTrackDto, user: User) {
        return this.trackRepository.likeTrack(likeTrackDto, user);
    }

    async getTracks(filterDto: GetTracksFilterDto, user: User): Promise<Track[]> {
        return this.trackRepository.getTracks(filterDto, user);
    }
}

