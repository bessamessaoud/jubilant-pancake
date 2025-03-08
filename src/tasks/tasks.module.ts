import { Module } from '@nestjs/common';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { Task } from './entities/tasks.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaskLabel } from './entities/task-label.entity';
@Module({
  imports: [TypeOrmModule.forFeature([Task, TaskLabel])],
  providers: [TasksService],
  controllers: [TasksController]  
})
export class TasksModule {}
