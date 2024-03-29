import { InternalServerErrorException } from "@nestjs/common";
import { getArrayIfNeeded } from "src/utils/create-entities.utils";
import { Artist } from "src/entities/artist.entity";
import { User } from "src/entities/user.entity";
import { EntityRepository, Repository } from "typeorm";
import { createArtistDto } from "./dto/create-artist-dto";
import { GetArtistsFilterDto } from "./dto/get-artists-filter.dto";
import { modifyArtistDto } from "./dto/modify-artist-dto";


@EntityRepository(Artist)
export class ArtistRepository extends Repository<Artist> {

    async getArtists(filterDto: GetArtistsFilterDto, user: User): Promise<Artist[]> {
        let {search, index, size} = filterDto;
        index=parseInt(index.toString());
        if(size){size=parseInt(size.toString())}else{size=10;}
        const toSkip = index*size;
        const toTake = size;
        const query = this.createQueryBuilder('artist');
        query.loadAllRelationIds();
        try {
            //query.where('artist.userId = :userId', { userId: user.id });

            if(search){
                
                query.where('artist.name like :search', {search: `%${search}%`});
            }
            const artists = await query.skip(toSkip).take(toTake).getMany();
            return artists;
        } catch(err){
            throw new InternalServerErrorException(err);
        }
    }

    async createArtist(createArtistDto: createArtistDto, user: User): Promise<Artist> {
        let {name, albumIds, trackIds}= createArtistDto;
        const artist = new Artist();
        artist.name = name;

        if(albumIds){
            albumIds=getArrayIfNeeded(albumIds);
            artist.albums = albumIds.map(albumIds => ({ id: albumIds } as any));
        }
        if(trackIds){
            trackIds=getArrayIfNeeded(trackIds);
            artist.tracks = trackIds.map(trackIds => ({ id: trackIds } as any));
        } 
        try {
            await artist.save();
        } catch (error) {
            throw new InternalServerErrorException(error);
        }
        //delete artist.user;
        return artist;
    }

    async modifyArtist(artist: Artist, modifyArtistDto: modifyArtistDto, user: User): Promise<Artist>{
        let {name, albumIds, trackIds}= modifyArtistDto;
        if(name){
            artist.name = name;
        } 
        if(albumIds){
            albumIds=getArrayIfNeeded(albumIds);
            artist.albums = albumIds.map(albumIds => ({ id: albumIds } as any));
        }
        if(trackIds){
            trackIds=getArrayIfNeeded(trackIds);
            artist.tracks = trackIds.map(trackIds => ({ id: trackIds } as any));
        } 
        try {
            await artist.save();
        } catch (error) {
            throw new InternalServerErrorException(error);
        }
        //delete artist.user;
        return artist;
    }
}