import { Body, Controller, Get, Post, Param, Delete, Patch, UsePipes, ValidationPipe, ParseIntPipe, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/get-user.decorator';
import { Track } from 'src/entities/track.entity';
import { User } from 'src/entities/user.entity';
import { createTrackDto } from './dto/create-track.dto';
import { GetTracksFilterDto } from './dto/get-tracks-filter.dto';
import { TrackService } from './track.service';


@Controller('track')
//@UseGuards(AuthGuard())
export class TrackController {
    constructor(private trackService: TrackService){}

    @Get('/:id')
    getTrackById(@Param('id', ParseIntPipe) id : number, @GetUser() user: User): Promise<Track>{
        console.log("reçu requete")
        return this.trackService.getTrackById(id, user);
    }

    @Post()
    @UsePipes(ValidationPipe)
    createTrack(@Body() createTrackDto: createTrackDto, @GetUser() user: User): Promise<Track>{
        console.log("someone posted a song")
        return this.trackService.createTrack(createTrackDto, user);
    }


    @Delete('/:id')
    deleteTrack(@Param('id', ParseIntPipe) id: number, @GetUser() user: User): Promise<void> {
        return this.trackService.deleteTrack(id, user);
    }

    /*
    @Patch('/:id/status')
    updateTrack (
    @Param('id', ParseIntPipe) id: number,
    @GetUser() user: User,
    @Body('title', TrackValidationPipe)  status : TrackStatus) : Promise<Track> {
        return this.tracksService.updateTrackStatus(id,status, user);
    }
*/
    @Get()
    getTracks(@Query(ValidationPipe) filterDto: GetTracksFilterDto, @GetUser() user: User): Promise<Track[]>  {
        return this.trackService.getTracks(filterDto, user);
    }
    
}
