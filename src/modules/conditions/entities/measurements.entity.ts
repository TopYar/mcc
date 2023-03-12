import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    ManyToMany,
    ManyToOne,
    UpdateDateColumn,
} from 'typeorm';

import { User } from '../../users/entities/user.entity';
import { Condition } from './conditions.entity';

@Entity('measurements')
export class Measurement {
    @Column({ type: 'varchar', primary: true, length: 36, default: () => 'uuid_generate_v4()' })
    public id!: string;

    @Column()
    public name!: string;

    @Column()
    public unit!: string;

    @ManyToOne(() => User, (user: User) => user.measurements)
    public user!: User;

    @ManyToMany(() => Condition, (condition: Condition) => condition.measurements, {})
    public conditions!: Condition[];

    @CreateDateColumn({ type: 'timestamptz', default: () => 'NOW()' })
    public createdAt!: Date;

    @UpdateDateColumn({ type: 'timestamptz', default: () => 'NOW()' })
    public updatedAt!: Date;

    @DeleteDateColumn({ type: 'timestamptz', nullable: true })
    public deletedAt!: Date | null;
}
