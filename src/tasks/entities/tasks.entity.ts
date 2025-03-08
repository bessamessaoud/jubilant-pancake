import { Column, CreateDateColumn, Entity, Index, ManyToOne, OneToMany, PrimaryGeneratedColumn, Unique, UpdateDateColumn } from "typeorm";
import { TaskStatus } from "../tasks.model";
import { TaskLabel } from "./task-label.entity";
import { User } from "../../users/users.entity";
@Entity()
export class Task {
    @PrimaryGeneratedColumn('uuid')
    id: string;


    @Column({
        type: 'varchar',
        length: 100,
        nullable: false
    })
    title: string;


    @Column({
        type: 'text',
        nullable: false
    })
    description: string;


    @Column({
        enum: TaskStatus,
        default: TaskStatus.OPEN
    })
    status: TaskStatus;

    @Column()
    @Index()
    userId: string;

    @ManyToOne(() => User, user => user.tasks, { nullable: false })
    user: User;

    @OneToMany(() => TaskLabel, label => label.task, {
        cascade: true
    })
    labels: TaskLabel[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}