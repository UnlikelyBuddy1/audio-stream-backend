import { IsNotEmpty, IsNumberString, IsOptional } from 'class-validator';

export class GetArtistsFilterDto {
    @IsNotEmpty()
    search: string;

    @IsNotEmpty()
    @IsNumberString()
    index: number;

    @IsOptional()
    @IsNumberString()
    size: number;
}