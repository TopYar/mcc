import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    ManyToMany,
    ManyToOne,
    UpdateDateColumn,
} from 'typeorm';

import { ConditionPreset } from '../../conditions/entities/condition-presets.entity';

@Entity('measurement_presets')
export class MeasurementPreset {
    @Column({ type: 'varchar', primary: true, length: 36, default: () => 'uuid_generate_v4()' })
    public id!: string;

    @Column()
    public name!: string;

    @Column({ nullable: true })
    public name_ru!: string;

    @Column()
    public unit!: string;

    @Column({ nullable: true })
    public unit_ru!: string;

    @Column({ default: false })
    public displayTime!: boolean;

    @ManyToMany(() => ConditionPreset, (conditionPreset: ConditionPreset) => conditionPreset.measurementPresets, {})
    public conditionPresets!: ConditionPreset[];

    @CreateDateColumn({ type: 'timestamptz', default: () => 'NOW()' })
    public createdAt!: Date;

    @UpdateDateColumn({ type: 'timestamptz', default: () => 'NOW()' })
    public updatedAt!: Date;

    @DeleteDateColumn({ type: 'timestamptz', nullable: true })
    public deletedAt!: Date | null;
}
