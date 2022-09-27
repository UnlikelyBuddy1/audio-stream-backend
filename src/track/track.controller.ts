import { Body, Controller, Get, Post, Param, Delete, Patch, UsePipes, ValidationPipe, ParseIntPipe, Query, UseGuards, UseInterceptors, UploadedFile, BadRequestException, Inject, forwardRef } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { GetUser } from 'src/auth/get-user.decorator';
import { Track } from 'src/entities/track.entity';
import { User } from 'src/entities/user.entity';
import { createTrackDto } from './dto/create-track.dto';
import { GetTracksFilterDto } from './dto/get-tracks-filter.dto';
import { modifyTrackDto } from './dto/modify-track-dto';
import { editFileName, audioFileFilter } from '../utils/file-upload.utils';
import { TrackService } from './track.service';
import { UtilitiesService} from 'src/utilities/utilities.service';


@Controller('track')

export class TrackController {
    constructor(private trackService: TrackService, 
    private utilitiesService: UtilitiesService){}

    @Get('/:id')
    getTrackById(@Param('id', ParseIntPipe) id : number, @GetUser() user: User): Promise<Track>{
        return this.trackService.getTrackById(id, user);
    }

    @Post()
    @UsePipes(ValidationPipe)
    @UseInterceptors(
      FileInterceptor('track', {
        storage: diskStorage({
          destination: './files/audio',
          filename: editFileName,
        }),
        fileFilter: audioFileFilter,
      }),
    )
    createTrack(@Body() createTrackDto: createTrackDto, @GetUser() user: User, @UploadedFile() file: Express.Multer.File,): Promise<Track>{
      if(!file && !createTrackDto.title){
        throw new BadRequestException(`Must send a file or specify a track title`);
      } else if(!file && (createTrackDto.title && createTrackDto.path)) {  
        return this.trackService.createTrack(createTrackDto, user, null);
      } else if(file) {
        return this.utilitiesService.createTrack(createTrackDto, user, file.filename);
      } else {
        throw new BadRequestException(`You have a title but no path`);
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
          destination: './files/audio',
          filename: editFileName,
        }),
        fileFilter: audioFileFilter,
      }),
    )
    modifyTrack(@Param('id', ParseIntPipe) id: number, @GetUser() user: User, @Body() modifyTrackDto: modifyTrackDto, file: Express.Multer.File): Promise<Track>{
      if(file){
        return this.trackService.modifyTrack(id, user, modifyTrackDto, file.filename);
      } else {
        return this.trackService.modifyTrack(id, user, modifyTrackDto, null);
      }
      
    }
    
}
