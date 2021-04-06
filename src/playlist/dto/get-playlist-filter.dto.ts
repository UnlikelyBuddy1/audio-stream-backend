import { IsNotEmpty } from 'class-validator';

export class GetPlaylistsFilterDto {
    @IsNotEmpty()
    search: string;
}