import { IsBooleanString, IsNotEmpty} from 'class-validator';

export class likeTrackDto {
    @IsNotEmpty()
    trackId : string;

    @IsBooleanString()
    liked :string;
}