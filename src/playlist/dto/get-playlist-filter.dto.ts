import { IsNotEmpty, IsNumberString, IsOptional, MaxLength } from 'class-validator';

export class GetPlaylistsFilterDto {
    @IsOptional()
    search: string;

    @IsNotEmpty()
    @IsNumberString()
    index: number;

    @IsOptional()
    @IsNumberString()
    @MaxLength(2)
    size: number;
}