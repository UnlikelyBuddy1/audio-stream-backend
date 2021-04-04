import { Optional } from '@nestjs/common';
import { IsNotEmpty } from 'class-validator';


export class createAlbumDto {
    @IsNotEmpty()
    name : string;

    @Optional()
    trackIds :number[];

    @Optional()
    artistIds: number[];
}