import { Controller, Get, Param, ParseIntPipe, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/get-user.decorator';
import { Album } from 'src/entities/album.entity';
import { User } from 'src/entities/user.entity';
import { AlbumService } from './album.service';

@Controller('album')
@UseGuards(AuthGuard())
export class AlbumController {
    constructor(private albumService: AlbumService){}

    @Get('/:id')
    getalbumById(@Param('id', ParseIntPipe) id : number, @GetUser() user: User): Promise<Album>{
        return this.albumService.getAlbumById(id, user);
    }
}


