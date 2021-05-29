import { Body, Controller, Delete, Get, Header, Param, ParseIntPipe, Patch, Post, Query, Res, UploadedFile, UseGuards, UseInterceptors, UsePipes, ValidationPipe } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { GetUser } from 'src/auth/get-user.decorator';
import { Album } from 'src/entities/album.entity';
import { User } from 'src/entities/user.entity';
import { editFileName, imageFileFilter } from 'src/utils/file-upload.utils';
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

    @Get('/cover/:coverpath')
    @Header('Cache-Control', 'max-age=31536000')
    giveFile(@Param('coverpath') track, @Res() res) { 
        return res.sendFile(track, { root: './files/image'});
    }

    @Post()
    @UsePipes(ValidationPipe)
    @UseInterceptors(
      FileInterceptor('cover', {
        storage: diskStorage({
          destination: './files/image',
          filename: editFileName,
        }),
        fileFilter: imageFileFilter,
      }),
    )
    createTrack(@Body() createAlbumDto: createAlbumDto, @GetUser() user: User, @UploadedFile() file: Express.Multer.File,): Promise<Album>{
        if(!file){
            return this.albumService.createAlbum(createAlbumDto, user, null);
        } else {
            return this.albumService.createAlbum(createAlbumDto, user, file.filename);
        }
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
    @UseInterceptors(
      FileInterceptor('cover', {
        storage: diskStorage({
          destination: './files/image',
          filename: editFileName,
        }),
        fileFilter: imageFileFilter,
      }),
    )
    modifyAlbum(@Param('id', ParseIntPipe) id: number, @GetUser() user: User, @Body() modifyAlbumDto: modifyAlbumDto, file: Express.Multer.File): Promise<Album>{
        if(file){
            return this.albumService.modifyAlbum(id, user, modifyAlbumDto, file.filename);
        } else {
            return this.albumService.modifyAlbum(id, user, modifyAlbumDto, null);
        }
    }
}
