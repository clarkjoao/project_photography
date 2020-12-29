import { IsBoolean, IsEmpty, IsMongoId, IsString } from "class-validator";

export class ImagesDTO{
    @IsString()
    @IsMongoId()
    id: string;
    
    @IsString()
    name?: string;
    
    @IsString()
    @IsEmpty()
    link?: string;

    @IsString()
    @IsMongoId()
    album?: string;

    @IsBoolean()
    isPublished?: boolean;
}

export class ImageQueeDTO{
    
    @IsString()
    @IsMongoId()
    albumID: string;
    
    @IsString()
    @IsMongoId()
    imageID: string;
    
    file;
}