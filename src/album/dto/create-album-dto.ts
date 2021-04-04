import { Optional } from '@nestjs/common';
import { IsNotEmpty } from 'class-validator';
import { Artist } from 'src/entities/artist.entity';
import { Track } from 'src/entities/track.entity';


export class createAlbumDto {
    @IsNotEmpty()
    name : string;

    @Optional()
    tracks :Track[];

    @Optional()
    artists: Artist[];
}