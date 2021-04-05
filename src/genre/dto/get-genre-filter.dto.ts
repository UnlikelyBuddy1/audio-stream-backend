import { IsNotEmpty } from 'class-validator';

export class GetGenresFilterDto {
    @IsNotEmpty()
    search: string;
}