import {IsOptional} from 'class-validator';

export class createTrackDto {
    @IsOptional()
    title : string;

    @IsOptional()
    path :string;

    @IsOptional()
    genreIds: number[];

    @IsOptional()
    albumIds: number[];

    @IsOptional()
    artistIds: number[];
}