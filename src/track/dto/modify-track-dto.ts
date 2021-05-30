import {IsOptional} from 'class-validator';

export class modifyTrackDto {
    @IsOptional()
    title : string;

    @IsOptional()
    path :string;

    @IsOptional()
    bpm :number;

    @IsOptional()
    genreIds: number[];

    @IsOptional()
    albumIds: number[];

    @IsOptional()
    artistIds: number[];
}