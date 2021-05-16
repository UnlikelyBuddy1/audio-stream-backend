import { InternalServerErrorException } from "@nestjs/common";
import { getArrayIfNeeded } from "src/create-entities.utils";
import { Track } from "src/entities/track.entity";
import { User } from "src/entities/user.entity";
import { EntityRepository, Repository } from "typeorm";
import { createTrackDto } from "./dto/create-track.dto";
import { GetTracksFilterDto } from "./dto/get-tracks-filter.dto";

@EntityRepository(Track)
export class TrackRepository extends Repository<Track> {

    async getTracks(filterDto: GetTracksFilterDto, user: User): Promise<Track[]> {
        let {search, index, size} = filterDto;
        index=parseInt(index.toString());
        if(size){size=parseInt(size.toString())}else{size=10;}
        const toSkip = index*size;
        const toTake = (index+1)*(size);
        const query = this.createQueryBuilder('track');
        try {
            //query.where('track.userId = :userId', { userId: user.id });
            if(search){
                //search.replace(/\s/g, "").toLowerCase;
                query.where('track.title like :search', {search: `%${search}%`});
            }
            console.log(toSkip, toTake);
            const tracks = await query.skip(toSkip).take(toTake).getMany();
            return tracks;
        } catch(err){
            throw new InternalServerErrorException(err);
        }
    }

    async createTrack(createTrackDto: createTrackDto, user: User, filename: string): Promise<Track> {
        let { title, path, genreIds, albumIds, artistIds} = createTrackDto;
        const track = new Track();
        track.title = title;
        track.path = path ? path: filename;
        if(genreIds){
            genreIds=getArrayIfNeeded(genreIds);
            track.genres = genreIds.map(genreIds => ({ id: genreIds } as any));
        }
        if(artistIds){
            artistIds=getArrayIfNeeded(artistIds);
            track.artists = artistIds.map(artistIds => ({ id: artistIds } as any));
        }
        if(albumIds){
            albumIds=getArrayIfNeeded(albumIds);
            track.albums = albumIds.map(albumIds => ({ id: albumIds } as any));
        }
        //track.user = user;
        await track.save();
        //delete track.user;
        return track;
    }

    async modifyTrack(track: Track, createTrackDto: createTrackDto, user: User, filename: string): Promise<Track> {
        let { title, path, genreIds, albumIds, artistIds} = createTrackDto;
        if(title){
            track.title = title;
        }
        if(path || filename){
            track.path = path ? path: filename;
        }
        if(genreIds){
            genreIds=getArrayIfNeeded(genreIds);
            track.genres = genreIds.map(genreIds => ({ id: genreIds } as any));
        }
        if(artistIds){
            artistIds=getArrayIfNeeded(artistIds);
            track.artists = artistIds.map(artistIds => ({ id: artistIds } as any));
        }
        if(albumIds){
            albumIds=getArrayIfNeeded(albumIds);
            track.albums = albumIds.map(albumIds => ({ id: albumIds } as any));
        }
        //track.user = user;
        await track.save();
        //delete track.user;
        return track;
    }
}