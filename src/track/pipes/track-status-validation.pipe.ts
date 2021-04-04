import { BadRequestException, PipeTransform } from "@nestjs/common";

export class TrackStatusValidationPipe implements PipeTransform {
    readonly allowedStatuses = [
    ];
    transform(value : any){
        value = value.toUpperCase();
        if(!this.isStatusValid(value)){
            throw new BadRequestException(`"${value}" is an invalid status`);
        }
        return value;
    }
    private isStatusValid(status: any){
        const idx = this.allowedStatuses.indexOf(status);
        return idx !== -1;
    }
}

/* make sure the tracks name has at least one char, it has an artist, etc */