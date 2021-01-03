import { IsMongoId, IsString, IsDate } from "class-validator";

export class UserDTO{
    @IsString()
    @IsMongoId()
    id: string;
    
    @IsString()
    name?: string;
    
    @IsString()
    email?: string;

    @IsString()
    password?: string;
}