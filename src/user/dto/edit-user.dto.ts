import { IsEmail, IsOptional, IsString } from "class-validator";

export class EditUserDto {
  @IsEmail()
  @IsOptional()
  @IsString()
  email?: string;

  @IsOptional()
  @IsString()
  firstName?: string;

  @IsOptional()
  @IsString()
  lastName?: string;
}
