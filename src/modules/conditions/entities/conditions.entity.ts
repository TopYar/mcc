import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    JoinTable,
    ManyToMany,
    ManyToOne,
    UpdateDateColumn,
} from 'typeorm';

import { Measurement } from '../../measurements/entities/measurements.entity';
import { User } from '../../users/entities/user.entity';
import { ConditionPreset } from './condition-presets.entity';

@Entity('conditions')
export class Condition {
    @Column({ type: 'varchar', primary: true, length: 36, default: () => 'uuid_generate_v4()' })
    public id!: string;

    @Column()
    public name!: string;

    @ManyToOne(() => User, (user: User) => user.conditions)
    public user!: User;

    @ManyToMany(() => Measurement, (measurement: Measurement) => measurement.conditions)
    @JoinTable({
        name: 'conditions_measurements',
    })
    public measurements!: Measurement[];

    @ManyToOne(() => ConditionPreset, (conditionPreset: ConditionPreset) => conditionPreset.conditions)
    public conditionPreset!: ConditionPreset;

    @CreateDateColumn({ type: 'timestamptz', default: () => 'NOW()' })
    public createdAt!: Date;

    @UpdateDateColumn({ type: 'timestamptz', default: () => 'NOW()' })
    public updatedAt!: Date;

    @DeleteDateColumn({ type: 'timestamptz', nullable: true })
    public deletedAt!: Date | null;
}
