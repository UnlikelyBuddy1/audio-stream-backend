import { IsNotEmpty } from 'class-validator';

export class GetTracksFilterDto {
    @IsNotEmpty()
    search: string;
}