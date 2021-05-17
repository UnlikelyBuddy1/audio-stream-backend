import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/get-user.decorator';
import { Genre } from 'src/entities/genre.entity';
import { User } from 'src/entities/user.entity';
import { GenreService } from './genre.service';
import { createGenreDto } from './dto/create-genre-dto';
import { GetGenresFilterDto } from './dto/get-genre-filter.dto';
import { modifyGenreDto } from './dto/modify-genre-dto';

@Controller('genre')
//@UseGuards(AuthGuard())
export class GenreController {
    constructor(private genreService: GenreService){}

    @Get('/:id')
    getGenreById(@Param('id', ParseIntPipe) id : number, @GetUser() user: User): Promise<Genre>{
        return this.genreService.getGenreById(id, user);
    }

    @Post()
    @UsePipes(ValidationPipe)
    createGenre(@Body() createGenreDto: createGenreDto, @GetUser() user: User): Promise<Genre>{
        return this.genreService.createGenre(createGenreDto, user);

    }

    @Get()
    getGenres(@Query(ValidationPipe) filterDto: GetGenresFilterDto, @GetUser() user: User): Promise<Genre[]>  {
        return this.genreService.getGenres(filterDto, user);
    }

    @Delete('/:id')
    deleteGenre(@Param('id', ParseIntPipe) id: number, @GetUser() user: User): Promise<void> {
        return this.genreService.deleteGenre(id, user);
    }

    @Patch('/:id')
    @UsePipes(ValidationPipe)
    modifyGenre(@Param('id', ParseIntPipe) id: number, @GetUser() user: User, @Body() modifyGenreDto: modifyGenreDto): Promise<Genre>{
        return this.genreService.modifyGenre(id, user, modifyGenreDto);
    }
}


