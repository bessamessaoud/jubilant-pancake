import { Expose } from "class-transformer";
import { Task } from "../tasks/entities/tasks.entity";
import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany } from "typeorm";
import { Role } from "./enums/role.enum";

@Entity()
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    @Expose()
    name: string;

    @Column()
    @Expose()
    email: string;
    
    @Column()
    password: string;

    @CreateDateColumn()
    @Expose()
    createdAt: Date;

    @UpdateDateColumn()
    @Expose()
    updatedAt: Date;

    @OneToMany(() => Task, task => task.user)
    @Expose()
    tasks : Task[];

    @Column('text', {array:true, default:[Role.USER]})
    @Expose()
    roles : Role[]
}