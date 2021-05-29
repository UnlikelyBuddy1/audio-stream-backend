import { IsOptional } from "class-validator";

export class modifyAlbumDto {
    @IsOptional()
    name : string;

    @IsOptional()
    genreIds :number[];

    @IsOptional()
    artistIds: number[];
}