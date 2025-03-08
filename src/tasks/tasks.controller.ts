import { BadRequestException, Body, Controller, Delete, ForbiddenException, Get, HttpCode, HttpStatus, NotFoundException, Param, Patch, Post, Query, Request } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { FindOneParams } from './find-one.params';
import { UpdateTaskDto } from './dto/update-task.dto';
import { WrongStatusTransitionException } from './exceptions/wrong-task-status.exception';
import { Task } from './entities/tasks.entity';
import { TaskLabel } from './entities/task-label.entity';
import { CreateTaskLabelDto } from './dto/create-task-label.dto';
import { FindTaskParam } from './dto/find-task.param';
import { PaginationParams } from '../common/pagination.params';
import { PaginationResponse } from '../common/pagination.response';
import { AuthRequest } from '../users/dto/auth.request';
import { CurrentUserId } from '../users/decorators/current-user-id';


@Controller('tasks')
export class TasksController {
    constructor(private readonly taskservice: TasksService) { }
    @Get()
    public async findAll
        (@Query() pagination: PaginationParams, @CurrentUserId() userId: string)
        : Promise<PaginationResponse<Task>> {
        const [items, total] = await this.taskservice.findAll(pagination, userId);

        return {
            data: items,
            meta: {
                total,
                ...pagination
                // offset: pagination.offset,
                // limit: pagination.limit
            }
        };
    }

    @Get('/:id')
    public async findOne(
        @Param() params: FindOneParams,
        @CurrentUserId() userId: string
    ): Promise<Task | null> {
        const task = await this.findOneOrFail(params.id);
        this.checkTaskOwnership(task, userId);
        return task;
    }

    @Post()
    public async create(
        @Body() taskDto: CreateTaskDto,
        @CurrentUserId() userId: string): Promise<Task> {
        const task = await this.taskservice.createTask({ ...taskDto, userId });
        this.checkTaskOwnership(task, userId);
        return task;
    }

    // @Patch(':id/status')
    // public updateTAskStatus(
    //     @Param() params : FindOneParams,
    //     @Body() status : UpdateStatusTaskDto
    // ): Promise<Task> {
    //     const task = this.findOneOrFail(params.id);
    //     task.status = status.status;
    //     return task;
    // }

    @Patch(':id')
    public async updateTAskStatus(
        @Param() params: FindOneParams,
        @Body() taskdto: UpdateTaskDto,
        @CurrentUserId() userId: string
    ): Promise<Task> {

        const task = await this.findOneOrFail(params.id);
        this.checkTaskOwnership(task, userId);
        try {
            return await this.taskservice.updateTask(task, taskdto);
        } catch (error) {
            if (error instanceof WrongStatusTransitionException) {
                throw new BadRequestException(error.message);
            }
            throw error;
        }
    }

    @Delete('/:id')
    @HttpCode(HttpStatus.NO_CONTENT)
    public async delete(
        @Param() params: FindOneParams,
        @CurrentUserId() userId: string
    ): Promise<void> {
        const task = await this.findOneOrFail(params.id);
        this.checkTaskOwnership(task, userId)
        await this.taskservice.removeTask(params.id);
    }

    @Post(':id/labels')
    public async addLabels(
        @Body() labels: CreateTaskLabelDto[],
        @Param() { id }: FindOneParams,
        @CurrentUserId() userId: string): Promise<Task> {
        const task = await this.findOneOrFail(id);
        this.checkTaskOwnership(task, userId)
        return this.taskservice.addLabels(task, labels);
    }

    @Delete('/:id/labels')
    @HttpCode(HttpStatus.NO_CONTENT)
    public async deleteLabels(
        @Param() { id }: FindOneParams,
        @Body() labels: string[],
        @CurrentUserId() userId: string
    ): Promise<void> {
        const task = await this.findOneOrFail(id);
        this.checkTaskOwnership(task, userId)
        await this.taskservice.removeLabel(task, labels);
    }
    private async findOneOrFail(id: string): Promise<Task> {
        const task = await this.taskservice.findOne(id);
        if (task) {
            return task;
        }
        throw new NotFoundException('Task not found');
    }

    private checkTaskOwnership(task: Task, userId: string): void {
        if (task.userId !== userId)
            throw new ForbiddenException('You can only access your tasks!')
    }
}