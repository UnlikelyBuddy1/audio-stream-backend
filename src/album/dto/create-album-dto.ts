import { IsNotEmpty } from 'class-validator';
import { Artist } from 'src/track/entities/artist.entity';
import { Track } from 'src/track/entities/track.entity';

export class createAlbumDto {
    @IsNotEmpty()
    name : string;

    @IsNotEmpty()
    tracks :Track[];

    @IsNotEmpty()
    artists: Artist[];
}