import { Column, CreateDateColumn, Entity, Index, ManyToOne, OneToMany, PrimaryGeneratedColumn, Unique, UpdateDateColumn } from "typeorm";
import { Task } from "./tasks.entity";

@Entity()
@Unique(['name','taskId'])
export class TaskLabel {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name : string;

    @Column()
    @Index()
    taskId : string;

    @ManyToOne(() => Task, task => task.labels,
    {onDelete : 'CASCADE',
    orphanedRowAction : 'delete'}
    )
    task : Task;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

}