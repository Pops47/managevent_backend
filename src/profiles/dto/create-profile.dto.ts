import { IsNotEmpty, IsOptional, IsString } from "class-validator"


export class CreateProfileDto {
    
    @IsNotEmpty()
    @IsString()
    userId: string

    @IsNotEmpty()
    @IsString()
    firstname: string

    @IsNotEmpty()
    @IsString()
    lastname: string

    @IsNotEmpty()
    @IsString()
    nickname: string

    @IsString()
    @IsOptional()
    avatarPath: string
}
