import { Column, PrimaryGeneratedColumn } from 'typeorm';

export class UserEntity {
    @PrimaryGeneratedColumn()
    id!: string;

    @Column()
    name!: string;
}
