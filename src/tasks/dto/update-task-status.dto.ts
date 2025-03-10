import { IsEnum, IsNotEmpty } from "class-validator";
import { TaskStatus } from "../tasks.model";

export class UpdateStatusTaskDto {

    @IsNotEmpty()
    @IsEnum(TaskStatus)
    status: TaskStatus;
} 