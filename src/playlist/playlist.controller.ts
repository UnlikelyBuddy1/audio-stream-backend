import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/get-user.decorator';
import { Playlist } from 'src/entities/playlist.entity';
import { User } from 'src/entities/user.entity';
import { PlaylistService } from './playlist.service';
import { createPlaylistDto } from './dto/create-playlist-dto';
import { GetPlaylistsFilterDto } from './dto/get-playlist-filter.dto';
import { modifyPlaylistDto } from './dto/modify-playlist-dto';

@Controller('playlist')

export class PlaylistController {
    constructor(private playlistService: PlaylistService){}

    @Get('/:id')
    getPlaylistById(@Param('id', ParseIntPipe) id : number, @GetUser() user: User): Promise<Playlist>{
        return this.playlistService.getPlaylistById(id, user);
    }

    @Post()
    @UsePipes(ValidationPipe)
    createPlaylist(@Body() createPlaylistDto: createPlaylistDto, @GetUser() user: User): Promise<Playlist>{
        return this.playlistService.createPlaylist(createPlaylistDto, user);

    }

    @Get()
    getPlaylists(@Query(ValidationPipe) filterDto: GetPlaylistsFilterDto, @GetUser() user: User): Promise<Playlist[]>  {
        return this.playlistService.getPlaylists(filterDto, user);
    }

    @Delete('/:id')
    deletePlaylists(@Param('id', ParseIntPipe) id: number, @GetUser() user: User): Promise<void> {
        return this.playlistService.deletePlaylist(id, user);
    }

    @Patch('/:id')
    @UsePipes(ValidationPipe)
    modifyPlaylist(@Param('id', ParseIntPipe) id: number, @GetUser() user: User, @Body() modifyPlaylistDto: modifyPlaylistDto): Promise<Playlist>{
        return this.playlistService.modifyPlaylist(id, user, modifyPlaylistDto);
    }
}


