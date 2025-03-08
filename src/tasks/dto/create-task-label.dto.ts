import { IsEnum, IsNotEmpty, IsString, IsUUID, MaxLength } from "class-validator";
import { TaskStatus } from "../tasks.model";

export class CreateTaskLabelDto {
    @IsNotEmpty()
    @IsString()
    @MaxLength(50)
    name: string;
} 