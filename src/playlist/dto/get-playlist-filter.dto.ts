import { IsNotEmpty, IsNumberString, IsOptional } from 'class-validator';

export class GetPlaylistsFilterDto {
    @IsOptional()
    search: string;

    @IsNotEmpty()
    @IsNumberString()
    index: number;

    @IsOptional()
    @IsNumberString()
    size: number;
}