import { IsOptional } from "class-validator";

export class modifyArtistDto {
    @IsOptional()
    name : string;

    @IsOptional()
    albumIds :number[];

    @IsOptional()
    trackIds: number[];
}