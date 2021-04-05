import { IsNotEmpty, IsOptional } from 'class-validator';

export class GetArtistsFilterDto {
    @IsNotEmpty()
    search: string;
}