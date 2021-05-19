import { Body, Controller, Get, Post, Param, Delete, Patch, UsePipes, ValidationPipe, ParseIntPipe, Query, UseGuards, UseInterceptors, UploadedFile } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { GetUser } from 'src/auth/get-user.decorator';
import { Track } from 'src/entities/track.entity';
import { User } from 'src/entities/user.entity';
import { createTrackDto } from './dto/create-track.dto';
import { GetTracksFilterDto } from './dto/get-tracks-filter.dto';
import { modifyTrackDto } from './dto/modify-track-dto';
import { editFileName, imageFileFilter } from '../utils/file-upload.utils';
import { TrackService } from './track.service';


@Controller('track')
@UseGuards(AuthGuard())
export class TrackController {
    constructor(private trackService: TrackService){}

    @Get('/:id')
    getTrackById(@Param('id', ParseIntPipe) id : number, @GetUser() user: User): Promise<Track>{
        return this.trackService.getTrackById(id, user);
    }

    @Post()
    @UsePipes(ValidationPipe)
    @UseInterceptors(
      FileInterceptor('track', {
        storage: diskStorage({
          destination: './files',
          filename: editFileName,
        }),
        fileFilter: imageFileFilter,
      }),
    )
    createTrack(@Body() createTrackDto: createTrackDto, @GetUser() user: User, @UploadedFile() file: Express.Multer.File,): Promise<Track>{
        if(!file){
          return this.trackService.createTrack(createTrackDto, user, null);
        } else {
          return this.trackService.createTrack(createTrackDto, user, file.filename);
        }
        
    }


    @Delete('/:id')
    deleteTrack(@Param('id', ParseIntPipe) id: number, @GetUser() user: User): Promise<void> {
        return this.trackService.deleteTrack(id, user);
    }
    
    @Get()
    getTracks(@Query(ValidationPipe) filterDto: GetTracksFilterDto, @GetUser() user: User): Promise<Track[]>  {
        return this.trackService.getTracks(filterDto, user);
    }

    @Patch('/:id')
    @UsePipes(ValidationPipe)
    @UseInterceptors(
      FileInterceptor('track', {
        storage: diskStorage({
          destination: './files',
          filename: editFileName,
        }),
        fileFilter: imageFileFilter,
      }),
    )
    modifyTrack(@Param('id', ParseIntPipe) id: number, @GetUser() user: User, @Body() modifyTrackDto: modifyTrackDto, file: Express.Multer.File): Promise<Track>{
        return this.trackService.modifyTrack(id, user, modifyTrackDto, file.filename);
    }
    
}
