import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    ManyToMany,
    ManyToOne,
    OneToMany,
    UpdateDateColumn,
} from 'typeorm';

import { Condition } from '../../conditions/entities/conditions.entity';
import { User } from '../../users/entities/user.entity';
import { MeasurementValue } from './measurement-values.entity';

@Entity('measurements')
export class Measurement {
    @Column({ type: 'varchar', primary: true, length: 36, default: () => 'uuid_generate_v4()' })
    public id!: string;

    @Column()
    public name!: string;

    @Column()
    public unit!: string;

    @Column({ default: false })
    public displayTime!: boolean;

    @ManyToOne(() => User, (user: User) => user.measurements)
    public user!: User;

    @ManyToMany(() => Condition, (condition: Condition) => condition.measurements, {})
    public conditions!: Condition[];


    @OneToMany(() => MeasurementValue, (measurementValue: MeasurementValue) => measurementValue.measurement)
    public measurementValues!: MeasurementValue[];

    @CreateDateColumn({ type: 'timestamptz', default: () => 'NOW()' })
    public createdAt!: Date;

    @UpdateDateColumn({ type: 'timestamptz', default: () => 'NOW()' })
    public updatedAt!: Date;

    @DeleteDateColumn({ type: 'timestamptz', nullable: true })
    public deletedAt!: Date | null;
}
