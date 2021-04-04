import { IsNotEmpty, IsOptional } from 'class-validator';

export class GetTracksFilterDto {
    @IsNotEmpty()
    search: string;
}