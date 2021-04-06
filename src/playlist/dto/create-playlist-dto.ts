import { Optional } from '@nestjs/common';
import { IsNotEmpty } from 'class-validator';


export class createPlaylistDto {
    @IsNotEmpty()
    name : string;

    @Optional()
    trackIds :number[];
}