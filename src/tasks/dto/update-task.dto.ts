import { IsEnum, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { TaskStatus } from "../tasks.model";
import { CreateTaskDto } from "./create-task.dto";
import { PartialType } from "@nestjs/mapped-types";

export class UpdateTaskDto extends PartialType(CreateTaskDto) {

} 