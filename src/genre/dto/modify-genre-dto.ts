import { Optional } from '@nestjs/common';
export class modifyGenreDto {
    @Optional()
    name : string;

    @Optional()
    trackIds :number[];

    @Optional()
    albumIds: number[];
}