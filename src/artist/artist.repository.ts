import { InternalServerErrorException } from "@nestjs/common";
import { Artist } from "src/entities/artist.entity";
import { User } from "src/entities/user.entity";
import { EntityRepository, Repository } from "typeorm";
import { createArtistDto } from "./dto/create-artist-dto";
import { GetArtistsFilterDto } from "./dto/get-artists-filter.dto";


@EntityRepository(Artist)
export class ArtistRepository extends Repository<Artist> {

    async getArtists(filterDto: GetArtistsFilterDto, user: User): Promise<Artist[]> {
        const {search} = filterDto;
        const query = this.createQueryBuilder('artist');
        try {
            //query.where('artist.userId = :userId', { userId: user.id });

            if(search){
                query.where('artist.name = :search', {search});
            }
            const artists = await query.getMany();
            console.log(artists);
            return artists;
        } catch(err){
            throw new InternalServerErrorException(err);
        }
    }

    async createArtist(createArtistDto: createArtistDto, user: User): Promise<Artist> {
        const { name, trackIds } = createArtistDto;
        const artist = new Artist();
        artist.name = name;

        if(trackIds){
            console.log(trackIds.map(trackIds => ({id: trackIds} as any)));
            artist.tracks = trackIds.map(trackIds => ({id: trackIds} as any));
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