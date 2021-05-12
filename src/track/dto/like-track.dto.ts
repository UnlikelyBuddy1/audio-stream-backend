import { IsBoolean, IsNotEmpty } from 'class-validator';

export class likeTrackDto {
    @IsNotEmpty()
    @IsBoolean()
    liked: number;
}