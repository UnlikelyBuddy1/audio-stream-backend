import { Optional } from '@nestjs/common';


export class modifyPlaylistDto {
    @Optional()
    name : string;

    @Optional()
    trackIds :number[];
}