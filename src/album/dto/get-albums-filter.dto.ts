import { IsNotEmpty, IsOptional } from 'class-validator';

export class GetAlbumsFilterDto {
    @IsNotEmpty()
    search: string;
}