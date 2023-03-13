import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    JoinTable,
    ManyToMany,
    OneToMany,
    UpdateDateColumn,
} from 'typeorm';

import { MeasurementPreset } from '../../measurements/entities/measurement-presets.entity';
import { Condition } from './conditions.entity';

@Entity('condition_presets')
export class ConditionPreset {
    @Column({ type: 'varchar', primary: true, length: 36, default: () => 'uuid_generate_v4()' })
    public id!: string;

    @Column()
    public name!: string;

    @OneToMany(() => Condition, (condition: Condition) => condition.conditionPreset)
    public conditions!: Condition[];

    @ManyToMany(() => MeasurementPreset, (measurementPreset: MeasurementPreset) => measurementPreset.conditionPresets)
    @JoinTable({
        name: 'conditions_measurements_presets',
    })
    public measurementPresets!: MeasurementPreset[];

    @Column('simple-array', { array: true })
    public recommended!: string[];

    @Column('simple-array', { array: true })
    public limited!: string[];

    @Column('simple-array', { array: true })
    public forbidden!: string[];

    @CreateDateColumn({ type: 'timestamptz', default: () => 'NOW()' })
    public createdAt!: Date;

    @UpdateDateColumn({ type: 'timestamptz', default: () => 'NOW()' })
    public updatedAt!: Date;

    @DeleteDateColumn({ type: 'timestamptz', nullable: true })
    public deletedAt!: Date | null;
}
