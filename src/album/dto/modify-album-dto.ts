import { Optional } from '@nestjs/common';
export class modifyAlbumDto {
    @Optional()
    name : string;

    @Optional()
    genreIds :number[];

    @Optional()
    artistIds: number[];
}