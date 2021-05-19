import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/get-user.decorator';
import { Album } from 'src/entities/album.entity';
import { User } from 'src/entities/user.entity';
import { AlbumService } from './album.service';
import { createAlbumDto } from './dto/create-album-dto';
import { GetAlbumsFilterDto } from './dto/get-albums-filter.dto';
import { modifyAlbumDto } from './dto/modify-album-dto';

@Controller('album')
@UseGuards(AuthGuard())
export class AlbumController {
    constructor(private albumService: AlbumService){}

    @Get('/:id')
    getAlbumById(@Param('id', ParseIntPipe) id : number, @GetUser() user: User): Promise<Album>{
        return this.albumService.getAlbumById(id, user);
    }

    @Post()
    @UsePipes(ValidationPipe)
    createAlbum(@Body() createAlbumDto: createAlbumDto, @GetUser() user: User): Promise<Album>{
        return this.albumService.createAlbum(createAlbumDto, user);

    }

    @Get()
    getAlbums(@Query(ValidationPipe) filterDto: GetAlbumsFilterDto, @GetUser() user: User): Promise<Album[]>  {
        return this.albumService.getAlbums(filterDto, user);
    }

    @Delete('/:id')
    deleteAlbum(@Param('id', ParseIntPipe) id: number, @GetUser() user: User): Promise<void> {
        return this.albumService.deleteAlbum(id, user);
    }

    @Patch('/:id')
    @UsePipes(ValidationPipe)
    modifyAlbum(@Param('id', ParseIntPipe) id: number, @GetUser() user: User, @Body() modifyAlbumDto: modifyAlbumDto): Promise<Album>{
        return this.albumService.modifyAlbum(id, user, modifyAlbumDto);
    }
}
