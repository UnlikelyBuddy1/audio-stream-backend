import { IsOptional } from "class-validator";



export class modifyPlaylistDto {
    @IsOptional()
    name : string;

    @IsOptional()
    trackIds :number[];
}