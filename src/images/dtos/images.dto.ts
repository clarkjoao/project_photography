import { IsBoolean, IsMongoId, IsString } from "class-validator";

export class ImagesDTO{
    @IsString()
    @IsMongoId()
    id: string;
    
    @IsString()
    name?: string;
    
    @IsString()
    link?: string;

    @IsString()
    @IsMongoId()
    album?: string;

    @IsBoolean()
    isPublished?: boolean;
}