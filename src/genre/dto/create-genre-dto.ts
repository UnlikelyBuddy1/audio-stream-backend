
import { IsNotEmpty, IsOptional } from 'class-validator';
export class createGenreDto {
    @IsNotEmpty()
    name : string;

    @IsOptional()
    trackIds :number[];

    @IsOptional()
    albumIds: number[];
}