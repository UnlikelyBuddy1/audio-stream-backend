import { IsNotEmpty, IsNumberString, IsOptional, MaxLength } from 'class-validator';

export class GetGenresFilterDto {
    @IsOptional()
    search: string;

    @IsNotEmpty()
    @IsNumberString()
    index: number;

    @IsOptional()
    @IsNumberString()
    @MaxLength(3)
    size: number;
}