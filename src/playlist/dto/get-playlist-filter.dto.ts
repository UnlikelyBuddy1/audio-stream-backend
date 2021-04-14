import { Optional } from '@nestjs/common';

export class GetPlaylistsFilterDto {
    @Optional()
    search: string;
}