import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { GetUser } from 'src/auth/get-user.decorator';
import { Artist } from 'src/entities/artist.entity';
import { User } from 'src/entities/user.entity';
import { ArtistService } from './artist.service';
import { createArtistDto } from './dto/create-artist-dto';
import { GetArtistsFilterDto } from './dto/get-artists-filter.dto';

@Controller('artist')
export class ArtistController {
    constructor(private artistService: ArtistService){}

    @Post()
    @UsePipes(ValidationPipe)
    createArtist(@Body() createArtistDto: createArtistDto, @GetUser() user: User): Promise<Artist>{
        return this.artistService.createArtist(createArtistDto, user);

    }

    @Get('/:id')
    getArtistById(@Param('id', ParseIntPipe) id : number, @GetUser() user: User): Promise<Artist>{
        return this.artistService.getArtistById(id, user);
    }

    @Get()
    getArtists(@Query(ValidationPipe) filterDto: GetArtistsFilterDto, @GetUser() user: User): Promise<Artist[]>  {
        return this.artistService.getArtists(filterDto, user);
    }

    @Delete('/:id')
    deleteArtist(@Param('id', ParseIntPipe) id: number, @GetUser() user: User): Promise<void> {
        return this.artistService.deleteArtist(id, user);
    }
}
