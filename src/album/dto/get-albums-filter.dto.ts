import { IsNotEmpty, IsNumberString, IsOptional } from 'class-validator';

export class GetAlbumsFilterDto {
    @IsNotEmpty()
    search: string;

    @IsNotEmpty()
    @IsNumberString()
    index: number;

    @IsOptional()
    @IsNumberString()
    size: number;

}