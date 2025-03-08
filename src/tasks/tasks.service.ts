import { ForbiddenException, Injectable } from '@nestjs/common';
import { TaskStatus } from './tasks.model';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { WrongStatusTransitionException } from './exceptions/wrong-task-status.exception';
import { FindOptionsWhere, Like, Repository } from 'typeorm';
import { Task } from './entities/tasks.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateTaskLabelDto } from './dto/create-task-label.dto';
import { TaskLabel } from './entities/task-label.entity';
import { FindTaskParam } from './dto/find-task.param';
import { PaginationParams } from '../common/pagination.params';

@Injectable()
export class TasksService {

    constructor(
        @InjectRepository(Task)
        private readonly tasksRepository : Repository<Task>,
        @InjectRepository(TaskLabel)
        private readonly taskLabelRepository : Repository<TaskLabel>
    ) {}


    public async findAll(
        pagination : PaginationParams,
        userId : string
    ): Promise<[Task[], number]> {
        const query = this.tasksRepository.createQueryBuilder('task')
        .leftJoinAndSelect('task.labels', 'label');
        console.log(userId);
        query.andWhere('task.userId = :userId',{userId})
        if(pagination.status) {
            query.andWhere('task.status = :status', {status: pagination.status});
        }
        if(pagination.search?.trim()) {
            query.andWhere('task.title LIKE :search OR task.description LIKE :search', {search: `%${pagination.search}%`});
        }
        if(pagination.labels?.length) {
            const subQuery = query.subQuery().select('labels.taskId').from('task_label', 'labels').where('labels.name IN (:...labels)', {labels: pagination.labels}).getQuery();
            query.andWhere(`task.id IN ${subQuery}`);
        }
        query.skip(pagination.offset).take(pagination.limit);
        query.orderBy(`task.${pagination.sortBy}`, pagination.sortOrder);
        return await query.getManyAndCount();
        // const where: FindOptionsWhere<Task>[] = [];
        // if(pagination.status) {
        //     where.push({status : pagination.status});
        // }
        // if(pagination.search?.trim()) {
        //     where.push({title : Like(`%${pagination.search}%`)}) ;
        //     where.push({description : Like(`%${pagination.search}%`)});
        // }
        // return await this.tasksRepository.findAndCount({
        //     where,
        //     relations: ['labels'],
        //     skip : pagination.offset,
        //     take : pagination.limit,
        // });
    }

    public async findOne(id: string): Promise<Task | null> {
        return await this.tasksRepository.findOne({
            where: {
                id
            },
            relations: ['labels']

        });
    }

    public async createTask(taskDto: CreateTaskDto): Promise<Task> {
        if(taskDto.labels) {
            taskDto.labels = this.getUniqueLabels(taskDto.labels);
        }
        return await this.tasksRepository.save(taskDto);        
    }

    public async updateTask(task : Task, taskDto :UpdateTaskDto): Promise<Task> {
        if(taskDto.status && !this.isValidStatusTransition(task.status, taskDto.status)) {
            throw new WrongStatusTransitionException();
        }
        if(taskDto.labels) {
            taskDto.labels = this.getUniqueLabels(taskDto.labels);
        }
        Object.assign(task, taskDto);
        return await this.tasksRepository.save(task);
    }

    public async removeTask(id: string): Promise<void> {        
        await this.tasksRepository.delete(id);
    }

    public async addLabels(task : Task, labelsDto : CreateTaskLabelDto[]) : Promise<Task> {
        const names = new Set(task.labels.map(label => label.name));
        const labels = this.getUniqueLabels(labelsDto).filter(label => !names.has(label.name))
        .map(label => this.taskLabelRepository.create(label));
        
        
        if(labels.length) {
            task.labels = [...task.labels, ...labels];
            return await this.tasksRepository.save(task);
        }
        return task;
    }

    public async removeLabel(task : Task, labels : string[]) : Promise<void> {
        task.labels = task.labels.filter(label =>  !labels.includes(label.name));
        await this.tasksRepository.save(task);
    }

    private isValidStatusTransition(currentStatus: TaskStatus, newStatus: TaskStatus): boolean {
        const statusOrder = [
            TaskStatus.OPEN,
            TaskStatus.IN_PROGRESS,
            TaskStatus.DONE
        ];
        return statusOrder.indexOf(currentStatus) <= statusOrder.indexOf(newStatus);
    }
    private getUniqueLabels(labels: CreateTaskLabelDto[]): CreateTaskLabelDto[] {
        const uniqueNames = [...new Set(labels.map(label => label.name))];
        return uniqueNames.map((name) => ({name}));
    }



}
