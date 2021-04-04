import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/auth/user.entity';
import { createTrackDto } from './dto/create-track.dto';
import { GetTracksFilterDto } from './dto/get-tracks-filter.dto';
import { Track } from './entities/track.entity';
import { TrackRepository } from './track.repository';

@Injectable()
export class TrackService {
    constructor(
        @InjectRepository(TrackRepository)
        private trackRepository : TrackRepository,
    ) { }

    async getTrackById(id: number, user : User): Promise<Track>{
        const found = await this.trackRepository.findOne({where : {id}});
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

    async updateTrack(id: number, title : string, path: string, user: User): Promise<Track> {
        const track = await this.getTrackById(id, user);
        track.title = title;
        track.path = path;
        await track.save();
        return track;
    }

    async getTracks(filterDto: GetTracksFilterDto, user: User): Promise<Track[]> {
        return this.trackRepository.getTracks(filterDto, user);
    }
}

