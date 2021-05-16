import {IsOptional} from 'class-validator';

export class modifyTrackDto {
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