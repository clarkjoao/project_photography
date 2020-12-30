import { IsNumber, IsMongoId, IsString, IsDate } from "class-validator";

export class AlbunsDTO{
    @IsString()
    @IsMongoId()
    id: string;
    
    @IsString()
    name?: string;
    
    @IsString()
    location?: string;

    @IsString()
    link?: string;

    @IsDate()
    date?: Date;

    @IsNumber()
    photoCounter?: number;
}