
import { IsNotEmpty, IsOptional } from 'class-validator';
export class createAlbumDto {
    @IsNotEmpty()
    name : string;

    @IsOptional()
    genreIds :number[];

    @IsOptional()
    artistIds: number[];
}