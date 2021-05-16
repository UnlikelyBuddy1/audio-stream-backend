import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Track } from 'src/entities/track.entity';
import { User } from 'src/entities/user.entity';
import { createTrackDto } from './dto/create-track.dto';
import { GetTracksFilterDto } from './dto/get-tracks-filter.dto'
import { modifyTrackDto } from './dto/modify-track-dto';
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

    async createTrack(createTrackDto: createTrackDto, user: User, filename: string): Promise<Track> {
        return this.trackRepository.createTrack(createTrackDto, user, filename);
    }

    async deleteTrack(id: number, user: User): Promise<void> {
        const result = await this.trackRepository.delete(id);
        if(result.affected===0) {
            throw new NotFoundException(`Track with ID "${id}" not found`);
        }
    }

    async getTracks(filterDto: GetTracksFilterDto, user: User): Promise<Track[]> {
        return this.trackRepository.getTracks(filterDto, user);
    }

    async modifyTrack(id: number, user: User, modifyTrackDto: modifyTrackDto, filename: string): Promise<Track>{
        let track=await this.getTrackById(id, user);
        return this.trackRepository.modifyTrack(track, modifyTrackDto, user, filename);
    }
}

