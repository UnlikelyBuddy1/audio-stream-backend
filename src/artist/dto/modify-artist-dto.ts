import { Optional } from '@nestjs/common';
export class modifyArtistDto {
    @Optional()
    name : string;

    @Optional()
    albumIds :number[];

    @Optional()
    trackIds: number[];
}