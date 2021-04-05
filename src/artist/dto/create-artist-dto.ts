import { Optional } from '@nestjs/common';
import { IsNotEmpty } from 'class-validator';

export class createArtistDto {
    @IsNotEmpty()
    name : string;

    @Optional()
    trackIds :number[];
}