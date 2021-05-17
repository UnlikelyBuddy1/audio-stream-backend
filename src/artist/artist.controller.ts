import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/get-user.decorator';
import { Artist } from 'src/entities/artist.entity';
import { User } from 'src/entities/user.entity';
import { ArtistService } from './artist.service';
import { createArtistDto } from './dto/create-artist-dto';
import { GetArtistsFilterDto } from './dto/get-artists-filter.dto';
import { modifyArtistDto } from './dto/modify-artist-dto';

@Controller('artist')
//@UseGuards(AuthGuard())
export class ArtistController {
    constructor(private artistService: ArtistService){}

    @Post()
    //@UsePipes(ValidationPipe)
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

    @Patch('/:id')
    @UsePipes(ValidationPipe)
    modifyArtist(@Param('id', ParseIntPipe) id: number, @GetUser() user: User, @Body() modifyArtistDto: modifyArtistDto): Promise<Artist>{
        return this.artistService.modifyArtist(id, user, modifyArtistDto);
    }
}