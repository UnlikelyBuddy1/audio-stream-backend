import { InternalServerErrorException } from "@nestjs/common";
import { getArrayIfNeeded } from "src/utils/create-entities.utils";
import { Genre } from "src/entities/genre.entity";
import { User } from "src/entities/user.entity";
import { EntityRepository, Repository } from "typeorm";
import { createGenreDto } from "./dto/create-genre-dto"
import { GetGenresFilterDto } from "./dto/get-genre-filter.dto";
import { modifyGenreDto } from "./dto/modify-genre-dto";

@EntityRepository(Genre)
export class GenreRepository extends Repository<Genre> {
    async getGenres(filterDto: GetGenresFilterDto, user: User): Promise<Genre[]> {
        let {search, index, size} = filterDto;
        index=parseInt(index.toString());
        if(size){size=parseInt(size.toString())}else{size=10;}
        const toSkip = index*size;
        const toTake = size;
        const query = this.createQueryBuilder('genre');
        try {
            if(search){ 
                query.where('track.title like :search', {search: `%${search}%`});
            }
            const genres = await query.skip(toSkip).take(toTake).getMany();
            return genres;
        } catch(err){
            throw new InternalServerErrorException(err);
        }
    }

    async createGenre(createGenreDto: createGenreDto, user: User): Promise<Genre> {
        let { name, albumIds, trackIds } = createGenreDto;
        const genre = new Genre();
        genre.name = name;
        if(albumIds){
            albumIds=getArrayIfNeeded(albumIds);
            genre.albums = albumIds.map(albumIds => ({ id: albumIds } as any));
        }
        if(trackIds){
            trackIds=getArrayIfNeeded(trackIds);
            genre.tracks = trackIds.map(trackIds => ({ id: trackIds } as any));
        } 
        try {
            await genre.save();
        } catch (error) {
            throw new InternalServerErrorException(error);
        }
        //delete genre.user;
        return genre;
    }

    async modifyGenre(genre: Genre, modifyGenreDto: modifyGenreDto, user: User): Promise<Genre> {
        let { name, albumIds, trackIds } = modifyGenreDto;
        if(name){
            genre.name = name;
        }
        if(albumIds){
            albumIds=getArrayIfNeeded(albumIds);
            genre.albums = albumIds.map(albumIds => ({ id: albumIds } as any));
        }
        if(trackIds){
            trackIds=getArrayIfNeeded(trackIds);
            genre.tracks = trackIds.map(trackIds => ({ id: trackIds } as any));
        } 
        try {
            await genre.save();
        } catch (error) {
            throw new InternalServerErrorException(error);
        }
        //delete genre.user;
        return genre;
    }
}