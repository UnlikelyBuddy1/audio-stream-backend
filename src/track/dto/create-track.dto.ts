import { IsNotEmpty} from 'class-validator';

export class createTrackDto {
    @IsNotEmpty()
    title : string;

    @IsNotEmpty()
    path :string;
}