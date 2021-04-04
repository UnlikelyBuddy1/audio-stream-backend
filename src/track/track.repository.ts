import { InternalServerErrorException } from "@nestjs/common";
import { User } from "src/auth/user.entity";
import { EntityRepository, Repository } from "typeorm";
import { createTrackDto } from "./dto/create-track.dto";
import { GetTracksFilterDto } from "./dto/get-tracks-filter.dto";
import { Track } from "./entities/track.entity";

@EntityRepository(Track)
export class TrackRepository extends Repository<Track> {

    async getTracks(filterDto: GetTracksFilterDto, user: User): Promise<Track[]> {
        const {search} = filterDto;
        const query = this.createQueryBuilder('track');
        try {
            //query.where('track.userId = :userId', { userId: user.id });

            if(search){
                query.where('track.title = :search', {search});
            }
            const tracks = await query.getMany();
            console.log(tracks);
            return tracks;
        } catch(err){
            throw new InternalServerErrorException(err);
        }


    }

    async createTrack(createTrackDto: createTrackDto, user: User): Promise<Track> {
        const { title, path } = createTrackDto;
        const track = new Track();
        track.title = title;
        track.path = path;
        //track.user = user;
        await track.save();
        //delete track.user;
        return track;
    }
}