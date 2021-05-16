import { IsNotEmpty, IsNumberString, IsOptional } from 'class-validator';

export class GetGenresFilterDto {
    @IsNotEmpty()
    search: string;

    @IsNotEmpty()
    @IsNumberString()
    index: number;

    @IsOptional()
    @IsNumberString()
    size: number;
}