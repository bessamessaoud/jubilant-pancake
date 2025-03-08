import { Transform, Type } from "class-transformer";
import { IsOptional, IsInt, Min, Max, IsEnum, IsString, MinLength, IsIn } from "class-validator";
import { TaskStatus } from "../tasks/tasks.model";

export class PaginationParams {

    @Type(() => Number)
    @IsOptional()
    @IsInt()
    @Min(1)
    @Max(100)
    limit: number = 10;

    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(0)
    offset: number = 0;

    @IsOptional()
    @IsEnum(TaskStatus)
    status?: TaskStatus;

    @IsOptional()
    @MinLength(3)
    @IsString()
    search?: string;

    @IsOptional()
    //@IsString()
    @Transform(({ value}:{value?:string }) => {
        if (!value) {
            return undefined;
        }
        return value.split(',').map((label) => label.trim()).filter(Boolean);
    }
    )
    labels?: string[];

    @IsOptional()
    @IsIn(['createdAt','title', 'description', 'status'])
    sortBy?: string = 'createdAt';

    @IsOptional()
    @IsEnum(['ASC', 'DESC'])
    sortOrder?: 'ASC' | 'DESC'='DESC';
}