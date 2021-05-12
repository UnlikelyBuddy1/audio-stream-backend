import { IsNotEmpty, IsOptional} from 'class-validator';

export class createTrackDto {
    @IsNotEmpty()
    title : string;

    @IsOptional()
    path :string;

    
}