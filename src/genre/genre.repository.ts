import { InternalServerErrorException } from "@nestjs/common";
import { Genre } from "src/entities/genre.entity";
import { User } from "src/entities/user.entity";
import { EntityRepository, Repository } from "typeorm";
import { createGenreDto } from "./dto/create-genre-dto"
import { GetGenresFilterDto } from "./dto/get-genre-filter.dto";

@EntityRepository(Genre)
export class GenreRepository extends Repository<Genre> {

    async getGenres(filterDto: GetGenresFilterDto, user: User): Promise<Genre> {
        const {search} = filterDto;
        const query = this.createQueryBuilder('genre');
        try {
            //query.where('genre.userId = :userId', { userId: user.id });

            if(search){
                query.where('genre.name = :search', {search});
            }
            const genres = await query.getOne();
            console.log(genres);
            return genres;
        } catch(err){
            throw new InternalServerErrorException(err);
        }


    }

    async createGenre(createGenreDto: createGenreDto, user: User): Promise<Genre> {
        const { name } = createGenreDto;
        const genre = new Genre();
        genre.name = name;
        try {
            await genre.save();
        } catch (error) {
            throw new InternalServerErrorException(error);
        }
        //delete genre.user;
        return genre;
    }
}