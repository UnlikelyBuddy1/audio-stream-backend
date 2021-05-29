import { IsNotEmpty, IsOptional } from 'class-validator';


export class createPlaylistDto {
    @IsNotEmpty()
    name : string;

    @IsOptional()
    trackIds :number[];
}