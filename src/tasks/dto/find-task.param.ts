import { IsEnum, IsOptional } from "class-validator";
import { TaskStatus } from "../tasks.model";

export class FindTaskParam {
    @IsOptional()
    @IsEnum(TaskStatus)
    status?: TaskStatus;

}