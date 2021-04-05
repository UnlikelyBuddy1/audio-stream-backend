import { IsNotEmpty } from 'class-validator';


export class createGenreDto {
    @IsNotEmpty()
    name : string;
}