import { IsOptional } from "class-validator";

export class modifyGenreDto {
    @IsOptional()
    name : string;

    @IsOptional()
    trackIds :number[];

    @IsOptional()
    albumIds: number[];
}