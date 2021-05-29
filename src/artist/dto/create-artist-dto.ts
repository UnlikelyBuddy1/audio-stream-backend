import { IsNotEmpty, IsOptional } from 'class-validator';

export class createArtistDto {
    @IsNotEmpty()
    name : string;

    @IsOptional()
    trackIds :number[];

    @IsOptional()
    albumIds :number[];
}