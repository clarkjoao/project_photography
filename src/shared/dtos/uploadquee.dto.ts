import { IsMongoId, IsString } from "class-validator";

export class UploadQueeDTO{
    
    @IsString()
    @IsMongoId()
    albumID: string;
    
    @IsString()
    @IsMongoId()
    imageID: string;

    file?: Express.Multer.File;
}